'use client';

import { useState, useEffect } from 'react';
import { Phone, MapPin, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { contactAPI, settingsAPI } from '@/lib/api';

export default function ContactSection({ source = 'contact' }: { source?: 'home' | 'contact' }) {
  const [storeInfo, setStoreInfo] = useState({
    store_name: '',
    store_email: '',
    store_phone: '',
    store_address: '',
    business_mon_fri: '',
    business_sat: '',
    business_sun: '',
  });

  useEffect(() => {
    settingsAPI.getPublic().then(res => {
      if (res.settings) {
        setStoreInfo({
          store_name: res.settings.store_name || '',
          store_email: res.settings.store_email || '',
          store_phone: res.settings.store_phone || '',
          store_address: res.settings.store_address || '',
          business_mon_fri: res.settings.business_mon_fri || '',
          business_sat: res.settings.business_sat || '',
          business_sun: res.settings.business_sun || '',
        });
      }
    }).catch(() => {
      // Silently fall back to defaults if fetch fails
    });
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      await contactAPI.submit({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: formData.message,
        source: source,
      });
      setStatus({ type: 'success', message: 'Message sent successfully! We\'ll get back to you soon.' });
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-transparent text-[#FDF5E6]">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-sans font-black tracking-tighter text-white shrink-0 uppercase">
            CONTACT US
          </h2>
          <p className="text-white/60 md:max-w-xl text-lg leading-relaxed font-sans">
            If you have any questions, please feel free to get in touch with us via
            phone, text, email, the form below, or even on social media!
          </p>
        </div>

        {/* Form and Info Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column: Form */}
          <div className="bg-neutral-900/60 rounded-3xl p-8 lg:p-12 border border-[#E8B904]/20 backdrop-blur-sm">
            <h3 className="text-xl font-bold uppercase tracking-wide text-white mb-8 border-b border-white/10 pb-4">
              GET IN TOUCH
            </h3>

            {status && (
              <div className={`mb-6 flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${
                status.type === 'success' 
                  ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}>
                {status.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{status.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name*" 
                    className="w-full bg-black/40 border border-[#E8B904]/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#E8B904] transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number*" 
                    className="w-full bg-black/40 border border-[#E8B904]/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#E8B904] transition-colors" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email*" 
                  className="w-full bg-black/40 border border-[#E8B904]/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#E8B904] transition-colors" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">Your Message</label>
                <textarea 
                  rows={4} 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-[#E8B904]/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#E8B904] transition-colors resize-none"
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-[#A31616] hover:bg-[#800F0F] text-white font-bold uppercase tracking-widest text-sm py-4 px-8 rounded-[16px] w-full md:w-auto transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
              </button>
            </form>
          </div>

          {/* Right Column: Info & Hours */}
          <div className="flex flex-col gap-8">
            {/* Contact Information Box */}
            <div className="bg-neutral-900/60 rounded-3xl p-8 lg:p-12 border border-[#E8B904]/20 backdrop-blur-sm flex-1">
              <h3 className="text-xl font-bold uppercase tracking-wide text-white mb-8 border-b border-white/10 pb-4">
                CONTACT INFORMATION
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                {storeInfo.store_name && (
                  <div className="flex items-start gap-4 md:col-span-2">
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-white mb-2">Store Name</h4>
                      <p className="text-white/60">{storeInfo.store_name}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-[#A31616] shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-white mb-2">Phone</h4>
                    <p className="text-white/60">{storeInfo.store_phone || '302-679-3127'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-[#A31616] shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-white mb-2">Address</h4>
                    <p className="text-white/60 whitespace-pre-line">{storeInfo.store_address || '626 Newark Shopping Center Newark,  De 19711'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 md:col-span-2">
                  <Mail className="w-6 h-6 text-[#A31616] shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-white mb-2">Email</h4>
                    <p className="text-white/60">{storeInfo.store_email || 'corey.Williams@bongou.com'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours Box */}
            <div className="bg-neutral-900/60 rounded-3xl p-8 lg:p-12 border border-[#E8B904]/20 backdrop-blur-sm">
              <h3 className="text-xl font-bold uppercase tracking-wide text-white mb-8 border-b border-white/10 pb-4">
                BUSINESS HOURS
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-left">
                <div>
                  <h4 className="font-bold text-[10px] md:text-xs uppercase tracking-wider text-white mb-2">Tuesday - Saturday</h4>
                  <p className="text-white/60 text-sm">{storeInfo.business_mon_fri || '11:30 am - 9:00 pm'}</p>
                </div>
                {/* <div>
                  <h4 className="font-bold text-[10px] md:text-xs uppercase tracking-wider text-white mb-2">Saturday</h4>
                  <p className="text-white/60 text-sm">{storeInfo.business_sat || '11:30 am - 9:00 pm'}</p>
                </div> */}
                <div className="col-span-2 md:col-span-1">
                  <h4 className="font-bold text-[10px] md:text-xs uppercase tracking-wider text-white mb-2">Sunday</h4>
                  <p className="text-white/60 text-sm">{storeInfo.business_sun || '12:00 pm - 6:30 pm'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="w-full h-[400px] bg-neutral-900/60 rounded-3xl border border-[#E8B904]/20 backdrop-blur-sm overflow-hidden relative">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1483.5682855140685!2d-88.31885834839845!3d42.06201389814421!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880f0e0147fcb29b%3A0xe54d8fb855de9a7a!2s1425%20N%20McLean%20Blvd%2C%20Elgin%2C%20IL%2060123!5e0!3m2!1sen!2sus!4v1700681534065!5m2!1sen!2sus" 
            className="absolute inset-0 w-full h-full border-0 opacity-100" 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade">
          </iframe>
        </div>

      </div>
    </section>
  );
}
