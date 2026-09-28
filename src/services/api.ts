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
} from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('bwg_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export const api = {
  // Website Settings
  async getSettings(): Promise<WebsiteSettings> {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch website settings');
    return res.json();
  },

  async updateSettings(settings: Partial<WebsiteSettings>): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update settings');
    }
    return res.json();
  },

  // Social Links
  async getSocialLinks(): Promise<SocialLink[]> {
    const res = await fetch(`${API_BASE}/social`);
    if (!res.ok) throw new Error('Failed to fetch social links');
    return res.json();
  },

  async updateSocialLinks(links: SocialLink[]): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/social`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ links })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update social links');
    }
    return res.json();
  },

  // Services
  async getServices(all = false): Promise<Service[]> {
    const res = await fetch(`${API_BASE}/services${all ? '?all=true' : ''}`);
    if (!res.ok) throw new Error('Failed to fetch services');
    return res.json();
  },

  async createService(data: Partial<Service>): Promise<{ message: string; id: string }> {
    const res = await fetch(`${API_BASE}/services`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create service');
    }
    return res.json();
  },

  async updateService(id: string, data: Partial<Service>): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/services/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update service');
    }
    return res.json();
  },

  async deleteService(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/services/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete service');
    return res.json();
  },

  // Portfolio
  async getPortfolio(category?: string, all = false): Promise<PortfolioProject[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (all) params.append('all', 'true');
    const res = await fetch(`${API_BASE}/portfolio?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch portfolio projects');
    return res.json();
  },

  async createPortfolioProject(data: Partial<PortfolioProject>): Promise<{ message: string; id: string }> {
    const res = await fetch(`${API_BASE}/portfolio`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create portfolio project');
    }
    return res.json();
  },

  async updatePortfolioProject(id: string, data: Partial<PortfolioProject>): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/portfolio/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update portfolio project');
    }
    return res.json();
  },

  async deletePortfolioProject(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/portfolio/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete portfolio project');
    return res.json();
  },

  // Blog
  async getBlogPosts(category?: string, all = false): Promise<BlogPost[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (all) params.append('all', 'true');
    const res = await fetch(`${API_BASE}/blog?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch blog posts');
    return res.json();
  },

  async getBlogPostBySlug(slug: string): Promise<BlogPost> {
    const res = await fetch(`${API_BASE}/blog?slug=${encodeURIComponent(slug)}`);
    if (!res.ok) throw new Error('Blog post not found');
    return res.json();
  },

  async createBlogPost(data: Partial<BlogPost>): Promise<{ message: string; id: string }> {
    const res = await fetch(`${API_BASE}/blog`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create blog post');
    }
    return res.json();
  },

  async updateBlogPost(id: string, data: Partial<BlogPost>): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/blog/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update blog post');
    }
    return res.json();
  },

  async deleteBlogPost(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/blog/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete blog post');
    return res.json();
  },

  // Reviews
  async getApprovedReviews(): Promise<Review[]> {
    const res = await fetch(`${API_BASE}/reviews`);
    if (!res.ok) throw new Error('Failed to fetch reviews');
    return res.json();
  },

  async getAllReviewsAdmin(): Promise<Review[]> {
    const res = await fetch(`${API_BASE}/reviews/admin`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch admin reviews');
    return res.json();
  },

  async submitReview(data: { name: string; email: string; company?: string; rating: number; message: string }): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to submit review');
    return result;
  },

  async updateReviewStatus(id: string, status: string, is_featured?: boolean): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/reviews/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, is_featured })
    });
    if (!res.ok) throw new Error('Failed to update review');
    return res.json();
  },

  async deleteReview(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/reviews/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete review');
    return res.json();
  },

  // Appointments
  async getAvailability(date: string): Promise<{ bookedSlots: string[] }> {
    const res = await fetch(`${API_BASE}/appointments/availability?date=${encodeURIComponent(date)}`);
    if (!res.ok) throw new Error('Failed to check availability');
    return res.json();
  },

  async bookAppointment(data: {
    customer_name: string;
    email: string;
    whatsapp_number: string;
    company_name?: string;
    service: string;
    preferred_date: string;
    preferred_time: string;
    additional_message?: string;
  }): Promise<{ success: boolean; message: string; appointmentId: string }> {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to book appointment');
    return result;
  },

  async getAdminAppointments(status?: string, date?: string): Promise<Appointment[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (date) params.append('date', date);
    const res = await fetch(`${API_BASE}/appointments/admin?${params.toString()}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch appointments');
    return res.json();
  },

  async updateAppointmentStatus(id: string, data: { status: string; preferred_date?: string; preferred_time?: string }): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/appointments/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update appointment');
    return res.json();
  },

  async deleteAppointment(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/appointments/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete appointment');
    return res.json();
  },

  // Contact Inquiries
  async submitInquiry(data: {
    name: string;
    email: string;
    phone: string;
    company?: string;
    service: string;
    budget?: string;
    details: string;
  }): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to submit inquiry');
    return result;
  },

  async getAdminInquiries(status?: string, search?: string): Promise<ContactInquiry[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    const res = await fetch(`${API_BASE}/inquiries/admin?${params.toString()}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch inquiries');
    return res.json();
  },

  async updateInquiryStatus(id: string, status: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/inquiries/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update inquiry');
    return res.json();
  },

  async deleteInquiry(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/inquiries/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete inquiry');
    return res.json();
  },

  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/stats`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return res.json();
  },

  // Admin Users
  async getAdminUsers(): Promise<AdminUser[]> {
    const res = await fetch(`${API_BASE}/users`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch admin users');
    return res.json();
  },

  async createAdminUser(data: { email: string; password: string; name: string; role: string }): Promise<{ message: string; id: string }> {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to create admin user');
    return result;
  },

  async updateAdminUser(id: string, data: Partial<AdminUser> & { password?: string }): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update admin user');
    }
    return res.json();
  },

  async deleteAdminUser(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete admin user');
    }
    return res.json();
  }
};
