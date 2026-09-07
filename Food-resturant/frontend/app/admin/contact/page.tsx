'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { contactAPI } from '@/lib/api';
import { Mail, Phone, User, MessageSquare, Trash2, Calendar } from 'lucide-react';

export default function AdminContactPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchSubmissions(token);
  }, [router]);

  const fetchSubmissions = async (token: string) => {
    try {
      const data = await contactAPI.getAll(token);
      setSubmissions(data.submissions);
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

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      await contactAPI.delete(id, token);
      setSubmissions(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete submission');
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
          <h2 className="text-4xl font-black text-white uppercase tracking-tight">Contact Submissions</h2>
          <span className="text-white/50 text-sm bg-neutral-900 border border-[#E8B904]/20 px-4 py-2 rounded-xl">
            Total: {submissions.length}
          </span>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-8">
            {error}
          </div>
        )}

        {submissions.length === 0 ? (
          <div className="bg-neutral-900 border border-[#E8B904]/20 rounded-3xl p-12 text-center">
            <Mail className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-lg">No contact submissions yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-neutral-900 border border-[#E8B904]/20 rounded-3xl p-8 hover:border-[#E8B904]/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-4">
                    {/* Header with name and source */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-[#E8B904]" />
                        <span className="text-white font-bold text-lg">{submission.name}</span>
                      </div>
                      <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                        submission.source === 'home' 
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                          : 'bg-[#E8B904]/10 text-[#E8B904] border border-[#E8B904]/30'
                      }`}>
                        {submission.source === 'home' ? 'Home Page' : 'Contact Page'}
                      </span>
                    </div>

                    {/* Contact details */}
                    <div className="flex flex-wrap gap-4 text-sm">
                      {submission.email && (
                        <div className="flex items-center gap-2 text-white/60">
                          <Mail className="w-4 h-4" />
                          <span>{submission.email}</span>
                        </div>
                      )}
                      {submission.phone && (
                        <div className="flex items-center gap-2 text-white/60">
                          <Phone className="w-4 h-4" />
                          <span>{submission.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Message */}
                    {submission.message && (
                      <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                        <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-wider mb-2">
                          <MessageSquare className="w-3 h-3" />
                          <span>Message</span>
                        </div>
                        <p className="text-white/80 leading-relaxed">{submission.message}</p>
                      </div>
                    )}

                    {/* Date */}
                    <div className="flex items-center gap-2 text-white/30 text-xs">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(submission.created_at).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(submission.id)}
                    className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/20 transition-colors shrink-0"
                    title="Delete submission"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
