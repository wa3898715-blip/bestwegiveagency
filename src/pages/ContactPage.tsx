import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Mail, MessageSquare, MapPin, Send, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';

interface ContactPageProps {
  onNavigate?: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const { settings, getWhatsAppUrl, showToast } = useApp();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: 'Website Development',
    budget: '$3,000 – $5,000',
    details: ''
  });

  const servicesList = [
    'Website Development',
    'Branding & Creative Design',
    'Digital Marketing & Meta Ads',
    'AI Solutions & Automation',
    'Career & Recruitment Optimization',
    'E-Commerce Storefront Development',
    'Other Custom Solution'
  ];

  const budgetTiers = [
    'Under $2,000',
    '$2,000 – $5,000',
    '$5,000 – $10,000',
    '$10,000 – $25,000',
    '$25,000+'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.details.trim()) {
      showToast('Please fill out all required fields marked with *', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitInquiry(formData);
      setSubmitted(true);
      showToast(res.message, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to submit inquiry', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-24 bg-[#000000]">
      {/* Header Banner */}
      <section className="py-16 bg-[#080808] border-b border-[#171717]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-[#F4C542]/30 text-xs font-semibold uppercase tracking-[0.25em] text-[#F4C542]">
            <span>GET IN TOUCH</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            LET'S TALK ABOUT <span className="text-[#F4C542]">YOUR PROJECT</span>
          </h1>
          <p className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto">
            Have an idea or need help growing your business? Let's discuss how BestWeGive Agency can help.
          </p>
        </div>
      </section>

      {/* Main Grid: Info on Left, Form on Right */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details Column (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#0B0B0B] border border-neutral-800 rounded-2xl p-8 space-y-6">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">
                Agency Headquarters
              </h2>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Connect with our Bronx studio directly. Every consultation and project inquiry is answered by a senior strategist within 24 business hours.
              </p>

              <div className="space-y-6 pt-2">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-black border border-[#F4C542]/40 flex items-center justify-center text-[#F4C542] shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block">
                      Direct Agency Email
                    </span>
                    <a
                      href={`mailto:${settings.agency_email}`}
                      className="text-sm font-semibold text-white hover:text-[#F4C542] transition-colors break-all"
                    >
                      {settings.agency_email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-black border border-[#F4C542]/40 flex items-center justify-center text-[#F4C542] shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block">
                      WhatsApp Line
                    </span>
                    <a
                      href={getWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-white hover:text-[#F4C542] transition-colors"
                    >
                      {settings.whatsapp_number}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-black border border-[#F4C542]/40 flex items-center justify-center text-[#F4C542] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block">
                      Location
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {settings.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Callout */}
              <div className="pt-4 border-t border-neutral-800">
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#141414] hover:bg-[#1a1a1a] border border-neutral-700 hover:border-[#F4C542] transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-[#F4C542]" />
                  <span>START CHAT ON WHATSAPP</span>
                </a>
              </div>
            </div>

            {/* Response Guarantee Badge */}
            <div className="p-6 rounded-2xl bg-[#0B0B0B] border border-neutral-800 flex items-center gap-4">
              <ShieldCheck className="w-8 h-8 text-[#F4C542] shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Confidential & Direct
                </h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Your project details and business metrics are treated under strict confidentiality.
                </p>
              </div>
            </div>
          </div>

          {/* Form Column (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-[#0B0B0B] border border-neutral-800 rounded-2xl p-8 sm:p-10 shadow-2xl relative">
              {submitted ? (
                <div className="text-center py-12 space-y-4 animate-in fade-in">
                  <div className="w-16 h-16 rounded-full bg-[#F4C542]/20 border border-[#F4C542] flex items-center justify-center mx-auto text-[#F4C542]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Inquiry Received Successfully</h3>
                  <p className="text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-white">{formData.name}</strong>. Your inquiry has been securely routed to our senior team at{' '}
                    <span className="text-[#F4C542]">{settings.agency_email}</span>. We will review your project requirements and follow up promptly.
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: '',
                          email: '',
                          phone: '',
                          company: '',
                          service: 'Website Development',
                          budget: '$3,000 – $5,000',
                          details: ''
                        });
                      }}
                      className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-[#F4C542] hover:bg-[#FFF3C4]"
                    >
                      Submit Another Inquiry
                    </button>
                    <a
                      href={getWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white border border-neutral-700 hover:border-[#F4C542]"
                    >
                      Chat on WhatsApp Now
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="border-b border-neutral-800 pb-4 mb-2">
                    <h3 className="text-xl font-bold text-white">Project Inquiry Form</h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      Tell us about your brand goals, target timeline, and service requirements.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#141414] border border-neutral-700 focus:border-[#F4C542] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#141414] border border-neutral-700 focus:border-[#F4C542] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 929..."
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#141414] border border-neutral-700 focus:border-[#F4C542] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                        Company Name (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Your Business Name"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full bg-[#141414] border border-neutral-700 focus:border-[#F4C542] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                        Service Interested In *
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full bg-[#141414] border border-neutral-700 focus:border-[#F4C542] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                      >
                        {servicesList.map(s => (
                          <option key={s} value={s} className="bg-[#141414] text-white">
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                        Estimated Budget
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full bg-[#141414] border border-neutral-700 focus:border-[#F4C542] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                      >
                        {budgetTiers.map(b => (
                          <option key={b} value={b} className="bg-[#141414] text-white">
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                      Project Details *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Describe your current business, your primary goals, any design references you love, and your desired launch timeline..."
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      className="w-full bg-[#141414] border border-neutral-700 focus:border-[#F4C542] rounded-xl p-4 text-sm text-white focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 rounded-full text-xs font-extrabold uppercase tracking-wider text-black bg-[#F4C542] hover:bg-[#FFF3C4] shadow-lg shadow-[#F4C542]/20 transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4 text-black" />
                      <span>{submitting ? 'SENDING INQUIRY...' : 'SEND YOUR INQUIRY'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
