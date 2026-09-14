'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { testimonialAPI } from '@/lib/api';
import { Plus, Edit, Trash2, MessageCircle, X } from 'lucide-react';
import { toast } from '@/components/Toast';

interface Testimonial {
  id: number;
  name: string;
  company: string | null;
  quote: string;
  avatar_url: string | null;
  sort_order: number;
  status: 'draft' | 'published';
}

export default function AdminTestimonialsPage() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    quote: '',
    avatarUrl: '',
    sortOrder: '0',
    status: 'published'
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchTestimonials(token);
  }, [router]);

  const fetchTestimonials = async (token: string) => {
    setIsLoading(true);
    try {
      const data = await testimonialAPI.getAdminList(token);
      setTestimonials(data.testimonials || []);
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

  const openCreateModal = () => {
    setEditingTestimonial(null);
    setFormData({ name: '', company: '', quote: '', avatarUrl: '', sortOrder: '0', status: 'published' });
    setShowModal(true);
  };

  const openEditModal = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      company: testimonial.company || '',
      quote: testimonial.quote,
      avatarUrl: testimonial.avatar_url || '',
      sortOrder: testimonial.sort_order.toString(),
      status: testimonial.status
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const payload = {
        name: formData.name,
        company: formData.company || undefined,
        quote: formData.quote,
        avatarUrl: formData.avatarUrl || undefined,
        sortOrder: parseInt(formData.sortOrder, 10) || 0,
        status: formData.status as 'draft' | 'published'
      };

      if (editingTestimonial) {
        await testimonialAPI.update(editingTestimonial.id, payload, token);
        toast.success('Testimonial updated successfully!');
      } else {
        await testimonialAPI.create(payload, token);
        toast.success('Testimonial created successfully!');
      }
      setShowModal(false);
      fetchTestimonials(token);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save testimonial');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this testimonial?')) return;
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      await testimonialAPI.delete(id, token);
      toast.success('Testimonial deleted successfully!');
      fetchTestimonials(token);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete testimonial');
    }
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
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tight">Testimonials</h2>
            <p className="text-white/50 mt-2">Manage home page testimonials without changing the current layout.</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-[#E8B904] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#CFA203] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Testimonial
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-8">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-neutral-900 border border-[#E8B904]/20 rounded-3xl p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{testimonial.name}</h3>
                  <p className="text-[#E8B904]/70 text-sm">{testimonial.company || 'No company provided'}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(testimonial)} className="p-2 text-white/50 hover:text-[#E8B904] transition-colors">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(testimonial.id)} className="p-2 text-white/50 hover:text-red-400 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-white/60 leading-relaxed mb-4">{testimonial.quote}</p>
              <div className="flex items-center justify-between text-xs text-white/50">
                <span>Status: {testimonial.status}</span>
                <span>Order: {testimonial.sort_order}</span>
              </div>
            </div>
          ))}
        </div>

        {testimonials.length === 0 && (
          <div className="text-center py-20 bg-neutral-900 border border-[#E8B904]/20 rounded-3xl">
            <MessageCircle className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50">No testimonials yet. Create one to update the homepage section.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-[#E8B904]/20 rounded-3xl w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-[#E8B904]/20">
              <h3 className="text-xl font-bold text-white">
                {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-white/50 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Quote</label>
                <textarea
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  rows={4}
                  required
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none resize-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Avatar URL</label>
                  <input
                    type="text"
                    value={formData.avatarUrl}
                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                    className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Sort Order</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                    className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#E8B904] text-black font-bold py-3 rounded-xl hover:bg-[#CFA203] transition-colors"
                >
                  {editingTestimonial ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
