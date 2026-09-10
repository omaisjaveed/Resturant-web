'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { Upload, Trash2, X, Image as ImageIcon, Copy } from 'lucide-react';

interface MediaFile {
  filename: string;
  url: string;
  mimetype: string;
  size: number;
  created_at: string;
}

export default function AdminMediaPage() {
  const router = useRouter();
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  
  // Helper to get full image URL
  const getFullImageUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    // Remove /api from API_URL if present, then append the url
    const baseUrl = API_URL.replace('/api', '');
    return `${baseUrl}${url}`;
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchFiles(token);
  }, [router]);

  const fetchFiles = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/media`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setFiles(data.files || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const token = localStorage.getItem('adminToken');
    if (!token || !e.target.files?.length) return;

    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/media/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        fetchFiles(token);
      } else {
        const data = await response.json();
        setError(data.error || 'Upload failed');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
      setUploadProgress(100);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/media/${filename}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchFiles(token);
      } else {
        const data = await response.json();
        setError(data.error || 'Delete failed');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
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
          <h2 className="text-4xl font-black text-white uppercase tracking-tight">Media Library</h2>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className={`flex items-center gap-2 bg-[#E8B904] text-black font-bold px-6 py-3 rounded-xl cursor-pointer hover:bg-[#CFA203] transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Upload className="w-5 h-5" />
              {isUploading ? 'Uploading...' : 'Upload Image'}
            </label>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-8">
            {error}
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="mb-8">
            <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#E8B904] transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Files Grid */}
        {files.length === 0 ? (
          <div className="text-center py-20 bg-neutral-900 border border-[#E8B904]/20 rounded-3xl">
            <ImageIcon className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 mb-4">No images uploaded yet.</p>
            <label
              htmlFor="file-upload"
              className="inline-flex items-center gap-2 bg-[#E8B904] text-black font-bold px-6 py-3 rounded-xl cursor-pointer hover:bg-[#CFA203] transition-colors"
            >
              <Upload className="w-5 h-5" />
              Upload Your First Image
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {files.map((file) => (
              <div key={file.filename} className="bg-neutral-900 border border-[#E8B904]/20 rounded-3xl overflow-hidden group">
                <div className="relative aspect-square bg-neutral-800">
                  <img
                    src={getFullImageUrl(file.url)}
                    alt={file.filename}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23333" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%23666" font-size="12">Error</text></svg>';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => copyToClipboard(getFullImageUrl(file.url))}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                      title="Copy Full URL"
                    >
                      <Copy className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={() => handleDelete(file.filename)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-full transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5 text-red-400" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-white font-medium text-sm truncate">{file.filename}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-white/40 text-xs">{formatFileSize(file.size)}</span>
                    <button
                      onClick={() => copyToClipboard(getFullImageUrl(file.url))}
                      className="text-[#E8B904] text-xs hover:underline"
                    >
                      Copy URL
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
