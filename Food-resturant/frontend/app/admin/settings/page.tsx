'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { Save, Mail, Settings as SettingsIcon, CreditCard } from 'lucide-react';
import { settingsAPI } from '@/lib/api';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState({
    smtp_host: '',
    smtp_port: '587',
    smtp_user: '',
    smtp_password: '',
    smtp_from_name: 'Bongou Restaurant',
    smtp_from_email: 'noreply@bongou.com',
    store_name: 'Bongou Restaurant',
    store_address: '',
    store_phone: '',
    store_email: '',
    business_mon_fri: '9:00 am - 8:00 pm',
    business_sat: '9:00 am - 6:00 pm',
    business_sun: '9:00 am - 5:00 pm',
    stripe_publishable_key: '',
    stripe_secret_key: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchSettings(token);
  }, [router]);

  const fetchSettings = async (token: string) => {
    try {
      const data = await settingsAPI.get(token);
      if (data.settings) {
        setSettings(prev => ({ ...prev, ...data.settings }));
      }
    } catch (err: any) {
      if (err.message.includes('Invalid token') || err.message.includes('token')) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        router.push('/admin/login');
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      await settingsAPI.update(settings, token);
      setSuccess('Settings saved successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#E8B904] text-xl">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      <AdminSidebar />

      <div className="container mx-auto px-6 py-12">
        <h2 className="text-4xl font-black text-white uppercase tracking-tight mb-12">Settings</h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-8">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl text-sm mb-8">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-3xl space-y-12">
          {/* Store Information */}
          <div className="bg-neutral-900 border border-[#E8B904]/20 rounded-3xl p-8">
            <div className="flex items-center gap-4 mb-8">
              <SettingsIcon className="w-6 h-6 text-[#E8B904]" />
              <h3 className="text-xl font-bold text-white">Store Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Store Name</label>
                <input
                  type="text"
                  name="store_name"
                  value={settings.store_name}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Store Email</label>
                <input
                  type="email"
                  name="store_email"
                  value={settings.store_email}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Store Phone</label>
                <input
                  type="text"
                  name="store_phone"
                  value={settings.store_phone}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Store Address</label>
                <input
                  type="text"
                  name="store_address"
                  value={settings.store_address}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-neutral-900 border border-[#E8B904]/20 rounded-3xl p-8">
            <div className="flex items-center gap-4 mb-8">
              <SettingsIcon className="w-6 h-6 text-[#E8B904]" />
              <h3 className="text-xl font-bold text-white">Business Hours</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Monday - Friday</label>
                <input
                  type="text"
                  name="business_mon_fri"
                  value={settings.business_mon_fri}
                  onChange={handleChange}
                  placeholder="9:00 am - 8:00 pm"
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Saturday</label>
                <input
                  type="text"
                  name="business_sat"
                  value={settings.business_sat}
                  onChange={handleChange}
                  placeholder="9:00 am - 6:00 pm"
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Sunday</label>
                <input
                  type="text"
                  name="business_sun"
                  value={settings.business_sun}
                  onChange={handleChange}
                  placeholder="9:00 am - 5:00 pm"
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
                />
              </div>
            </div>
          </div>

          {/* SMTP Settings */}
          <div className="bg-neutral-900 border border-[#E8B904]/20 rounded-3xl p-8">
            <div className="flex items-center gap-4 mb-8">
              <Mail className="w-6 h-6 text-[#E8B904]" />
              <h3 className="text-xl font-bold text-white">SMTP Settings</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">SMTP Host</label>
                <input
                  type="text"
                  name="smtp_host"
                  value={settings.smtp_host}
                  onChange={handleChange}
                  placeholder="smtp.gmail.com"
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">SMTP Port</label>
                  <input
                    type="text"
                    name="smtp_port"
                    value={settings.smtp_port}
                    onChange={handleChange}
                    placeholder="587"
                    className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">SMTP User</label>
                  <input
                    type="text"
                    name="smtp_user"
                    value={settings.smtp_user}
                    onChange={handleChange}
                    placeholder="your email"
                    className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">SMTP Password</label>
                  <input
                    type="password"
                    name="smtp_password"
                    value={settings.smtp_password}
                    onChange={handleChange}
                    placeholder="App password"
                    className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">From Name</label>
                  <input
                    type="text"
                    name="smtp_from_name"
                    value={settings.smtp_from_name}
                    onChange={handleChange}
                    className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">From Email</label>
                <input
                  type="email"
                  name="smtp_from_email"
                  value={settings.smtp_from_email}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Stripe Settings */}
          <div className="bg-neutral-900 border border-[#E8B904]/20 rounded-3xl p-8">
            <div className="flex items-center gap-4 mb-8">
              <CreditCard className="w-6 h-6 text-[#E8B904]" />
              <h3 className="text-xl font-bold text-white">Stripe Payment Settings</h3>
            </div>

            <div className="space-y-6">
              <p className="text-sm text-white/50">
                Enter your Stripe API keys to enable card payments at checkout. Get your keys from the{' '}
                <a
                  href="https://dashboard.stripe.com/apikeys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E8B904] underline underline-offset-2"
                >
                  Stripe Dashboard
                </a>.
              </p>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Publishable Key
                  <span className="ml-2 text-xs text-white/30">(starts with pk_)</span>
                </label>
                <input
                  type="text"
                  name="stripe_publishable_key"
                  value={settings.stripe_publishable_key}
                  onChange={handleChange}
                  placeholder="pk_live_... or pk_test_..."
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Secret Key
                  <span className="ml-2 text-xs text-white/30">(starts with sk_)</span>
                </label>
                <input
                  type="password"
                  name="stripe_secret_key"
                  value={settings.stripe_secret_key}
                  onChange={handleChange}
                  placeholder="sk_live_... or sk_test_..."
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none font-mono text-sm"
                />
                <p className="mt-2 text-xs text-white/30">
                  The secret key is stored securely and never exposed to the browser.
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#E8B904] text-black font-black uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-[#CFA203] transition-colors shadow-[0_0_20px_rgba(232,185,4,0.3)] disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </main>
  );
}
