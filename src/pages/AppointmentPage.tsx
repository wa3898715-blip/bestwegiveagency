import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Calendar as CalendarIcon, Clock, MessageSquare, CheckCircle, ShieldCheck, AlertCircle } from 'lucide-react';

interface AppointmentPageProps {
  onNavigate?: (path: string) => void;
  preselectedService?: string;
}

export const AppointmentPage: React.FC<AppointmentPageProps> = ({ onNavigate, preselectedService }) => {
  const { settings, getWhatsAppUrl, showToast } = useApp();

  const servicesList = [
    'Website Development',
    'Branding & Creative Design',
    'Digital Marketing',
    'AI Solutions',
    'Career & Recruitment',
    'E-Commerce Solutions',
    'General Digital Strategy'
  ];

  const standardTimeSlots = [
    '09:00 AM',
    '10:30 AM',
    '12:00 PM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM'
  ];

  // Default to tomorrow's date formatted as YYYY-MM-DD
  const getTomorrowString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    whatsapp_number: '',
    company_name: '',
    service: preselectedService || 'Website Development',
    preferred_date: getTomorrowString(),
    preferred_time: '10:30 AM',
    additional_message: ''
  });

  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Fetch booked slots for the selected date to prevent double bookings
  useEffect(() => {
    if (!formData.preferred_date) return;
    setLoadingAvailability(true);
    api.getAvailability(formData.preferred_date)
      .then(res => {
        setBookedSlots(res.bookedSlots || []);
        // If current selected time is booked, auto-select first available slot
        if (res.bookedSlots && res.bookedSlots.includes(formData.preferred_time)) {
          const available = standardTimeSlots.find(s => !res.bookedSlots.includes(s));
          if (available) {
            setFormData(prev => ({ ...prev, preferred_time: available }));
          }
        }
      })
      .catch(err => console.error('Error fetching availability:', err))
      .finally(() => setLoadingAvailability(false));
  }, [formData.preferred_date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // CRITICAL VALIDATION: Email and WhatsApp Number MUST be required
    if (!formData.customer_name.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      showToast('A valid Email Address is strictly required to book an appointment', 'error');
      return;
    }
    if (!formData.whatsapp_number.trim() || formData.whatsapp_number.replace(/[^0-9]/g, '').length < 8) {
      showToast('A valid WhatsApp phone number with country code is strictly required', 'error');
      return;
    }
    if (!formData.preferred_date || !formData.preferred_time) {
      showToast('Please select an available date and time slot', 'error');
      return;
    }
    if (bookedSlots.includes(formData.preferred_time)) {
      showToast('Selected time slot is already booked. Please choose an open slot.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.bookAppointment(formData);
      setSubmitted(true);
      showToast('Consultation request booked successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to book appointment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Generate WhatsApp prefilled booking message
  const getWhatsAppBookingUrl = () => {
    const cleanPhone = settings.whatsapp_number.replace(/[^0-9]/g, '');
    const prefilledText =
      `Hello BestWeGive Agency,\n\n` +
      `I would like to book a consultation.\n\n` +
      `My name: ${formData.customer_name || '[Your Name]'}\n` +
      `My WhatsApp number: ${formData.whatsapp_number || '[Your Phone]'}\n` +
      `My email: ${formData.email || '[Your Email]'}\n` +
      `My preferred date: ${formData.preferred_date || '[Preferred Date]'}\n` +
      `My preferred time: ${formData.preferred_time || '[Preferred Time]'}\n` +
      `Service required: ${formData.service || 'Website Development'}\n\n` +
      `Please let me know your availability.`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(prefilledText)}`;
  };

  return (
    <div className="pt-28 pb-24 bg-[#000000]">
      {/* Header */}
      <section className="py-16 bg-[#080808] border-b border-[#171717]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-[#F4C542]/30 text-xs font-semibold uppercase tracking-[0.25em] text-[#F4C542]">
            <span>SCHEDULE STRATEGY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            BOOK YOUR <span className="text-[#F4C542]">FREE CONSULTATION</span>
          </h1>
          <p className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto">
            Choose a convenient time to discuss your business goals and project requirements.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Booking Form (8 cols) */}
          <div className="lg:col-span-8">
            <div className="bg-[#0B0B0B] border border-neutral-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
              {submitted ? (
                <div className="text-center py-12 space-y-5 animate-in fade-in">
                  <div className="w-20 h-20 rounded-full bg-[#F4C542]/20 border-2 border-[#F4C542] flex items-center justify-center mx-auto text-[#F4C542]">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    Your appointment request has been submitted successfully.
                  </h3>
                  <div className="p-6 rounded-2xl bg-[#121212] border border-neutral-800 text-sm text-neutral-300 max-w-xl mx-auto space-y-3 leading-relaxed">
                    <p className="font-semibold text-white">
                      We received your email and WhatsApp number. Our team will contact you to confirm your appointment.
                    </p>
                    <div className="text-xs text-neutral-400 pt-2 border-t border-neutral-800 flex flex-col sm:flex-row justify-around gap-2">
                      <span><strong>Requested Date:</strong> {formData.preferred_date}</span>
                      <span><strong>Time Slot:</strong> {formData.preferred_time}</span>
                      <span><strong>Service:</strong> {formData.service}</span>
                    </div>
                  </div>

                  <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          customer_name: '',
                          email: '',
                          whatsapp_number: '',
                          company_name: '',
                          service: 'Website Development',
                          preferred_date: getTomorrowString(),
                          preferred_time: '10:30 AM',
                          additional_message: ''
                        });
                      }}
                      className="px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-[#F4C542] hover:bg-[#FFF3C4] transition-all cursor-pointer"
                    >
                      Book Another Slot
                    </button>
                    <a
                      href={getWhatsAppBookingUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white border border-neutral-700 hover:border-[#F4C542] transition-all"
                    >
                      Confirm Faster via WhatsApp
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">Appointment Details</h3>
                      <p className="text-xs text-neutral-400 mt-1">
                        Both Email Address and WhatsApp Number are required for confirmation.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-[#F4C542]/10 text-[#F4C542] border border-[#F4C542]/20">
                      Free Strategy Call
                    </span>
                  </div>

                  {/* Customer Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Johnathan Doe"
                        value={formData.customer_name}
                        onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                        className="w-full bg-[#141414] border border-neutral-700 focus:border-[#F4C542] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                        Email Address * <span className="text-[#F4C542] lowercase font-normal">(required)</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#141414] border border-neutral-700 focus:border-[#F4C542] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* WhatsApp Number & Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                        WhatsApp Number * <span className="text-[#F4C542] lowercase font-normal">(with country code)</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 929..."
                        value={formData.whatsapp_number}
                        onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                        className="w-full bg-[#141414] border border-neutral-700 focus:border-[#F4C542] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                        Company Name (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Acme Corp"
                        value={formData.company_name}
                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                        className="w-full bg-[#141414] border border-neutral-700 focus:border-[#F4C542] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Service Selection */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                      Service Required *
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

                  {/* Date & Time Slot Picker */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                        Select Preferred Date *
                      </label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.preferred_date}
                        onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                        className="w-full bg-[#141414] border border-neutral-700 focus:border-[#F4C542] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                      />
                      <span className="text-[11px] text-neutral-500 mt-1 block">
                        Live double-booking prevention active
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                        Select Available Time Slot *
                      </label>
                      {loadingAvailability ? (
                        <div className="py-3 text-xs text-neutral-500">Checking open slots...</div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          {standardTimeSlots.map((slot) => {
                            const isBooked = bookedSlots.includes(slot);
                            const isSelected = formData.preferred_time === slot;
                            return (
                              <button
                                key={slot}
                                type="button"
                                disabled={isBooked}
                                onClick={() => setFormData({ ...formData, preferred_time: slot })}
                                className={`py-2.5 px-3 rounded-lg text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                                  isBooked
                                    ? 'bg-neutral-900 text-neutral-600 border border-neutral-900 cursor-not-allowed line-through'
                                    : isSelected
                                    ? 'bg-[#F4C542] text-black border border-[#F4C542] shadow-md shadow-[#F4C542]/20 font-extrabold'
                                    : 'bg-[#141414] text-neutral-300 border border-neutral-800 hover:border-neutral-600'
                                }`}
                              >
                                <Clock className="w-3 h-3" />
                                <span>{slot}</span>
                                {isBooked && <span className="text-[9px] ml-1">(Booked)</span>}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Message */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                      Project Notes / Special Requests (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Share any specific challenges or links to your current website..."
                      value={formData.additional_message}
                      onChange={(e) => setFormData({ ...formData, additional_message: e.target.value })}
                      className="w-full bg-[#141414] border border-neutral-700 focus:border-[#F4C542] rounded-xl p-4 text-sm text-white focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 rounded-full text-xs font-black uppercase tracking-wider text-black bg-[#F4C542] hover:bg-[#FFF3C4] shadow-xl shadow-[#F4C542]/20 transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <CalendarIcon className="w-4 h-4 text-black" />
                      <span>{submitting ? 'CONFIRMING APPOINTMENT...' : 'CONFIRM FREE CONSULTATION'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Book Through WhatsApp & Benefits (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Dedicated "BOOK THROUGH WHATSAPP" Card */}
            <div className="bg-gradient-to-b from-[#0F1A12] to-[#0A0A0A] border border-emerald-500/30 rounded-3xl p-8 space-y-5 shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
                    Instant Messaging
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    BOOK THROUGH WHATSAPP
                  </h3>
                </div>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed">
                Prefer immediate messaging? Connect straight to our senior team on WhatsApp with your consultation details pre-formatted.
              </p>

              <div className="bg-black/60 rounded-xl p-4 border border-emerald-500/20 text-xs text-neutral-300 space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Official Line:</span>
                  <strong className="text-white">{settings.whatsapp_number}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Typical Response:</span>
                  <strong className="text-emerald-400">&lt; 15 Minutes</strong>
                </div>
              </div>

              <a
                href={getWhatsAppBookingUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-3 py-3.5 px-5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-950/40 transition-all text-center group"
              >
                <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>BOOK VIA WHATSAPP</span>
              </a>
            </div>

            {/* Why Book With BestWeGive */}
            <div className="bg-[#0B0B0B] border border-neutral-800 rounded-3xl p-8 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#F4C542]">
                What to Expect
              </h4>
              <ul className="space-y-3 text-xs text-neutral-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#F4C542] shrink-0 mt-0.5" />
                  <span>30-minute high-impact video or audio consultation</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#F4C542] shrink-0 mt-0.5" />
                  <span>Full website & conversion funnel preliminary audit</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#F4C542] shrink-0 mt-0.5" />
                  <span>Transparent timeline, deliverables & scope estimate</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#F4C542] shrink-0 mt-0.5" />
                  <span>Zero high-pressure sales tactics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
