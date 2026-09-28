import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getDb, runQuery, runExec } from './db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'bestwegive_agency_secure_jwt_2026_bronx';

// Simple in-memory rate limiter for login
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return true;
  }
  if (now > record.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return true;
  }
  if (record.count >= 8) {
    return false;
  }
  record.count += 1;
  return true;
}

// Authentication Middleware
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'CONTENT_ADMIN' | 'BOOKING_ADMIN';
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as AuthUser;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    if (user.role === 'SUPER_ADMIN' || roles.includes(user.role)) {
      return next();
    }
    return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
  };
}

// Ensure DB is initialized
router.use(async (req, res, next) => {
  try {
    await getDb();
    next();
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({ error: 'Database initialization failed' });
  }
});

// ==================== AUTHENTICATION ====================

router.post('/auth/login', async (req: Request, res: Response) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many login attempts. Please try again after 15 minutes.' });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const users = runQuery<any>('SELECT * FROM admin_users WHERE email = ?', [email.trim().toLowerCase()]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];
    if (!user.is_active) {
      return res.status(403).json({ error: 'Account is deactivated. Contact Super Admin.' });
    }

    const isValid = bcrypt.compareSync(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    runExec('UPDATE admin_users SET last_login = ? WHERE id = ?', [new Date().toISOString(), user.id]);

    const tokenPayload: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        last_login: user.last_login
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Login failed' });
  }
});

router.get('/auth/me', authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user;
  const dbUsers = runQuery<any>('SELECT id, email, name, role, is_active, last_login, created_at FROM admin_users WHERE id = ?', [user.id]);
  if (dbUsers.length === 0) return res.status(404).json({ error: 'User not found' });
  res.json({ user: dbUsers[0] });
});

router.post('/auth/change-password', authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { currentPassword, newPassword } = req.body;

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long' });
  }

  const dbUsers = runQuery<any>('SELECT * FROM admin_users WHERE id = ?', [user.id]);
  if (dbUsers.length === 0) return res.status(404).json({ error: 'User not found' });

  const existing = dbUsers[0];
  if (!bcrypt.compareSync(currentPassword, existing.password_hash)) {
    return res.status(400).json({ error: 'Current password is incorrect' });
  }

  const salt = bcrypt.genSaltSync(10);
  const newHash = bcrypt.hashSync(newPassword, salt);
  runExec('UPDATE admin_users SET password_hash = ? WHERE id = ?', [newHash, user.id]);

  res.json({ message: 'Password changed successfully' });
});

// ==================== WEBSITE SETTINGS ====================

router.get('/settings', (req: Request, res: Response) => {
  const rows = runQuery<{ key: string; value: string }>('SELECT key, value FROM website_settings');
  const settingsObj: Record<string, string> = {};
  for (const r of rows) {
    settingsObj[r.key] = r.value;
  }
  res.json(settingsObj);
});

router.put('/settings', authMiddleware, requireRole('SUPER_ADMIN'), (req: Request, res: Response) => {
  const updates = req.body as Record<string, string>;
  for (const [key, value] of Object.entries(updates)) {
    // If whatsapp_number changed, auto-sync whatsapp_link if not explicitly overridden
    if (key === 'whatsapp_number' && !updates['whatsapp_link']) {
      const cleanPhone = String(value).replace(/[^0-9]/g, '');
      const waLink = `https://wa.me/${cleanPhone}`;
      runExec('INSERT OR REPLACE INTO website_settings (key, value) VALUES (?, ?)', ['whatsapp_link', waLink]);
    }
    runExec('INSERT OR REPLACE INTO website_settings (key, value) VALUES (?, ?)', [key, String(value)]);
  }
  res.json({ message: 'Settings updated successfully' });
});

// ==================== SOCIAL MEDIA ====================

router.get('/social', (req: Request, res: Response) => {
  const rows = runQuery<any>('SELECT * FROM social_media_links');
  res.json(rows);
});

router.put('/social', authMiddleware, requireRole('SUPER_ADMIN', 'CONTENT_ADMIN'), (req: Request, res: Response) => {
  const { links } = req.body; // array of { platform, url, is_enabled }
  if (Array.isArray(links)) {
    for (const l of links) {
      runExec('INSERT OR REPLACE INTO social_media_links (platform, url, is_enabled) VALUES (?, ?, ?)', [
        l.platform,
        l.url || '',
        l.is_enabled ? 1 : 0
      ]);
    }
  }
  res.json({ message: 'Social links updated successfully' });
});

