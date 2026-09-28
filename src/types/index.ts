export interface WebsiteSettings {
  agency_name: string;
  agency_email: string;
  whatsapp_number: string;
  whatsapp_link: string;
  location: string;
  tagline: string;
  homepage_headline: string;
  homepage_description: string;
  hero_image: string;
  footer_description: string;
  copyright_text: string;
  [key: string]: string;
}

export interface SocialLink {
  platform: 'facebook' | 'instagram' | 'linkedin' | string;
  url: string;
  is_enabled: number | boolean;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  category: string;
  short_desc: string;
  full_desc: string;
  image: string;
  features: string[];
  price?: string;
  display_order: number;
  is_published: number | boolean;
  created_at?: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: 'CONSTRUCTION' | 'REMODELING' | 'INTERIOR DESIGN' | 'METAL & STEEL FABRICATION' | 'E-COMMERCE' | 'BUSINESS WEBSITES' | string;
  description: string;
  preview_image: string;
  additional_images?: string[];
  demo_url?: string;
  is_featured: number | boolean;
  is_published: number | boolean;
  display_order: number;
  created_at?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  cover_image: string;
  content: string;
  seo_title?: string;
  meta_description?: string;
  status: 'published' | 'draft' | 'scheduled';
  published_at: string;
  created_at?: string;
}

export interface Review {
  id: string;
  name: string;
  email: string;
  company?: string;
  rating: number;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  is_featured: number | boolean;
  created_at?: string;
}

export interface Appointment {
  id: string;
  customer_name: string;
  email: string;
  whatsapp_number: string;
  company_name?: string;
  service: string;
  preferred_date: string;
  preferred_time: string;
  additional_message?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  created_at: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  service: string;
  budget?: string;
  details: string;
  status: 'new' | 'read' | 'contacted' | 'resolved';
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'CONTENT_ADMIN' | 'BOOKING_ADMIN';
  is_active: number | boolean;
  last_login?: string;
  created_at: string;
}

export interface DashboardStats {
  total_services: number;
  total_portfolio: number;
  published_blogs: number;
  pending_reviews: number;
  new_inquiries: number;
  pending_appointments: number;
  confirmed_appointments: number;
}
