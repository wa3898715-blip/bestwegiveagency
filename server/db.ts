import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DB_PATH = path.resolve(process.cwd(), 'data/bestwegive.sqlite');
let dbInstance: Database | null = null;

export async function getDb(): Promise<Database> {
  if (dbInstance) return dbInstance;

  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    dbInstance = new SQL.Database(fileBuffer);
  } else {
    dbInstance = new SQL.Database();
    initSchemaAndSeed(dbInstance);
    saveDb();
  }
  return dbInstance;
}

export function saveDb(): void {
  if (!dbInstance) return;
  const data = dbInstance.export();
  const buffer = Buffer.from(data);
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DB_PATH, buffer);
}

export function runQuery<T = any>(sql: string, params: any[] = []): T[] {
  if (!dbInstance) throw new Error('Database not initialized');
  const stmt = dbInstance.prepare(sql);
  stmt.bind(params);
  const results: T[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject() as T);
  }
  stmt.free();
  return results;
}

export function runExec(sql: string, params: any[] = []): void {
  if (!dbInstance) throw new Error('Database not initialized');
  dbInstance.run(sql, params);
  saveDb();
}

function initSchemaAndSeed(db: Database) {
  // DDL Statements for 9 tables
  db.run(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'SUPER_ADMIN',
      is_active INTEGER NOT NULL DEFAULT 1,
      last_login TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      short_desc TEXT NOT NULL,
      full_desc TEXT NOT NULL,
      image TEXT NOT NULL,
      features TEXT NOT NULL,
      price TEXT,
      display_order INTEGER NOT NULL DEFAULT 0,
      is_published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS portfolio_projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      preview_image TEXT NOT NULL,
      additional_images TEXT NOT NULL,
      demo_url TEXT,
      is_featured INTEGER NOT NULL DEFAULT 0,
      is_published INTEGER NOT NULL DEFAULT 1,
      display_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS blog_posts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      author TEXT NOT NULL DEFAULT 'BestWeGive Agency',
      cover_image TEXT NOT NULL,
      content TEXT NOT NULL,
      seo_title TEXT,
      meta_description TEXT,
      status TEXT NOT NULL DEFAULT 'published',
      published_at TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      rating INTEGER NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      is_featured INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      email TEXT NOT NULL,
      whatsapp_number TEXT NOT NULL,
      company_name TEXT,
      service TEXT NOT NULL,
      preferred_date TEXT NOT NULL,
      preferred_time TEXT NOT NULL,
      additional_message TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contact_inquiries (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      company TEXT,
      service TEXT NOT NULL,
      budget TEXT,
      details TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS website_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS social_media_links (
      platform TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      is_enabled INTEGER NOT NULL DEFAULT 0
    );
  `);

  // Default Admin User
  const defaultSalt = bcrypt.genSaltSync(10);
  const defaultHash = bcrypt.hashSync('BestWeGive2026!', defaultSalt);
  db.run(`
    INSERT INTO admin_users (id, email, password_hash, name, role, is_active, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [
    'admin_super_1',
    'admin@bestwegiveagency.com',
    defaultHash,
    'BestWeGive Super Admin',
    'SUPER_ADMIN',
    1,
    new Date().toISOString()
  ]);

  // Initial Website Settings
  const settingsEntries = [
    ['agency_name', 'BestWeGive Agency'],
    ['agency_email', 'bestwegiveeagency@gmail.com'],
    ['whatsapp_number', '+1 929 741 1658'],
    ['whatsapp_link', 'https://wa.me/19297411658'],
    ['location', 'Bronx, New York, USA'],
    ['tagline', 'STRATEGY • CREATIVITY • GROWTH'],
    ['homepage_headline', 'Grow Your Business with Smarter Digital Solutions'],
    ['homepage_description', 'From stunning websites and creative branding to digital marketing and AI-powered solutions, we help businesses build, grow, and succeed.'],
    ['hero_image', '/hero_agency_bg.jpg'],
    ['footer_description', 'BestWeGive Agency is a premier full-service digital agency based in Bronx, New York. We craft modern high-conversion websites, creative brand identities, AI automation, and ROI-driven marketing campaigns.'],
    ['copyright_text', '© 2026 BestWeGive Agency. All Rights Reserved.']
  ];

  for (const [key, value] of settingsEntries) {
    db.run('INSERT INTO website_settings (key, value) VALUES (?, ?)', [key, value]);
  }

  // Initial Social Media Links (disabled until admin adds URLs)
  db.run('INSERT INTO social_media_links (platform, url, is_enabled) VALUES (?, ?, ?)', ['facebook', '', 0]);
  db.run('INSERT INTO social_media_links (platform, url, is_enabled) VALUES (?, ?, ?)', ['instagram', '', 0]);
  db.run('INSERT INTO social_media_links (platform, url, is_enabled) VALUES (?, ?, ?)', ['linkedin', '', 0]);

  // Seed 6 Core Services
  const initialServices = [
    {
      id: 'srv_1',
      title: 'Website Development',
      slug: 'website-development',
      category: 'Development',
      short_desc: 'Custom high-performance websites engineered for speed, conversion, and elegance.',
      full_desc: 'We engineer bespoke digital experiences that captivate your audience and turn casual visitors into loyal high-value clients. Every line of code is optimized for lightning-fast speed, search engine domination, and responsive perfection on every device.',
      image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1200&q=80',
      features: JSON.stringify([
        'Custom Business & Corporate Websites',
        'WordPress & Webflow Development',
        'High-Converting Landing Pages',
        'Full-Stack Custom Web Apps',
        'Full Website Redesign & Modernization',
        'Lightning Page Speed & Technical SEO'
      ]),
      price: 'Custom Quotes Available',
      display_order: 1
    },
    {
      id: 'srv_2',
      title: 'Branding & Creative Design',
      slug: 'branding-creative-design',
      category: 'Design',
      short_desc: 'Luxury brand identities, distinctive logos, and cohesive design systems that elevate your market presence.',
      full_desc: 'Your brand is your greatest asset. We construct memorable visual identities that command respect and establish instant trust with your ideal clientele, blending strategic positioning with artful execution.',
      image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80',
      features: JSON.stringify([
        'Iconic Logo Design & Monograms',
        'Comprehensive Brand Guidelines & Style Guides',
        'Executive Business Cards & Stationery',
        'Social Media Brand Toolkits',
        'Brochures, Menus, Flyers & Pitch Decks',
        'High-End Print & Digital Marketing Materials'
      ]),
      price: 'Tailored Branding Packages',
      display_order: 2
    },
    {
      id: 'srv_3',
      title: 'Digital Marketing',
      slug: 'digital-marketing',
      category: 'Marketing',
      short_desc: 'Data-driven Meta ads, targeted campaigns, and conversion funnels that drive measurable revenue growth.',
      full_desc: 'Stop burning budget on generic advertising. We deploy hyper-targeted paid acquisition across Facebook, Instagram, and search channels with continuous A/B creative testing, analytics tracking, and automated lead routing.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      features: JSON.stringify([
        'Facebook & Instagram (Meta) Paid Advertising',
        'Targeted Lead Generation Campaigns',
        'Meta Ads Management & Media Buying',
        'High-Impact Social Media Content Creation',
        'Conversion Rate Optimization (CRO)',
        'Comprehensive Analytics & Attribution Reporting'
      ]),
      price: 'Monthly Growth Plans',
      display_order: 3
    },
    {
      id: 'srv_4',
      title: 'AI Solutions & Automation',
      slug: 'ai-solutions',
      category: 'Artificial Intelligence',
      short_desc: 'Custom AI conversational agents, smart workflows, and automated customer support that scale your business.',
      full_desc: 'Supercharge your daily operations with cutting-edge artificial intelligence. From 24/7 intelligent chatbots that qualify and book appointments to automated content pipelines and CRM integrations, we make AI practical and profitable.',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      features: JSON.stringify([
        '24/7 Intelligent Customer Support Chatbots',
        'Automated Lead Qualification & Scheduling',
        'AI Content Generation Systems',
        'Generative Visual Assets & Mockups',
        'Custom Business Process Automation',
        'Seamless CRM & WhatsApp API Integration'
      ]),
      price: 'Implementation & Maintenance',
      display_order: 4
    },
    {
      id: 'srv_5',
      title: 'Career & Recruitment',
      slug: 'career-recruitment',
      category: 'Career Services',
      short_desc: 'Executive resume writing, LinkedIn optimization, and career guidance that open doors to premier opportunities.',
      full_desc: 'Stand out in competitive corporate and creative arenas. Our recruitment and branding specialists craft compelling career narratives, ATS-optimized resumes, and commanding LinkedIn profiles that attract executive headhunters.',
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
      features: JSON.stringify([
        'Executive Resume & Curriculum Vitae (CV) Writing',
        'ATS Keyword Optimization & Formatting',
        'LinkedIn Profile Makeover & Positioning',
        'Executive Cover Letters & Value Propositions',
        'Strategic Interview Coaching & Preparation',
        'Personal Career Roadmap Advisory'
      ]),
      price: 'Tiered Career Packages',
      display_order: 5
    },
    {
      id: 'srv_6',
      title: 'E-Commerce Solutions',
      slug: 'ecommerce-solutions',
      category: 'E-commerce',
      short_desc: 'High-converting Shopify stores, seamless checkouts, and custom digital storefronts engineered for sales.',
      full_desc: 'Turn your product catalog into a high-octane sales engine. We design and build Shopify and headless e-commerce stores with friction-free mobile checkout, persuasive product pages, and automated upsell systems.',
      image: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?auto=format&fit=crop&w=1200&q=80',
      features: JSON.stringify([
        'Shopify & Shopify Plus Store Development',
        'High-Converting Product Page Architecture',
        'Cart Optimization & One-Click Upsells',
        'Custom Storefront Design & Micro-animations',
        'Payment Gateway & Logistics Integration',
        'Store Speed Optimization & Mobile UX'
      ]),
      price: 'Full Store Builds & Audits',
      display_order: 6
    }
  ];

  for (const s of initialServices) {
    db.run(`
      INSERT INTO services (id, title, slug, category, short_desc, full_desc, image, features, price, display_order, is_published, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
    `, [s.id, s.title, s.slug, s.category, s.short_desc, s.full_desc, s.image, s.features, s.price, s.display_order, new Date().toISOString()]);
  }

  // Seed 25+ fictional website concepts across required categories:
  // CONSTRUCTION (5), HOME REMODELING (5), INTERIOR DESIGN (5), METAL & STEEL (5), E-COMMERCE (5)
  const initialProjects = [
    // CONSTRUCTION (5)
    {
      id: 'port_const_1',
      title: 'Modern Construction Company',
      category: 'CONSTRUCTION',
      description: 'A robust digital platform engineered for a premier commercial building firm featuring dynamic project showcases, real-time bid calculators, and equipment fleet galleries.',
      preview_image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80',
      demo_url: 'https://demo.bestwegiveagency.com/modern-construction'
    },
    {
      id: 'port_const_2',
      title: 'General Contractor Website',
      category: 'CONSTRUCTION',
      description: 'Streamlined general contracting website featuring interactive blueprint previews, client milestone portals, and instant quote estimations.',
      preview_image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=900&q=80',
      demo_url: 'https://demo.bestwegiveagency.com/general-contractor'
    },
    {
      id: 'port_const_3',
      title: 'Luxury Home Builder',
      category: 'CONSTRUCTION',
      description: 'High-end custom estate builder website showcasing architectural photography, 3D home tours, and bespoke craftsmanship case studies.',
      preview_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
      demo_url: 'https://demo.bestwegiveagency.com/luxury-home-builder'
    },
    {
      id: 'port_const_4',
      title: 'Commercial Construction Company',
      category: 'CONSTRUCTION',
      description: 'Enterprise corporate builder portal highlighting multi-million dollar infrastructure projects, safety certifications, and investor reports.',
      preview_image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=900&q=80',
      demo_url: 'https://demo.bestwegiveagency.com/commercial-construction'
    },
    {
      id: 'port_const_5',
      title: 'Architecture & Construction Company',
      category: 'CONSTRUCTION',
      description: 'A seamless blend of architectural studio vision and structural build capabilities with interactive site plan rendering.',
      preview_image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80',
      demo_url: 'https://demo.bestwegiveagency.com/arch-construction'
    },

    // HOME REMODELING (5)
    {
      id: 'port_remodel_1',
      title: 'Home Remodeling Company',
      category: 'REMODELING',
      description: 'Full-service renovation website featuring interactive before-and-after sliders, budget calculators, and virtual material selectors.',
      preview_image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',
      demo_url: 'https://demo.bestwegiveagency.com/home-remodeling'
    },
    {
      id: 'port_remodel_2',
      title: 'Kitchen Remodeling',
      category: 'REMODELING',
      description: 'Artisan culinary space makeover showcase featuring countertop visualizers, cabinetry finishes, and appointment scheduling.',
      preview_image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80',
      demo_url: 'https://demo.bestwegiveagency.com/kitchen-remodeling'
    },
    {
      id: 'port_remodel_3',
      title: 'Bathroom Remodeling',
      category: 'REMODELING',
      description: 'Spa-inspired bathroom transformation concept highlighting stone fixtures, ambient lighting design, and modern plumbing innovations.',
      preview_image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=80',
      demo_url: 'https://demo.bestwegiveagency.com/bathroom-remodeling'
    },
    {
      id: 'port_remodel_4',
      title: 'Full Home Renovation',
      category: 'REMODELING',
      description: 'Comprehensive historical brownstone and modern suburban restoration portfolio with step-by-step renovation timelines.',
      preview_image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80',
      demo_url: 'https://demo.bestwegiveagency.com/full-home-renovation'
    },
    {
      id: 'port_remodel_5',
      title: 'Basement Remodeling',
      category: 'REMODELING',
      description: 'Modern subterranean living solutions including home theaters, wine cellars, in-law suites, and wet bars.',
      preview_image: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=900&q=80',
      demo_url: 'https://demo.bestwegiveagency.com/basement-remodeling'
    },

    // INTERIOR DESIGN (5)
    {
      id: 'port_interior_1',
      title: 'Luxury Interior Design',
      category: 'INTERIOR DESIGN',
      description: 'Editorial-grade portfolio for high-end residential interiors featuring mood boards, fabric palettes, and immersive walkthroughs.',
      preview_image: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=900&q=80',
      demo_url: 'https://demo.bestwegiveagency.com/luxury-interior-design'
    },
    {
      id: 'port_interior_2',
      title: 'Modern Residential Interiors',
      category: 'INTERIOR DESIGN',
      description: 'Sleek metropolitan apartment design showcase focused on smart space utilization, organic materials, and daylight optimization.',
      preview_image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80',
      demo_url: 'https://demo.bestwegiveagency.com/modern-residential-interiors'
    },
    {
      id: 'port_interior_3',
      title: 'Minimalist Interior Design',
      category: 'INTERIOR DESIGN',
      description: 'Zen-inspired minimalist aesthetic web concept celebrating negative space, concealed joinery, and natural neutral palettes.',
      preview_image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=900&q=80',
      demo_url: 'https://demo.bestwegiveagency.com/minimalist-interior-design'
    },
    {
      id: 'port_interior_4',
      title: 'Luxury Kitchen & Living Spaces',
      category: 'INTERIOR DESIGN',
      description: 'Open-concept culinary living spaces blending custom marble islands, hidden sculleries, and designer chandeliers.',
      preview_image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
      demo_url: 'https://demo.bestwegiveagency.com/luxury-kitchen-living'
    },
    {
      id: 'port_interior_5',
      title: 'Commercial Interior Design',
      category: 'INTERIOR DESIGN',
      description: 'Award-winning hospitality, executive boardroom, and luxury retail store styling concepts with client testimonial quotes.',
      preview_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80',
      demo_url: 'https://demo.bestwegiveagency.com/commercial-interior-design'
    },

    // METAL & STEEL (5)
    {
      id: 'port_metal_1',
      title: 'Steel Fabrication Company',
      category: 'METAL & STEEL FABRICATION',
      description: 'Heavy industrial steel design website with interactive specs, welding certifications, and structural steel capacity metrics.',
      preview_image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=80',
      demo_url: 'https://demo.bestwegiveagency.com/steel-fabrication'
    },
    {
      id: 'port_metal_2',
      title: 'Metal Fabrication Workshop',
      category: 'METAL & STEEL FABRICATION',
      description: 'Precision CNC machining and custom architectural ironworks with instant DXF/CAD upload request forms.',
      preview_image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80',
      demo_url: 'https://demo.bestwegiveagency.com/metal-workshop'
    },
    {
      id: 'port_metal_3',
      title: 'Custom Metal Works',
      category: 'METAL & STEEL FABRICATION',
      description: 'Artisanal decorative gates, luxury metal staircases, custom railings, and bespoke architectural metal installations.',
      preview_image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=900&q=80',
      demo_url: 'https://demo.bestwegiveagency.com/custom-metal-works'
    },
    {
      id: 'port_metal_4',
      title: 'Structural Steel Company',
      category: 'METAL & STEEL FABRICATION',
      description: 'Commercial bridge, skyscraper, and industrial warehouse framing portfolio with OSHA compliance standards.',
      preview_image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=900&q=80',
      demo_url: 'https://demo.bestwegiveagency.com/structural-steel'
    },
    {
      id: 'port_metal_5',
      title: 'Industrial Welding & Fabrication',
      category: 'METAL & STEEL FABRICATION',
      description: 'Pipe welding, pressure vessel manufacturing, and emergency mobile repair services showcase with fast dispatch.',
      preview_image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
      demo_url: 'https://demo.bestwegiveagency.com/industrial-welding'
    },

    // E-COMMERCE (5)
    {
      id: 'port_ecom_1',
      title: 'Fashion Store',
      category: 'E-COMMERCE',
      description: 'High-fashion editorial apparel store with instant lookbooks, dynamic sizing guides, and 1-second checkout flow.',
      preview_image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80',
      demo_url: 'https://demo.bestwegiveagency.com/fashion-store'
    },
    {
      id: 'port_ecom_2',
      title: 'Beauty & Skincare Store',
      category: 'E-COMMERCE',
      description: 'Clean organic skincare e-commerce storefront with custom routine quiz and recurring replenishment subscriptions.',
      preview_image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
      demo_url: 'https://demo.bestwegiveagency.com/beauty-skincare'
    },
    {
      id: 'port_ecom_3',
      title: 'Electronics Store',
      category: 'E-COMMERCE',
      description: 'Minimalist audio & gadget boutique featuring tech specs comparison matrix, customer video reviews, and warranty add-ons.',
      preview_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
      demo_url: 'https://demo.bestwegiveagency.com/electronics-store'
    },
    {
      id: 'port_ecom_4',
      title: 'Furniture Store',
      category: 'E-COMMERCE',
      description: 'Scandinavian luxury furniture gallery with 3D room previewer, swatch sample ordering, and white-glove delivery tracking.',
      preview_image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
      demo_url: 'https://demo.bestwegiveagency.com/furniture-store'
    },
    {
      id: 'port_ecom_5',
      title: 'Premium Lifestyle Store',
      category: 'E-COMMERCE',
      description: 'Curated artisanal goods, luxury watches, and travel accessories engineered on headless Shopify with blazing speed.',
      preview_image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80',
      demo_url: 'https://demo.bestwegiveagency.com/lifestyle-store'
    }
  ];

  let order = 1;
  for (const p of initialProjects) {
    db.run(`
      INSERT INTO portfolio_projects (id, title, category, description, preview_image, additional_images, demo_url, is_featured, is_published, display_order, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
    `, [
      p.id,
      p.title,
      p.category,
      p.description,
      p.preview_image,
      JSON.stringify([p.preview_image]),
      p.demo_url,
      order <= 6 ? 1 : 0,
      order,
      new Date().toISOString()
    ]);
    order++;
  }

  // Seed 6 Blog Articles
  const initialBlogs = [
    {
      id: 'blog_1',
      title: 'Why Every Business Needs a Professional Website',
      slug: 'why-every-business-needs-a-professional-website',
      category: 'Website Design',
      cover_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      content: `In the modern digital economy, your website is the 24/7 front door to your enterprise. Potential clients rarely pick up the phone without first scrutinizing your digital footprint. A bespoke, fast-loading, and mobile-optimized website does more than present information—it establishes immediate credibility, outranks competitors in local search results, and converts passive browsers into committed clients. At BestWeGive Agency, we build websites engineered with laser-sharp conversion funnels, modern security, and timeless visual appeal.`,
      seo_title: 'Why Every Business Needs a Professional Website | BestWeGive Agency',
      meta_description: 'Discover how a professionally engineered website builds trust, outranks competitors, and drives sustainable revenue for modern businesses.'
    },
    {
      id: 'blog_2',
      title: 'How Digital Marketing Helps Small Businesses',
      slug: 'how-digital-marketing-helps-small-businesses',
      category: 'Digital Marketing',
      cover_image: 'https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=1200&q=80',
      content: `Small businesses often compete against corporations with massive ad reserves. Digital marketing levels the playing field. With laser-focused geographic and demographic targeting on platforms like Meta and Google, hyper-local businesses can reach high-intent customers right when they are ready to purchase. By combining high-converting creative assets with continuous A/B testing and retargeting, your advertising spend transforms from a cost center into a predictable revenue generation mechanism.`,
      seo_title: 'How Digital Marketing Helps Small Businesses Grow | BestWeGive Agency',
      meta_description: 'Learn the core digital marketing strategies that enable small and mid-sized businesses to out-market bigger competitors and capture profitable leads.'
    },
    {
      id: 'blog_3',
      title: 'Website Design Trends for Modern Businesses',
      slug: 'website-design-trends-for-modern-businesses',
      category: 'Website Design',
      cover_image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
      content: `The era of cluttered, slow-loading templates is over. Today's highest-performing digital experiences embrace bold typographic scale, cinematic dark atmospheres, warm golden lighting accents, and zero-distraction micro-interactions. Modern design is not merely decoration—it is cognitive architecture that directs visitor focus directly toward your primary value proposition and conversion actions. Discover how progressive design systems keep your brand ahead of the curve.`,
      seo_title: 'Website Design Trends for Modern Businesses | BestWeGive Agency',
      meta_description: 'Explore the leading website design trends of 2026: dark luxury aesthetics, micro-interactions, and conversion-first user interfaces.'
    },
    {
      id: 'blog_4',
      title: 'How AI Can Simplify Business Operations',
      slug: 'how-ai-can-simplify-business-operations',
      category: 'AI & Automation',
      cover_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      content: `Artificial intelligence is no longer an experimental luxury—it is an operational necessity. From intelligent customer service chatbots that answer inquiries instantly at 2 AM, to automated appointment scheduling and lead qualification workflows, AI allows lean teams to execute at the scale of enterprise organizations. By automating repetitive administrative tasks, business owners can redirect their valuable time toward strategic client relationships and high-margin growth.`,
      seo_title: 'How AI Can Simplify Business Operations | BestWeGive Agency',
      meta_description: 'Discover how AI automation, chatbots, and smart CRM integrations streamline business operations and boost team productivity.'
    },
    {
      id: 'blog_5',
      title: 'Why Branding Matters for Business Success',
      slug: 'why-branding-matters-for-business-success',
      category: 'Branding',
      cover_image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80',
      content: `A brand is not just a logo or a color swatch; it is the gut emotional feeling a customer experiences when they encounter your company. Cohesive, premium branding commands pricing power, creates instant differentiation in saturated markets, and inspires long-term customer loyalty. When your visual identity, voice, and touchpoints align seamlessly, clients instinctively perceive higher value and choose you over cheaper alternatives.`,
      seo_title: 'Why Branding Matters for Business Success | BestWeGive Agency',
      meta_description: 'Understand the transformative power of premium brand identity, visual positioning, and consistent brand storytelling in driving enterprise value.'
    },
    {
      id: 'blog_6',
      title: 'How to Generate More Leads Through Your Website',
      slug: 'how-to-generate-more-leads-through-your-website',
      category: 'Business Growth',
      cover_image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
      content: `Driving traffic to your website is only half the battle. If your conversion path is friction-filled or confusing, prospective clients will bounce away. Generating qualified leads requires clear value propositions above the fold, frictionless appointment calendars, prominent direct WhatsApp messaging options, and social proof. Discover our proven framework for turning passive website visitors into confirmed consultations.`,
      seo_title: 'How to Generate More Leads Through Your Website | BestWeGive Agency',
      meta_description: 'Actionable lead generation strategies: booking calendars, WhatsApp integration, and conversion optimization that convert visitors into paying clients.'
    }
  ];

  for (const b of initialBlogs) {
    db.run(`
      INSERT INTO blog_posts (id, title, slug, category, author, cover_image, content, seo_title, meta_description, status, published_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?)
    `, [b.id, b.title, b.slug, b.category, 'BestWeGive Editorial', b.cover_image, b.content, b.seo_title, b.meta_description, new Date().toISOString(), new Date().toISOString()]);
  }

  // Seed sample reviews (clearly labeled DEMO / SAMPLE as requested)
  const initialReviews = [
    {
      id: 'rev_1',
      name: 'Marcus Sterling',
      email: 'm.sterling@samplemail.com',
      company: 'Sterling & Co. Enterprises',
      rating: 5,
      message: 'BestWeGive Agency completely redefined our digital image. The new website is breathtakingly fast, and our direct WhatsApp consultation inquiries increased by over 140% in the first two months. Exceptional craftsmanship and vision.',
      status: 'approved',
      is_featured: 1
    },
    {
      id: 'rev_2',
      name: 'Elena Rostova',
      email: 'elena@novabuilders.demo',
      company: 'Nova Custom Construction',
      rating: 5,
      message: 'The team understood our luxury architectural aesthetic from day one. The portfolio layout and client booking system work flawlessly. It gave us the high-end credibility we needed to win seven-figure commercial contracts.',
      status: 'approved',
      is_featured: 1
    },
    {
      id: 'rev_3',
      name: 'David Vance',
      email: 'dvance@vanceiron.demo',
      company: 'Vance Structural Fabrications',
      rating: 5,
      message: 'Professional, reliable, and deeply strategic. BestWeGive delivered an industrial yet modern website that showcases our fabrication capabilities with incredible precision. Highly recommended!',
      status: 'approved',
      is_featured: 1
    }
  ];

  for (const r of initialReviews) {
    db.run(`
      INSERT INTO reviews (id, name, email, company, rating, message, status, is_featured, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [r.id, r.name, r.email, r.company, r.rating, r.message, r.status, r.is_featured, new Date().toISOString()]);
  }
}