// ==================== SERVICES ====================

router.get('/services', (req: Request, res: Response) => {
  const includeUnpublished = req.query.all === 'true';
  const query = includeUnpublished
    ? 'SELECT * FROM services ORDER BY display_order ASC, created_at DESC'
    : 'SELECT * FROM services WHERE is_published = 1 ORDER BY display_order ASC, created_at DESC';
  const rows = runQuery<any>(query);
  const parsed = rows.map(r => ({
    ...r,
    features: JSON.parse(r.features || '[]')
  }));
  res.json(parsed);
});

router.post('/services', authMiddleware, requireRole('SUPER_ADMIN', 'CONTENT_ADMIN'), (req: Request, res: Response) => {
  const { title, slug, category, short_desc, full_desc, image, features, price, display_order, is_published } = req.body;
  const id = 'srv_' + Date.now();
  const cleanSlug = (slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/^-|-$/g, '');

  runExec(`
    INSERT INTO services (id, title, slug, category, short_desc, full_desc, image, features, price, display_order, is_published, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    id,
    title,
    cleanSlug,
    category || 'General',
    short_desc,
    full_desc,
    image,
    JSON.stringify(features || []),
    price || '',
    display_order || 0,
    is_published !== undefined ? (is_published ? 1 : 0) : 1,
    new Date().toISOString()
  ]);

  res.status(201).json({ message: 'Service created successfully', id });
});

router.put('/services/:id', authMiddleware, requireRole('SUPER_ADMIN', 'CONTENT_ADMIN'), (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, slug, category, short_desc, full_desc, image, features, price, display_order, is_published } = req.body;

  runExec(`
    UPDATE services SET
      title = ?, slug = ?, category = ?, short_desc = ?, full_desc = ?, image = ?,
      features = ?, price = ?, display_order = ?, is_published = ?
    WHERE id = ?
  `, [
    title,
    slug,
    category,
    short_desc,
    full_desc,
    image,
    JSON.stringify(features || []),
    price,
    display_order,
    is_published ? 1 : 0,
    id
  ]);

  res.json({ message: 'Service updated successfully' });
});

router.delete('/services/:id', authMiddleware, requireRole('SUPER_ADMIN', 'CONTENT_ADMIN'), (req: Request, res: Response) => {
  const { id } = req.params;
  runExec('DELETE FROM services WHERE id = ?', [id]);
  res.json({ message: 'Service deleted successfully' });
});

// ==================== PORTFOLIO ====================

router.get('/portfolio', (req: Request, res: Response) => {
  const { category, all } = req.query;
  let sql = all === 'true'
    ? 'SELECT * FROM portfolio_projects'
    : 'SELECT * FROM portfolio_projects WHERE is_published = 1';
  const params: any[] = [];

  if (category && category !== 'ALL PROJECTS') {
    sql += (all === 'true' ? ' WHERE' : ' AND') + ' category = ?';
    params.push(category);
  }

  sql += ' ORDER BY display_order ASC, created_at DESC';
  const rows = runQuery<any>(sql, params);
  const parsed = rows.map(r => ({
    ...r,
    additional_images: JSON.parse(r.additional_images || '[]')
  }));
  res.json(parsed);
});

router.post('/portfolio', authMiddleware, requireRole('SUPER_ADMIN', 'CONTENT_ADMIN'), (req: Request, res: Response) => {
  const { title, category, description, preview_image, additional_images, demo_url, is_featured, is_published, display_order } = req.body;
  const id = 'port_' + Date.now();

  runExec(`
    INSERT INTO portfolio_projects (id, title, category, description, preview_image, additional_images, demo_url, is_featured, is_published, display_order, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    id,
    title,
    category,
    description,
    preview_image,
    JSON.stringify(additional_images || [preview_image]),
    demo_url || '',
    is_featured ? 1 : 0,
    is_published !== undefined ? (is_published ? 1 : 0) : 1,
    display_order || 0,
    new Date().toISOString()
  ]);

  res.status(201).json({ message: 'Portfolio project created successfully', id });
});

router.put('/portfolio/:id', authMiddleware, requireRole('SUPER_ADMIN', 'CONTENT_ADMIN'), (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, category, description, preview_image, additional_images, demo_url, is_featured, is_published, display_order } = req.body;

  runExec(`
    UPDATE portfolio_projects SET
      title = ?, category = ?, description = ?, preview_image = ?,
      additional_images = ?, demo_url = ?, is_featured = ?, is_published = ?, display_order = ?
    WHERE id = ?
  `, [
    title,
    category,
    description,
    preview_image,
    JSON.stringify(additional_images || [preview_image]),
    demo_url,
    is_featured ? 1 : 0,
    is_published ? 1 : 0,
    display_order,
    id
  ]);

  res.json({ message: 'Portfolio project updated successfully' });
});

