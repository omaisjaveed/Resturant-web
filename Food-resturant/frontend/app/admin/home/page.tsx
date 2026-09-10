'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { homePageAPI, testimonialAPI } from '@/lib/api';
import { Save, RefreshCw } from 'lucide-react';
import { toast } from '@/components/Toast';

interface HomePageContent {
  [key: string]: {
    value: string;
    type: 'text' | 'json' | 'image';
    updated_at?: string;
  };
}

interface Testimonial {
  id: number;
  name: string;
  company: string | null;
  quote: string;
  status: 'draft' | 'published';
}

export default function AdminHomePage() {
  const router = useRouter();
  const [content, setContent] = useState<HomePageContent>({});
  const [originalContent, setOriginalContent] = useState<HomePageContent>({});
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [contentData, testimonialData] = await Promise.all([
          homePageAPI.getAll(),
          testimonialAPI.getAdminList(token)
        ]);

        setContent(contentData.content || {});
        setOriginalContent(contentData.content || {});
        setTestimonials(testimonialData.testimonials || []);
      } catch (err: any) {
        if (err.message.includes('token') || err.message.includes('Invalid')) {
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

    fetchData();
  }, [router]);

  const updateContent = (key: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        value,
        type: prev[key]?.type || 'text'
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    setIsSaving(true);
    try {
      await homePageAPI.update(content, token);
      setOriginalContent(content);
      setHasChanges(false);
      toast.success('Home page content saved successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save home page content');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setContent(originalContent);
    setHasChanges(false);
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tight">Home Page Management</h2>
            <p className="text-white/60 mt-2 max-w-2xl">
              Manage all homepage content including section titles, descriptions, and testimonials.
            </p>
          </div>
          {hasChanges && (
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 bg-neutral-800 text-white font-bold px-6 py-3 rounded-xl hover:bg-neutral-700 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Discard
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-[#E8B904] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#CFA203] transition-colors disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-8">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Hero Section */}
          <div className="bg-neutral-900 border border-[#E8B904]/20 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Hero Section</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Hero Title</label>
                <input
                  type="text"
                  value={content.hero_title?.value || ''}
                  onChange={(e) => updateContent('hero_title', e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Hero Subtitle</label>
                <textarea
                  value={content.hero_subtitle?.value || ''}
                  onChange={(e) => updateContent('hero_subtitle', e.target.value)}
                  rows={3}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Best Sellers Section */}
          <div className="bg-neutral-900 border border-[#E8B904]/20 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Best Sellers Section</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Title</label>
                <input
                  type="text"
                  value={content.best_sellers_title?.value || ''}
                  onChange={(e) => updateContent('best_sellers_title', e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Description</label>
                <textarea
                  value={content.best_sellers_description?.value || ''}
                  onChange={(e) => updateContent('best_sellers_description', e.target.value)}
                  rows={4}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Popular Delights Section */}
          <div className="bg-neutral-900 border border-[#E8B904]/20 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Popular Delights Section</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Title</label>
                <input
                  type="text"
                  value={content.popular_delights_title?.value || ''}
                  onChange={(e) => updateContent('popular_delights_title', e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Description</label>
                <textarea
                  value={content.popular_delights_description?.value || ''}
                  onChange={(e) => updateContent('popular_delights_description', e.target.value)}
                  rows={4}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="bg-neutral-900 border border-[#E8B904]/20 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Testimonials Section</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Title</label>
                <input
                  type="text"
                  value={content.testimonials_title?.value || ''}
                  onChange={(e) => updateContent('testimonials_title', e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Published Testimonials</label>
                <div className="bg-black/40 border border-white/10 rounded-xl p-4 max-h-48 overflow-y-auto">
                  {testimonials.filter((t) => t.status === 'published').length > 0 ? (
                    <div className="space-y-3">
                      {testimonials
                        .filter((t) => t.status === 'published')
                        .map((t) => (
                          <div key={t.id} className="border-l-2 border-[#E8B904] pl-3">
                            <p className="text-white font-semibold text-sm">{t.name}</p>
                            <p className="text-white/50 text-xs">{t.company || 'No company'}</p>
                            <p className="text-white/60 text-xs line-clamp-2 mt-1">"{t.quote}"</p>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-white/50 text-sm">No published testimonials. Create one in the Testimonials section.</p>
                  )}
                </div>
              </div>
              <a
                href="/admin/testimonials"
                className="block w-full text-center bg-[#E8B904]/10 text-[#E8B904] font-bold px-4 py-2 rounded-xl hover:bg-[#E8B904]/20 transition-colors"
              >
                Manage Testimonials
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
