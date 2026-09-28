import React, { useState, useEffect } from 'react';
import { Logo } from '../../components/common/Logo';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import {
  WebsiteSettings,
  SocialLink,
  Service,
  PortfolioProject,
  BlogPost,
  Review,
  Appointment,
  ContactInquiry,
  AdminUser,
  DashboardStats
} from '../../types';
import {
  LayoutDashboard,
  Layers,
  Briefcase,
  BookOpen,
  Star,
  Calendar,
  Inbox,
  Share2,
  Settings,
  Users,
  Key,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  ExternalLink,
  Download,
  Search,
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Clock,
  Eye,
  RefreshCw
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateSite }) => {
  const { user, logout, isSuperAdmin, isContentAdmin, isBookingAdmin } = useAuth();
  const { settings, refreshSettings, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'services' | 'portfolio' | 'blog' | 'reviews' | 'appointments' | 'inquiries' | 'social' | 'settings' | 'users' | 'password'>('dashboard');

  // Dashboard Stats State
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Services State
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);

  // Portfolio State
  const [portfolio, setPortfolio] = useState<PortfolioProject[]>([]);
  const [editingProject, setEditingProject] = useState<Partial<PortfolioProject> | null>(null);

  // Blog State
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);

  // Reviews State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Appointments State
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentFilter, setAppointmentFilter] = useState<string>('all');

  // Inquiries State
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryFilter, setInquiryFilter] = useState<string>('all');

  // Social Links State
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  // Settings State
  const [settingsForm, setSettingsForm] = useState<WebsiteSettings>(settings);

  // Users State
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '', role: 'CONTENT_ADMIN' });

  // Password Change State
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  // Load Initial Data
  const loadStats = async () => {
    setLoadingStats(true);
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  // Tab switch data loaders
  useEffect(() => {
    if (activeTab === 'dashboard') loadStats();
    if (activeTab === 'services') api.getServices(true).then(setServices).catch(console.error);
    if (activeTab === 'portfolio') api.getPortfolio(undefined, true).then(setPortfolio).catch(console.error);
    if (activeTab === 'blog') api.getBlogPosts(undefined, true).then(setBlogPosts).catch(console.error);
    if (activeTab === 'reviews') api.getAllReviewsAdmin().then(setReviews).catch(console.error);
    if (activeTab === 'appointments') api.getAdminAppointments().then(setAppointments).catch(console.error);
    if (activeTab === 'inquiries') api.getAdminInquiries().then(setInquiries).catch(console.error);
    if (activeTab === 'social') api.getSocialLinks().then(setSocialLinks).catch(console.error);
    if (activeTab === 'settings') setSettingsForm(settings);
    if (activeTab === 'users' && isSuperAdmin) api.getAdminUsers().then(setAdminUsers).catch(console.error);
  }, [activeTab]);

  // ==================== HANDLERS ====================

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateSettings(settingsForm);
      await refreshSettings();
      showToast('Website settings updated successfully. Public website refreshed.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update settings', 'error');
    }
  };

  // Save Social Links
  const handleSaveSocial = async () => {
    try {
      await api.updateSocialLinks(socialLinks);
      await refreshSettings();
      showToast('Social media links updated successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update social links', 'error');
    }
  };

  // Service CRUD
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.title) return;
    try {
      if (editingService.id) {
        await api.updateService(editingService.id, editingService);
        showToast('Service updated', 'success');
      } else {
        await api.createService(editingService);
        showToast('Service created', 'success');
      }
      setEditingService(null);
      const res = await api.getServices(true);
      setServices(res);
    } catch (err: any) {
      showToast(err.message || 'Error saving service', 'error');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.deleteService(id);
      showToast('Service deleted', 'success');
      setServices(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      showToast(err.message || 'Error deleting service', 'error');
    }
  };

  // Portfolio CRUD
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title || !editingProject.preview_image) return;
    try {
      if (editingProject.id) {
        await api.updatePortfolioProject(editingProject.id, editingProject);
        showToast('Portfolio concept updated', 'success');
      } else {
        await api.createPortfolioProject(editingProject);
        showToast('Portfolio concept created', 'success');
      }
      setEditingProject(null);
      const res = await api.getPortfolio(undefined, true);
      setPortfolio(res);
    } catch (err: any) {
      showToast(err.message || 'Error saving portfolio project', 'error');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Delete this portfolio project?')) return;
    try {
      await api.deletePortfolioProject(id);
      showToast('Project deleted', 'success');
      setPortfolio(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      showToast(err.message || 'Error deleting project', 'error');
    }
  };

  // Blog CRUD
  const handleSaveBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost?.title || !editingPost.content) return;
    try {
      if (editingPost.id) {
        await api.updateBlogPost(editingPost.id, editingPost);
        showToast('Blog article updated', 'success');
      } else {
        await api.createBlogPost(editingPost);
        showToast('Blog article published', 'success');
      }
      setEditingPost(null);
      const res = await api.getBlogPosts(undefined, true);
      setBlogPosts(res);
    } catch (err: any) {
      showToast(err.message || 'Error saving blog post', 'error');
    }
  };

  const handleDeleteBlogPost = async (id: string) => {
    if (!confirm('Delete this article?')) return;
    try {
      await api.deleteBlogPost(id);
      showToast('Article deleted', 'success');
      setBlogPosts(prev => prev.filter(b => b.id !== id));
    } catch (err: any) {
      showToast(err.message || 'Error deleting article', 'error');
    }
  };

  // Reviews CRUD
  const handleUpdateReviewStatus = async (id: string, status: string, is_featured?: boolean) => {
    try {
      await api.updateReviewStatus(id, status, is_featured);
      showToast(`Review marked as ${status}`, 'success');
      const updated = await api.getAllReviewsAdmin();
      setReviews(updated);
    } catch (err: any) {
      showToast(err.message || 'Error updating review', 'error');
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Delete this review permanently?')) return;
    try {
      await api.deleteReview(id);
      showToast('Review deleted', 'success');
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      showToast(err.message || 'Error deleting review', 'error');
    }
  };

  // Appointments CRUD
  const handleUpdateAppointmentStatus = async (id: string, status: string) => {
    try {
      await api.updateAppointmentStatus(id, { status });
      showToast(`Appointment status updated to ${status}`, 'success');
      const updated = await api.getAdminAppointments();
      setAppointments(updated);
    } catch (err: any) {
      showToast(err.message || 'Error updating appointment', 'error');
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (!confirm('Delete this appointment record?')) return;
    try {
      await api.deleteAppointment(id);
      showToast('Appointment removed', 'success');
      setAppointments(prev => prev.filter(a => a.id !== id));
    } catch (err: any) {
      showToast(err.message || 'Error deleting appointment', 'error');
    }
  };

  // Inquiries CRUD
  const handleUpdateInquiryStatus = async (id: string, status: string) => {
    try {
      await api.updateInquiryStatus(id, status);
      showToast(`Inquiry status updated to ${status}`, 'success');
      const updated = await api.getAdminInquiries();
      setInquiries(updated);
    } catch (err: any) {
      showToast(err.message || 'Error updating inquiry', 'error');
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Delete this inquiry?')) return;
    try {
      await api.deleteInquiry(id);
      showToast('Inquiry deleted', 'success');
      setInquiries(prev => prev.filter(i => i.id !== id));
    } catch (err: any) {
      showToast(err.message || 'Error deleting inquiry', 'error');
    }
  };

  // Export Inquiries CSV
  const handleExportCSV = () => {
    const token = localStorage.getItem('bwg_admin_token');
    window.open(`/api/inquiries/export-csv?token=${token}`, '_blank');
  };

  // Admin User Management
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmin.email || !newAdmin.password || !newAdmin.name) return;
    try {
      await api.createAdminUser(newAdmin);
      showToast('New administrator added', 'success');
      setNewAdmin({ name: '', email: '', password: '', role: 'CONTENT_ADMIN' });
      const updated = await api.getAdminUsers();
      setAdminUsers(updated);
    } catch (err: any) {
      showToast(err.message || 'Error creating admin', 'error');
    }
  };

  const handleToggleAdminStatus = async (userToToggle: AdminUser) => {
    try {
      await api.updateAdminUser(userToToggle.id, { is_active: !userToToggle.is_active });
      showToast('Administrator status updated', 'success');
      const updated = await api.getAdminUsers();
      setAdminUsers(updated);
    } catch (err: any) {
      showToast(err.message || 'Error updating admin', 'error');
    }
  };

  // Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('bwg_admin_token')}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Password change failed');
      showToast('Password changed successfully', 'success');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      showToast(err.message || 'Error changing password', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] flex">
      {/* SaaS Sidebar (Black / Charcoal / Gold Accent) */}
      <aside className="w-64 bg-[#0A0A0A] border-r border-[#171717] flex flex-col justify-between shrink-0">
        <div>
          {/* Logo & Header */}
          <div className="p-6 border-b border-[#171717]">
            <Logo variant="white-gold" size="sm" showTagline={false} />
            <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400">
              <span className="truncate max-w-[130px] font-semibold text-white">{user?.name}</span>
              <span className="px-1.5 py-0.5 rounded bg-[#F4C542]/10 text-[#F4C542] text-[9px] font-bold">
                {user?.role?.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-xs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                activeTab === 'dashboard' ? 'bg-[#F4C542] text-black font-bold' : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            {isContentAdmin && (
              <>
                <button
                  onClick={() => setActiveTab('services')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                    activeTab === 'services' ? 'bg-[#F4C542] text-black font-bold' : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Services</span>
                </button>

                <button
                  onClick={() => setActiveTab('portfolio')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                    activeTab === 'portfolio' ? 'bg-[#F4C542] text-black font-bold' : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Portfolio</span>
                </button>

                <button
                  onClick={() => setActiveTab('blog')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                    activeTab === 'blog' ? 'bg-[#F4C542] text-black font-bold' : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Blog & Insights</span>
                </button>

                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                    activeTab === 'reviews' ? 'bg-[#F4C542] text-black font-bold' : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Star className="w-4 h-4" />
                    <span>Reviews</span>
                  </div>
                  {stats?.pending_reviews ? (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-black font-bold">
                      {stats.pending_reviews}
                    </span>
                  ) : null}
                </button>
              </>
            )}

            {isBookingAdmin && (
              <>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                    activeTab === 'appointments' ? 'bg-[#F4C542] text-black font-bold' : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4" />
                    <span>Appointments</span>
                  </div>
                  {stats?.pending_appointments ? (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[#F4C542] text-black font-bold">
                      {stats.pending_appointments}
                    </span>
                  ) : null}
                </button>

                <button
                  onClick={() => setActiveTab('inquiries')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                    activeTab === 'inquiries' ? 'bg-[#F4C542] text-black font-bold' : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Inbox className="w-4 h-4" />
                    <span>Inquiries</span>
                  </div>
                  {stats?.new_inquiries ? (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-red-500 text-white font-bold">
                      {stats.new_inquiries}
                    </span>
                  ) : null}
                </button>
              </>
            )}

            {isSuperAdmin && (
              <>
                <button
                  onClick={() => setActiveTab('social')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                    activeTab === 'social' ? 'bg-[#F4C542] text-black font-bold' : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                  }`}
                >
                  <Share2 className="w-4 h-4" />
                  <span>Social Media</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                    activeTab === 'settings' ? 'bg-[#F4C542] text-black font-bold' : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Website Settings</span>
                </button>

                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                    activeTab === 'users' ? 'bg-[#F4C542] text-black font-bold' : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Admin Users</span>
                </button>
              </>
            )}

            <button
              onClick={() => setActiveTab('password')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                activeTab === 'password' ? 'bg-[#F4C542] text-black font-bold' : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <Key className="w-4 h-4" />
              <span>Change Password</span>
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#171717] space-y-2">
          <button
            onClick={onNavigateSite}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold text-neutral-300 bg-[#121212] hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Site</span>
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold text-red-400 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto max-h-screen p-8 sm:p-10 bg-[#000000]">
        {/* Top bar with quick breadcrumb and live database status */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-neutral-900">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#F4C542]">
              ADMINISTRATION SUITE
            </span>
            <h1 className="text-2xl font-black text-white capitalize tracking-tight mt-0.5">
              {activeTab === 'dashboard' ? 'Executive Overview' : activeTab.replace('-', ' ')}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#0E0E0E] border border-neutral-800 text-[11px] text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real SQLite Database Active</span>
            </span>
            <button
              onClick={() => {
                loadStats();
                showToast('Refreshed data from database', 'info');
              }}
              className="p-2 rounded-lg bg-[#111111] hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================= TAB: DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in">
            {/* Real SQL Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-6 rounded-2xl bg-[#0B0B0B] border border-neutral-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-xs font-bold uppercase tracking-wider">New Inquiries</span>
                  <Inbox className="w-4 h-4 text-[#F4C542]" />
                </div>
                <div className="text-3xl font-black text-white mt-4">{stats?.new_inquiries ?? 0}</div>
                <div className="text-[11px] text-neutral-500 mt-1">Pending review & contact</div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0B0B0B] border border-neutral-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Pending Bookings</span>
                  <Calendar className="w-4 h-4 text-[#F4C542]" />
                </div>
                <div className="text-3xl font-black text-white mt-4">{stats?.pending_appointments ?? 0}</div>
                <div className="text-[11px] text-[#F4C542] mt-1 font-semibold">Requires confirmation</div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0B0B0B] border border-neutral-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Confirmed Bookings</span>
                  <Calendar className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-black text-white mt-4">{stats?.confirmed_appointments ?? 0}</div>
                <div className="text-[11px] text-neutral-500 mt-1">Scheduled calls</div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0B0B0B] border border-neutral-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Pending Reviews</span>
                  <Star className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-black text-white mt-4">{stats?.pending_reviews ?? 0}</div>
                <div className="text-[11px] text-neutral-500 mt-1">Awaiting approval</div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0B0B0B] border border-neutral-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Services</span>
                  <Layers className="w-4 h-4 text-neutral-400" />
                </div>
                <div className="text-3xl font-black text-white mt-4">{stats?.total_services ?? 0}</div>
                <div className="text-[11px] text-neutral-500 mt-1">Published offerings</div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0B0B0B] border border-neutral-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Portfolio Concepts</span>
                  <Briefcase className="w-4 h-4 text-neutral-400" />
                </div>
                <div className="text-3xl font-black text-white mt-4">{stats?.total_portfolio ?? 0}</div>
                <div className="text-[11px] text-neutral-500 mt-1">Demo showcase projects</div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0B0B0B] border border-neutral-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Published Articles</span>
                  <BookOpen className="w-4 h-4 text-neutral-400" />
                </div>
                <div className="text-3xl font-black text-white mt-4">{stats?.published_blogs ?? 0}</div>
                <div className="text-[11px] text-neutral-500 mt-1">Live blog posts</div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0B0B0B] border border-neutral-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Official Email</span>
                  <span className="w-2 h-2 rounded-full bg-[#F4C542]" />
                </div>
                <div className="text-sm font-bold text-white mt-4 truncate">{settings.agency_email}</div>
                <div className="text-[11px] text-neutral-500 mt-1">Configured for notifications</div>
              </div>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div
                onClick={() => setActiveTab('appointments')}
                className="p-6 rounded-2xl bg-gradient-to-br from-[#0F0F0F] to-[#141414] border border-neutral-800 hover:border-[#F4C542]/50 transition-all cursor-pointer group"
              >
                <h3 className="text-base font-bold text-white group-hover:text-[#F4C542] flex items-center justify-between">
                  <span>Manage Appointments</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs text-neutral-400 mt-2">
                  Review customer details, confirm appointments, reschedule slots, or launch WhatsApp conversations.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('inquiries')}
                className="p-6 rounded-2xl bg-gradient-to-br from-[#0F0F0F] to-[#141414] border border-neutral-800 hover:border-[#F4C542]/50 transition-all cursor-pointer group"
              >
                <h3 className="text-base font-bold text-white group-hover:text-[#F4C542] flex items-center justify-between">
                  <span>Review Project Inquiries</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs text-neutral-400 mt-2">
                  View incoming leads, filter by status, export inquiries to CSV, and follow up directly.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('settings')}
                className="p-6 rounded-2xl bg-gradient-to-br from-[#0F0F0F] to-[#141414] border border-neutral-800 hover:border-[#F4C542]/50 transition-all cursor-pointer group"
              >
                <h3 className="text-base font-bold text-white group-hover:text-[#F4C542] flex items-center justify-between">
                  <span>Agency Configuration</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs text-neutral-400 mt-2">
                  Dynamically update WhatsApp number, official email, headlines, hero image, and brand copy.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: SERVICES ================= */}
        {activeTab === 'services' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <p className="text-xs text-neutral-400">Manage agency services, descriptions, pricing, and feature bullets.</p>
              <button
                onClick={() => setEditingService({
                  title: '',
                  slug: '',
                  category: 'Development',
                  short_desc: '',
                  full_desc: '',
                  image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1200&q=80',
                  features: ['Feature 1', 'Feature 2', 'Feature 3'],
                  price: 'Custom Scope',
                  display_order: services.length + 1,
                  is_published: 1
                })}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-[#F4C542] hover:bg-[#FFF3C4] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => (
                <div key={s.id} className="bg-[#0B0B0B] border border-neutral-800 rounded-2xl overflow-hidden flex flex-col justify-between">
                  <div className="h-40 relative bg-neutral-900">
                    <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/80 text-[10px] text-[#F4C542] font-bold">
                      {s.category}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">{s.title}</h3>
                      <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{s.short_desc}</p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {s.features.slice(0, 3).map((f, i) => (
                          <span key={i} className="text-[10px] bg-neutral-900 text-neutral-300 px-2 py-0.5 rounded border border-neutral-800">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-800 mt-4 flex items-center justify-between">
                      <span className="text-xs text-neutral-400 font-semibold">{s.price || 'Custom'}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingService(s)}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(s.id)}
                          className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Service Modal */}
            {editingService && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <div className="bg-[#0B0B0B] border border-neutral-700 rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
                    <h3 className="text-lg font-bold text-white">
                      {editingService.id ? 'Edit Service' : 'Add New Service'}
                    </h3>
                    <button onClick={() => setEditingService(null)} className="text-neutral-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveService} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">Service Title</label>
                        <input
                          type="text"
                          required
                          value={editingService.title || ''}
                          onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                          className="w-full bg-[#141414] border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">Category</label>
                        <input
                          type="text"
                          required
                          value={editingService.category || ''}
                          onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                          className="w-full bg-[#141414] border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Image URL</label>
                      <input
                        type="url"
                        required
                        value={editingService.image || ''}
                        onChange={(e) => setEditingService({ ...editingService, image: e.target.value })}
                        className="w-full bg-[#141414] border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Short Description</label>
                      <input
                        type="text"
                        required
                        value={editingService.short_desc || ''}
                        onChange={(e) => setEditingService({ ...editingService, short_desc: e.target.value })}
                        className="w-full bg-[#141414] border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Full Description</label>
                      <textarea
                        rows={4}
                        required
                        value={editingService.full_desc || ''}
                        onChange={(e) => setEditingService({ ...editingService, full_desc: e.target.value })}
                        className="w-full bg-[#141414] border border-neutral-700 rounded-lg p-3 text-sm text-white focus:outline-none resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Features (one per line)
                      </label>
                      <textarea
                        rows={4}
                        value={(editingService.features || []).join('\n')}
                        onChange={(e) => setEditingService({
                          ...editingService,
                          features: e.target.value.split('\n').filter(line => line.trim())
                        })}
                        className="w-full bg-[#141414] border border-neutral-700 rounded-lg p-3 text-sm text-white focus:outline-none resize-none font-mono text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">Price Tag / Note</label>
                        <input
                          type="text"
                          value={editingService.price || ''}
                          onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
                          className="w-full bg-[#141414] border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">Display Order</label>
                        <input
                          type="number"
                          value={editingService.display_order ?? 0}
                          onChange={(e) => setEditingService({ ...editingService, display_order: Number(e.target.value) })}
                          className="w-full bg-[#141414] border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-800 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setEditingService(null)}
                        className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-lg bg-[#F4C542] text-black text-xs font-bold"
                      >
                        Save Service
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB: PORTFOLIO ================= */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <p className="text-xs text-neutral-400">
                All 25+ fictional website concepts across Construction, Remodeling, Interior Design, Metal & Steel, and E-commerce.
              </p>
              <button
                onClick={() => setEditingProject({
                  title: '',
                  category: 'CONSTRUCTION',
                  description: '',
                  preview_image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80',
                  demo_url: 'https://demo.bestwegiveagency.com',
                  is_featured: 1,
                  is_published: 1,
                  display_order: portfolio.length + 1
                })}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-[#F4C542] hover:bg-[#FFF3C4] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project Concept</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.map((p) => (
                <div key={p.id} className="bg-[#0B0B0B] border border-neutral-800 rounded-2xl overflow-hidden flex flex-col justify-between">
                  <div className="h-44 relative bg-neutral-900">
                    <img src={p.preview_image} alt={p.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 text-[10px] text-[#F4C542] font-bold">
                      DEMO CONCEPT
                    </span>
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/80 text-[10px] text-neutral-300 font-medium">
                      {p.category}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">{p.title}</h3>
                      <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{p.description}</p>
                    </div>

                    <div className="pt-4 border-t border-neutral-800 mt-4 flex items-center justify-between">
                      <span className="text-[11px] text-neutral-500">Order: #{p.display_order}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingProject(p)}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(p.id)}
                          className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Project Edit Modal */}
            {editingProject && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <div className="bg-[#0B0B0B] border border-neutral-700 rounded-2xl w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
                    <h3 className="text-lg font-bold text-white">
                      {editingProject.id ? 'Edit Concept' : 'Add New Concept'}
                    </h3>
                    <button onClick={() => setEditingProject(null)} className="text-neutral-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveProject} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Concept Title</label>
                      <input
                        type="text"
                        required
                        value={editingProject.title || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                        className="w-full bg-[#141414] border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Industry Category</label>
                      <select
                        value={editingProject.category || 'CONSTRUCTION'}
                        onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                        className="w-full bg-[#141414] border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                      >
                        <option value="CONSTRUCTION">CONSTRUCTION</option>
                        <option value="REMODELING">REMODELING</option>
                        <option value="INTERIOR DESIGN">INTERIOR DESIGN</option>
                        <option value="METAL & STEEL FABRICATION">METAL & STEEL FABRICATION</option>
                        <option value="E-COMMERCE">E-COMMERCE</option>
                        <option value="BUSINESS WEBSITES">BUSINESS WEBSITES</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Preview Image URL</label>
                      <input
                        type="url"
                        required
                        value={editingProject.preview_image || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, preview_image: e.target.value })}
                        className="w-full bg-[#141414] border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Description</label>
                      <textarea
                        rows={3}
                        required
                        value={editingProject.description || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                        className="w-full bg-[#141414] border border-neutral-700 rounded-lg p-3 text-sm text-white focus:outline-none resize-none"
                      />
                    </div>

                    <div className="pt-4 border-t border-neutral-800 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setEditingProject(null)}
                        className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-lg bg-[#F4C542] text-black text-xs font-bold"
                      >
                        Save Concept
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB: BLOG ================= */}
        {activeTab === 'blog' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <p className="text-xs text-neutral-400">Create, edit, and publish agency thought leadership articles.</p>
              <button
                onClick={() => setEditingPost({
                  title: '',
                  slug: '',
                  category: 'Website Design',
                  author: 'BestWeGive Agency',
                  cover_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
                  content: '',
                  seo_title: '',
                  meta_description: '',
                  status: 'published'
                })}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-[#F4C542] hover:bg-[#FFF3C4] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Write New Article</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((b) => (
                <div key={b.id} className="bg-[#0B0B0B] border border-neutral-800 rounded-2xl overflow-hidden flex flex-col justify-between">
                  <div className="h-40 relative bg-neutral-900">
                    <img src={b.cover_image} alt={b.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 text-[10px] text-[#F4C542] font-bold">
                      {b.category}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white line-clamp-1">{b.title}</h3>
                      <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{b.content}</p>
                    </div>

                    <div className="pt-4 border-t border-neutral-800 mt-4 flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-emerald-400">{b.status}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingPost(b)}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteBlogPost(b.id)}
                          className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Blog Post Edit Modal */}
            {editingPost && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <div className="bg-[#0B0B0B] border border-neutral-700 rounded-2xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
                    <h3 className="text-lg font-bold text-white">
                      {editingPost.id ? 'Edit Article' : 'Write Article'}
                    </h3>
                    <button onClick={() => setEditingPost(null)} className="text-neutral-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveBlogPost} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Article Title</label>
                      <input
                        type="text"
                        required
                        value={editingPost.title || ''}
                        onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                        className="w-full bg-[#141414] border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">Category</label>
                        <input
                          type="text"
                          required
                          value={editingPost.category || ''}
                          onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                          className="w-full bg-[#141414] border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">Author</label>
                        <input
                          type="text"
                          required
                          value={editingPost.author || ''}
                          onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                          className="w-full bg-[#141414] border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Cover Image URL</label>
                      <input
                        type="url"
                        required
                        value={editingPost.cover_image || ''}
                        onChange={(e) => setEditingPost({ ...editingPost, cover_image: e.target.value })}
                        className="w-full bg-[#141414] border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Content (Markdown / Text)</label>
                      <textarea
                        rows={8}
                        required
                        value={editingPost.content || ''}
                        onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                        className="w-full bg-[#141414] border border-neutral-700 rounded-lg p-3 text-sm text-white focus:outline-none resize-none font-mono text-xs leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">SEO Title</label>
                        <input
                          type="text"
                          value={editingPost.seo_title || ''}
                          onChange={(e) => setEditingPost({ ...editingPost, seo_title: e.target.value })}
                          className="w-full bg-[#141414] border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">Status</label>
                        <select
                          value={editingPost.status || 'published'}
                          onChange={(e) => setEditingPost({ ...editingPost, status: e.target.value as any })}
                          className="w-full bg-[#141414] border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                          <option value="scheduled">Scheduled</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-800 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setEditingPost(null)}
                        className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-lg bg-[#F4C542] text-black text-xs font-bold"
                      >
                        Publish Post
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB: REVIEWS ================= */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <p className="text-xs text-neutral-400">
                All client submissions start in PENDING. Only approved reviews appear on the public website.
              </p>
              <div className="flex items-center gap-2">
                {(['all', 'pending', 'approved', 'rejected'] as const).map(filter => (
                  <button
                    key={filter}
                    onClick={() => setReviewFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${
                      reviewFilter === filter ? 'bg-[#F4C542] text-black' : 'bg-[#141414] text-neutral-400 border border-neutral-800'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {reviews
                .filter(r => reviewFilter === 'all' || r.status === reviewFilter)
                .map((r) => (
                  <div key={r.id} className="p-6 rounded-2xl bg-[#0B0B0B] border border-neutral-800 flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-white text-base">{r.name}</span>
                        {r.company && <span className="text-xs text-neutral-400">({r.company})</span>}
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          r.status === 'approved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                          r.status === 'pending' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                          'bg-red-950 text-red-400 border border-red-800'
                        }`}>
                          {r.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[#F4C542]">
                        {[...Array(r.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#F4C542]" />
                        ))}
                      </div>
                      <p className="text-xs text-neutral-300 italic">"{r.message}"</p>
                      <div className="text-[11px] text-neutral-500 font-mono">{r.email}</div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {r.status !== 'approved' && (
                        <button
                          onClick={() => handleUpdateReviewStatus(r.id, 'approved', true)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      )}
                      {r.status !== 'rejected' && (
                        <button
                          onClick={() => handleUpdateReviewStatus(r.id, 'rejected')}
                          className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteReview(r.id)}
                        className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ================= TAB: APPOINTMENTS ================= */}
        {activeTab === 'appointments' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xs text-neutral-400">
                Incoming strategy booking consultations with validated Customer Email and WhatsApp lines.
              </p>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(status => (
                  <button
                    key={status}
                    onClick={() => setAppointmentFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase whitespace-nowrap ${
                      appointmentFilter === status ? 'bg-[#F4C542] text-black font-extrabold' : 'bg-[#141414] text-neutral-400 border border-neutral-800'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {appointments
                .filter(a => appointmentFilter === 'all' || a.status === appointmentFilter)
                .map((a) => (
                  <div key={a.id} className="p-6 rounded-2xl bg-[#0B0B0B] border border-neutral-800 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-900">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-base font-bold text-white">{a.customer_name}</h3>
                          <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded ${
                            a.status === 'confirmed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                            a.status === 'pending' ? 'bg-[#F4C542]/20 text-[#F4C542] border border-[#F4C542]/40' :
                            a.status === 'completed' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                            'bg-neutral-900 text-neutral-400'
                          }`}>
                            {a.status}
                          </span>
                        </div>
                        {a.company_name && (
                          <div className="text-xs text-neutral-400 mt-0.5">Company: {a.company_name}</div>
                        )}
                      </div>

                      <div className="text-left sm:text-right">
                        <div className="text-xs font-bold text-[#F4C542]">
                          {a.preferred_date} at {a.preferred_time}
                        </div>
                        <div className="text-[11px] text-neutral-500">Service: {a.service}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-300">
                      <div>
                        <span className="text-neutral-500 block">Direct Email:</span>
                        <a href={`mailto:${a.email}`} className="text-white hover:text-[#F4C542]">
                          {a.email}
                        </a>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">WhatsApp Line:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-mono font-semibold">{a.whatsapp_number}</span>
                          <a
                            href={`https://wa.me/${a.whatsapp_number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${a.customer_name},\n\nThis is BestWeGive Agency confirming your consultation request for ${a.preferred_date} at ${a.preferred_time}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900 transition-colors text-[10px] font-bold"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>Message Customer</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    {a.additional_message && (
                      <div className="p-3 rounded-lg bg-[#121212] border border-neutral-800 text-xs text-neutral-300">
                        <span className="font-semibold text-neutral-400 block mb-1">Customer Message:</span>
                        {a.additional_message}
                      </div>
                    )}

                    {/* Status Actions */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {a.status !== 'confirmed' && (
                          <button
                            onClick={() => handleUpdateAppointmentStatus(a.id, 'confirmed')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                          >
                            Confirm Appointment
                          </button>
                        )}
                        {a.status !== 'completed' && a.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateAppointmentStatus(a.id, 'completed')}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
                          >
                            Mark Completed
                          </button>
                        )}
                        {a.status !== 'cancelled' && (
                          <button
                            onClick={() => handleUpdateAppointmentStatus(a.id, 'cancelled')}
                            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => handleDeleteAppointment(a.id)}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                      >
                        Delete Record
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ================= TAB: INQUIRIES ================= */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search inquiries..."
                  value={inquirySearch}
                  onChange={(e) => setInquirySearch(e.target.value)}
                  className="w-full bg-[#111111] border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-neutral-900 border border-neutral-700 hover:border-[#F4C542] transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#F4C542]" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {inquiries
                .filter(i => !inquirySearch || i.name.toLowerCase().includes(inquirySearch.toLowerCase()) || i.email.toLowerCase().includes(inquirySearch.toLowerCase()))
                .map((inq) => (
                  <div key={inq.id} className="p-6 rounded-2xl bg-[#0B0B0B] border border-neutral-800 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-900">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-base font-bold text-white">{inq.name}</h3>
                          <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded ${
                            inq.status === 'new' ? 'bg-red-950 text-red-400 border border-red-800' :
                            inq.status === 'contacted' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                            inq.status === 'resolved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                            'bg-neutral-900 text-neutral-400'
                          }`}>
                            {inq.status}
                          </span>
                        </div>
                        {inq.company && <div className="text-xs text-neutral-400 mt-0.5">{inq.company}</div>}
                      </div>

                      <div className="text-xs text-neutral-400">
                        <span>Submitted: {new Date(inq.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-neutral-300">
                      <div>
                        <span className="text-neutral-500 block">Service:</span>
                        <strong className="text-white">{inq.service}</strong>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">Budget:</span>
                        <strong className="text-white">{inq.budget || 'Not specified'}</strong>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">Phone / WhatsApp:</span>
                        <strong className="text-white">{inq.phone}</strong>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#121212] border border-neutral-800 text-xs text-neutral-300 leading-relaxed whitespace-pre-line">
                      <span className="font-semibold text-neutral-400 block mb-1">Project Details:</span>
                      {inq.details}
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {inq.status === 'new' && (
                          <button
                            onClick={() => handleUpdateInquiryStatus(inq.id, 'read')}
                            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold cursor-pointer"
                          >
                            Mark Read
                          </button>
                        )}
                        {inq.status !== 'contacted' && (
                          <button
                            onClick={() => handleUpdateInquiryStatus(inq.id, 'contacted')}
                            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-black text-xs font-bold cursor-pointer"
                          >
                            Mark Contacted
                          </button>
                        )}
                        {inq.status !== 'resolved' && (
                          <button
                            onClick={() => handleUpdateInquiryStatus(inq.id, 'resolved')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                          >
                            Mark Resolved
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => handleDeleteInquiry(inq.id)}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                      >
                        Delete Inquiry
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ================= TAB: SOCIAL MEDIA ================= */}
        {activeTab === 'social' && (
          <div className="space-y-6 max-w-2xl animate-in fade-in">
            <p className="text-xs text-neutral-400">
              Configure official social media links. Icons are only displayed publicly if a valid URL exists and is enabled.
            </p>

            <div className="bg-[#0B0B0B] border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
              {socialLinks.map((item, idx) => (
                <div key={item.platform} className="p-4 rounded-xl bg-[#121212] border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      {item.platform}
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-400">
                      <input
                        type="checkbox"
                        checked={Boolean(item.is_enabled)}
                        onChange={(e) => {
                          const updated = [...socialLinks];
                          updated[idx] = { ...updated[idx], is_enabled: e.target.checked ? 1 : 0 };
                          setSocialLinks(updated);
                        }}
                        className="rounded bg-neutral-900 border-neutral-700 text-[#F4C542]"
                      />
                      <span>Active</span>
                    </label>
                  </div>
                  <input
                    type="url"
                    placeholder={`https://${item.platform}.com/...`}
                    value={item.url || ''}
                    onChange={(e) => {
                      const updated = [...socialLinks];
                      updated[idx] = { ...updated[idx], url: e.target.value };
                      setSocialLinks(updated);
                    }}
                    className="w-full bg-[#1A1A1A] border border-neutral-700 focus:border-[#F4C542] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              ))}

              <button
                onClick={handleSaveSocial}
                className="w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-[#F4C542] hover:bg-[#FFF3C4] transition-all cursor-pointer shadow-lg"
              >
                Save Social Media Settings
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB: WEBSITE SETTINGS ================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-3xl animate-in fade-in">
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200">
              <strong>Dynamic Live Sync:</strong> Updating the WhatsApp Number or Agency Email here automatically updates all headers, footers, appointment links, and CTA buttons across the entire website.
            </div>

            <form onSubmit={handleSaveSettings} className="bg-[#0B0B0B] border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                    Agency Name
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.agency_name}
                    onChange={(e) => setSettingsForm({ ...settingsForm, agency_name: e.target.value })}
                    className="w-full bg-[#141414] border border-neutral-700 focus:border-[#F4C542] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                    Official Agency Email
                  </label>
                  <input
                    type="email"
                    required
                    value={settingsForm.agency_email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, agency_email: e.target.value })}
                    className="w-full bg-[#141414] border border-neutral-700 focus:border-[#F4C542] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.whatsapp_number}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp_number: e.target.value })}
                    className="w-full bg-[#141414] border border-neutral-700 focus:border-[#F4C542] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                    Business Location
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.location}
                    onChange={(e) => setSettingsForm({ ...settingsForm, location: e.target.value })}
                    className="w-full bg-[#141414] border border-neutral-700 focus:border-[#F4C542] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                  Official Tagline
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.tagline}
                  onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                  className="w-full bg-[#141414] border border-neutral-700 focus:border-[#F4C542] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                  Homepage Main Headline
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.homepage_headline}
                  onChange={(e) => setSettingsForm({ ...settingsForm, homepage_headline: e.target.value })}
                  className="w-full bg-[#141414] border border-neutral-700 focus:border-[#F4C542] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                  Homepage Subheading Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={settingsForm.homepage_description}
                  onChange={(e) => setSettingsForm({ ...settingsForm, homepage_description: e.target.value })}
                  className="w-full bg-[#141414] border border-neutral-700 focus:border-[#F4C542] rounded-xl p-3 text-sm text-white focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                  Hero Image Path / URL
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.hero_image}
                  onChange={(e) => setSettingsForm({ ...settingsForm, hero_image: e.target.value })}
                  className="w-full bg-[#141414] border border-neutral-700 focus:border-[#F4C542] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                  Footer Description
                </label>
                <textarea
                  rows={2}
                  required
                  value={settingsForm.footer_description}
                  onChange={(e) => setSettingsForm({ ...settingsForm, footer_description: e.target.value })}
                  className="w-full bg-[#141414] border border-neutral-700 focus:border-[#F4C542] rounded-xl p-3 text-sm text-white focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                  Copyright Notice
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.copyright_text}
                  onChange={(e) => setSettingsForm({ ...settingsForm, copyright_text: e.target.value })}
                  className="w-full bg-[#141414] border border-neutral-700 focus:border-[#F4C542] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 rounded-full text-xs font-black uppercase tracking-wider text-black bg-[#F4C542] hover:bg-[#FFF3C4] shadow-xl shadow-[#F4C542]/20 transition-all cursor-pointer"
                >
                  SAVE & SYNC ALL WEBSITE SETTINGS
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= TAB: ADMIN USERS ================= */}
        {activeTab === 'users' && isSuperAdmin && (
          <div className="space-y-8 max-w-4xl animate-in fade-in">
            {/* Create New Admin */}
            <div className="bg-[#0B0B0B] border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-4">
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                Create Administrator Account
              </h3>
              <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  className="bg-[#141414] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
                <input
                  type="email"
                  required
                  placeholder="Admin Email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  className="bg-[#141414] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
                <input
                  type="password"
                  required
                  placeholder="Password (min 8 chars)"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  className="bg-[#141414] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
                <select
                  value={newAdmin.role}
                  onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                  className="bg-[#141414] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="CONTENT_ADMIN">CONTENT ADMIN</option>
                  <option value="BOOKING_ADMIN">BOOKING ADMIN</option>
                  <option value="SUPER_ADMIN">SUPER ADMIN</option>
                </select>

                <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-[#F4C542] text-black text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Add Administrator
                  </button>
                </div>
              </form>
            </div>

            {/* List Admins */}
            <div className="bg-[#0B0B0B] border border-neutral-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="bg-[#111111] text-neutral-400 uppercase tracking-wider border-b border-neutral-800">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {adminUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-neutral-900/50">
                      <td className="p-4 font-bold text-white">{u.name}</td>
                      <td className="p-4 font-mono text-neutral-400">{u.email}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] font-bold text-[#F4C542]">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.is_active ? 'text-emerald-400 bg-emerald-950' : 'text-red-400 bg-red-950'}`}>
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {u.id !== user?.id && (
                          <button
                            onClick={() => handleToggleAdminStatus(u)}
                            className="text-xs text-neutral-400 hover:text-white underline cursor-pointer"
                          >
                            {u.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB: PASSWORD ================= */}
        {activeTab === 'password' && (
          <div className="max-w-md bg-[#0B0B0B] border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Change Account Password
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full bg-[#141414] border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">New Password (min 8 chars)</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full bg-[#141414] border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full bg-[#141414] border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-[#F4C542] hover:bg-[#FFF3C4] transition-all cursor-pointer shadow-lg"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};