router.delete('/portfolio/:id', authMiddleware, requireRole('SUPER_ADMIN', 'CONTENT_ADMIN'), (req: Request, res: Response) => {
  const { id } = req.params;
  runExec('DELETE FROM portfolio_projects WHERE id = ?', [id]);
  res.json({ message: 'Portfolio project deleted successfully' });
});

// ==================== BLOG ====================

router.get('/blog', (req: Request, res: Response) => {
  const { slug, all, category } = req.query;
  if (slug) {
    const rows = runQuery<any>('SELECT * FROM blog_posts WHERE slug = ?', [slug]);
    if (rows.length === 0) return res.status(404).json({ error: 'Blog post not found' });
    return res.json(rows[0]);
  }

  let sql = all === 'true'
    ? 'SELECT * FROM blog_posts'
    : "SELECT * FROM blog_posts WHERE status = 'published'";
  const params: any[] = [];

  if (category && category !== 'All') {
    sql += (all === 'true' ? ' WHERE' : ' AND') + ' category = ?';
    params.push(category);
  }

  sql += ' ORDER BY published_at DESC, created_at DESC';
  const rows = runQuery<any>(sql, params);
  res.json(rows);
});

router.post('/blog', authMiddleware, requireRole('SUPER_ADMIN', 'CONTENT_ADMIN'), (req: Request, res: Response) => {
  const { title, slug, category, author, cover_image, content, seo_title, meta_description, status, published_at } = req.body;
  const id = 'blog_' + Date.now();
  const cleanSlug = (slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/^-|-$/g, '');

  runExec(`
    INSERT INTO blog_posts (id, title, slug, category, author, cover_image, content, seo_title, meta_description, status, published_at, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    id,
    title,
    cleanSlug,
    category || 'General',
    author || 'BestWeGive Agency',
    cover_image,
    content,
    seo_title || title,
    meta_description || '',
    status || 'published',
    published_at || new Date().toISOString(),
    new Date().toISOString()
  ]);

  res.status(201).json({ message: 'Blog post created successfully', id });
});

router.put('/blog/:id', authMiddleware, requireRole('SUPER_ADMIN', 'CONTENT_ADMIN'), (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, slug, category, author, cover_image, content, seo_title, meta_description, status, published_at } = req.body;

  runExec(`
    UPDATE blog_posts SET
      title = ?, slug = ?, category = ?, author = ?, cover_image = ?, content = ?,
      seo_title = ?, meta_description = ?, status = ?, published_at = ?
    WHERE id = ?
  `, [
    title,
    slug,
    category,
    author,
    cover_image,
    content,
    seo_title,
    meta_description,
    status,
    published_at,
    id
  ]);

  res.json({ message: 'Blog post updated successfully' });
});

router.delete('/blog/:id', authMiddleware, requireRole('SUPER_ADMIN', 'CONTENT_ADMIN'), (req: Request, res: Response) => {
  const { id } = req.params;
  runExec('DELETE FROM blog_posts WHERE id = ?', [id]);
  res.json({ message: 'Blog post deleted successfully' });
});

// ==================== REVIEWS ====================

router.get('/reviews', (req: Request, res: Response) => {
  const rows = runQuery<any>("SELECT * FROM reviews WHERE status = 'approved' ORDER BY is_featured DESC, created_at DESC");
  res.json(rows);
});

router.get('/reviews/admin', authMiddleware, requireRole('SUPER_ADMIN', 'CONTENT_ADMIN'), (req: Request, res: Response) => {
  const rows = runQuery<any>('SELECT * FROM reviews ORDER BY created_at DESC');
  res.json(rows);
});

router.post('/reviews', (req: Request, res: Response) => {
  const { name, email, company, rating, message } = req.body;
  if (!name || !email || !rating || !message) {
    return res.status(400).json({ error: 'Name, email, rating, and review message are required' });
  }

  const id = 'rev_' + Date.now();
  runExec(`
    INSERT INTO reviews (id, name, email, company, rating, message, status, is_featured, created_at)
    VALUES (?, ?, ?, ?, ?, ?, 'pending', 0, ?)
  `, [
    name.trim(),
    email.trim().toLowerCase(),
    company ? company.trim() : '',
    Math.min(5, Math.max(1, Number(rating))),
    message.trim(),
    new Date().toISOString()
  ]);

  res.status(201).json({
    message: 'Thank you for your feedback! Your review has been submitted and is pending administrative approval.'
  });
});

router.put('/reviews/:id/status', authMiddleware, requireRole('SUPER_ADMIN', 'CONTENT_ADMIN'), (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, is_featured } = req.body;

  if (status !== undefined) {
    runExec('UPDATE reviews SET status = ? WHERE id = ?', [status, id]);
  }
  if (is_featured !== undefined) {
    runExec('UPDATE reviews SET is_featured = ? WHERE id = ?', [is_featured ? 1 : 0, id]);
  }

  res.json({ message: 'Review updated successfully' });
});

router.delete('/reviews/:id', authMiddleware, requireRole('SUPER_ADMIN', 'CONTENT_ADMIN'), (req: Request, res: Response) => {
  const { id } = req.params;
  runExec('DELETE FROM reviews WHERE id = ?', [id]);
  res.json({ message: 'Review deleted successfully' });
});

// ==================== APPOINTMENTS ====================

// Check availability for a specific date (to prevent double bookings)
router.get('/appointments/availability', (req: Request, res: Response) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: 'Date query param is required' });

  // Get active appointments (excluding cancelled) for that date
  const booked = runQuery<{ preferred_time: string }>(`
    SELECT preferred_time FROM appointments
    WHERE preferred_date = ? AND status NOT IN ('cancelled', 'rejected')
  `, [date]);

  const bookedSlots = booked.map(b => b.preferred_time);
  res.json({ bookedSlots });
});

// Public appointment booking
router.post('/appointments', (req: Request, res: Response) => {
  const {
    customer_name,
    email,
    whatsapp_number,
    company_name,
    service,
    preferred_date,
    preferred_time,
    additional_message
  } = req.body;

  // Strict Validation: Email and WhatsApp Number MUST be required
  if (!customer_name || !customer_name.trim()) {
    return res.status(400).json({ error: 'Full name is required' });
  }
  if (!email || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ error: 'A valid email address is required' });
  }
  if (!whatsapp_number || !whatsapp_number.trim() || whatsapp_number.trim().length < 8) {
    return res.status(400).json({ error: 'A valid WhatsApp phone number with country code is required' });
  }
  if (!service || !service.trim()) {
    return res.status(400).json({ error: 'Service selection is required' });
  }
  if (!preferred_date || !preferred_time) {
    return res.status(400).json({ error: 'Preferred date and time slot are required' });
  }

  // Prevent Double Booking: Check if slot is already occupied
  const existing = runQuery<any>(`
    SELECT id FROM appointments
    WHERE preferred_date = ? AND preferred_time = ? AND status NOT IN ('cancelled', 'rejected')
  `, [preferred_date, preferred_time]);

  if (existing.length > 0) {
    return res.status(409).json({
      error: 'This time slot is already booked. Please choose another available date or time.'
    });
  }

  const id = 'apt_' + Date.now();
  runExec(`
    INSERT INTO appointments (
      id, customer_name, email, whatsapp_number, company_name, service,
      preferred_date, preferred_time, additional_message, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
  `, [
    id,
    customer_name.trim(),
    email.trim().toLowerCase(),
    whatsapp_number.trim(),
    company_name ? company_name.trim() : '',
    service.trim(),
    preferred_date,
    preferred_time,
    additional_message ? additional_message.trim() : '',
    new Date().toISOString()
  ]);

  // Log automated notification trigger to agency official email
  console.log(`[EMAIL NOTIFICATION] Triggered to bestwegiveeagency@gmail.com: New appointment from ${customer_name} (${email}, WhatsApp: ${whatsapp_number}) for ${service} on ${preferred_date} at ${preferred_time}`);

  res.status(201).json({
    success: true,
    message: 'Your appointment request has been submitted successfully. We received your email and WhatsApp number. Our team will contact you to confirm your appointment.',
    appointmentId: id
  });
});

// Admin appointment endpoints
router.get('/appointments/admin', authMiddleware, requireRole('SUPER_ADMIN', 'BOOKING_ADMIN'), (req: Request, res: Response) => {
  const { status, date } = req.query;
  let sql = 'SELECT * FROM appointments';
  const params: any[] = [];
  const conditions: string[] = [];

  if (status && status !== 'all') {
    conditions.push('status = ?');
    params.push(status);
  }
  if (date) {
    conditions.push('preferred_date = ?');
    params.push(date);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' ORDER BY preferred_date DESC, preferred_time ASC, created_at DESC';
  const rows = runQuery<any>(sql, params);
  res.json(rows);
});

router.put('/appointments/:id/status', authMiddleware, requireRole('SUPER_ADMIN', 'BOOKING_ADMIN'), (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, preferred_date, preferred_time } = req.body;

  if (preferred_date && preferred_time) {
    runExec('UPDATE appointments SET status = ?, preferred_date = ?, preferred_time = ? WHERE id = ?', [status, preferred_date, preferred_time, id]);
  } else if (status) {
    runExec('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);
  }

  res.json({ message: 'Appointment status updated successfully' });
});

router.delete('/appointments/:id', authMiddleware, requireRole('SUPER_ADMIN', 'BOOKING_ADMIN'), (req: Request, res: Response) => {
  const { id } = req.params;
  runExec('DELETE FROM appointments WHERE id = ?', [id]);
  res.json({ message: 'Appointment deleted successfully' });
});

// ==================== CONTACT INQUIRIES ====================

// Public inquiry submission
router.post('/inquiries', (req: Request, res: Response) => {
  const { name, email, phone, company, service, budget, details } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Full name is required' });
  }
  if (!email || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ error: 'A valid email address is required' });
  }
  if (!phone || !phone.trim() || phone.trim().length < 7) {
    return res.status(400).json({ error: 'Phone number is required' });
  }
  if (!service || !service.trim()) {
    return res.status(400).json({ error: 'Service selection is required' });
  }
  if (!details || !details.trim()) {
    return res.status(400).json({ error: 'Project details are required' });
  }

  const id = 'inq_' + Date.now();
  runExec(`
    INSERT INTO contact_inquiries (id, name, email, phone, company, service, budget, details, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', ?)
  `, [
    id,
    name.trim(),
    email.trim().toLowerCase(),
    phone.trim(),
    company ? company.trim() : '',
    service.trim(),
    budget || '',
    details.trim(),
    new Date().toISOString()
  ]);

  // Log email notification to agency
  console.log(`[EMAIL NOTIFICATION] Triggered to bestwegiveeagency@gmail.com: New inquiry from ${name} (${email}, Phone: ${phone}) for ${service}`);

  res.status(201).json({
    success: true,
    message: 'Thank you for contacting BestWeGive Agency. Your inquiry has been securely stored and sent to our team. We will review your project and get back to you shortly!'
  });
});

// Admin inquiry endpoints
router.get('/inquiries/admin', authMiddleware, requireRole('SUPER_ADMIN', 'BOOKING_ADMIN'), (req: Request, res: Response) => {
  const { status, search } = req.query;
  let sql = 'SELECT * FROM contact_inquiries';
  const params: any[] = [];
  const conditions: string[] = [];

  if (status && status !== 'all') {
    conditions.push('status = ?');
    params.push(status);
  }
  if (search) {
    conditions.push('(name LIKE ? OR email LIKE ? OR phone LIKE ? OR company LIKE ?)');
    const term = `%${search}%`;
    params.push(term, term, term, term);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' ORDER BY created_at DESC';
  const rows = runQuery<any>(sql, params);
  res.json(rows);
});

router.put('/inquiries/:id/status', authMiddleware, requireRole('SUPER_ADMIN', 'BOOKING_ADMIN'), (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  runExec('UPDATE contact_inquiries SET status = ? WHERE id = ?', [status, id]);
  res.json({ message: 'Inquiry status updated successfully' });
});

router.delete('/inquiries/:id', authMiddleware, requireRole('SUPER_ADMIN', 'BOOKING_ADMIN'), (req: Request, res: Response) => {
  const { id } = req.params;
  runExec('DELETE FROM contact_inquiries WHERE id = ?', [id]);
  res.json({ message: 'Inquiry deleted successfully' });
});

router.get('/inquiries/export-csv', authMiddleware, requireRole('SUPER_ADMIN', 'BOOKING_ADMIN'), (req: Request, res: Response) => {
  const rows = runQuery<any>('SELECT * FROM contact_inquiries ORDER BY created_at DESC');
  const headers = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Service', 'Budget', 'Details', 'Status', 'Submission Date'];
  const csvRows = [headers.join(',')];

  for (const r of rows) {
    const values = [
      r.id,
      `"${(r.name || '').replace(/"/g, '""')}"`,
      `"${(r.email || '').replace(/"/g, '""')}"`,
      `"${(r.phone || '').replace(/"/g, '""')}"`,
      `"${(r.company || '').replace(/"/g, '""')}"`,
      `"${(r.service || '').replace(/"/g, '""')}"`,
      `"${(r.budget || '').replace(/"/g, '""')}"`,
      `"${(r.details || '').replace(/"/g, '""')}"`,
      r.status,
      r.created_at
    ];
    csvRows.push(values.join(','));
  }

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="bestwegive_inquiries.csv"');
  res.send(csvRows.join('\n'));
});

// ==================== ADMIN USER MANAGEMENT ====================

router.get('/users', authMiddleware, requireRole('SUPER_ADMIN'), (req: Request, res: Response) => {
  const rows = runQuery<any>('SELECT id, email, name, role, is_active, last_login, created_at FROM admin_users ORDER BY created_at ASC');
  res.json(rows);
});

router.post('/users', authMiddleware, requireRole('SUPER_ADMIN'), (req: Request, res: Response) => {
  const { email, password, name, role } = req.body;
  if (!email || !password || !name || !role) {
    return res.status(400).json({ error: 'All fields (email, password, name, role) are required' });
  }

  const existing = runQuery<any>('SELECT id FROM admin_users WHERE email = ?', [email.trim().toLowerCase()]);
  if (existing.length > 0) {
    return res.status(409).json({ error: 'An admin with this email already exists' });
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  const id = 'admin_' + Date.now();

  runExec(`
    INSERT INTO admin_users (id, email, password_hash, name, role, is_active, created_at)
    VALUES (?, ?, ?, ?, ?, 1, ?)
  `, [
    id,
    email.trim().toLowerCase(),
    hash,
    name.trim(),
    role,
    new Date().toISOString()
  ]);

  res.status(201).json({ message: 'Admin user created successfully', id });
});

router.put('/users/:id', authMiddleware, requireRole('SUPER_ADMIN'), (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, role, is_active, password } = req.body;

  if (password && password.length >= 8) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    runExec('UPDATE admin_users SET password_hash = ? WHERE id = ?', [hash, id]);
  }

  if (name !== undefined) runExec('UPDATE admin_users SET name = ? WHERE id = ?', [name, id]);
  if (role !== undefined) runExec('UPDATE admin_users SET role = ? WHERE id = ?', [role, id]);
  if (is_active !== undefined) runExec('UPDATE admin_users SET is_active = ? WHERE id = ?', [is_active ? 1 : 0, id]);

  res.json({ message: 'Admin user updated successfully' });
});

router.delete('/users/:id', authMiddleware, requireRole('SUPER_ADMIN'), (req: Request, res: Response) => {
  const { id } = req.params;
  const currentUserId = (req as any).user.id;
  if (id === currentUserId) {
    return res.status(400).json({ error: 'Cannot delete your own admin account' });
  }

  runExec('DELETE FROM admin_users WHERE id = ?', [id]);
  res.json({ message: 'Admin user deleted successfully' });
});

// ==================== DASHBOARD METRICS ====================

router.get('/stats', authMiddleware, (req: Request, res: Response) => {
  const servicesCount = runQuery<{ count: number }>('SELECT COUNT(*) as count FROM services')[0]?.count || 0;
  const portfolioCount = runQuery<{ count: number }>('SELECT COUNT(*) as count FROM portfolio_projects')[0]?.count || 0;
  const blogCount = runQuery<{ count: number }>("SELECT COUNT(*) as count FROM blog_posts WHERE status = 'published'")[0]?.count || 0;
  const pendingReviews = runQuery<{ count: number }>("SELECT COUNT(*) as count FROM reviews WHERE status = 'pending'")[0]?.count || 0;
  const newInquiries = runQuery<{ count: number }>("SELECT COUNT(*) as count FROM contact_inquiries WHERE status = 'new'")[0]?.count || 0;
  const pendingAppointments = runQuery<{ count: number }>("SELECT COUNT(*) as count FROM appointments WHERE status = 'pending'")[0]?.count || 0;
  const confirmedAppointments = runQuery<{ count: number }>("SELECT COUNT(*) as count FROM appointments WHERE status = 'confirmed'")[0]?.count || 0;

  res.json({
    total_services: servicesCount,
    total_portfolio: portfolioCount,
    published_blogs: blogCount,
    pending_reviews: pendingReviews,
    new_inquiries: newInquiries,
    pending_appointments: pendingAppointments,
    confirmed_appointments: confirmedAppointments
  });
});

export default router;
