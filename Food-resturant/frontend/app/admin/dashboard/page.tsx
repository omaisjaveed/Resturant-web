'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { dashboardAPI } from '@/lib/api';
import { ShoppingBag, Package, Layers, Users, DollarSign, Clock } from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const data = await dashboardAPI.getStats(token);
        setStats(data.stats);
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

    fetchStats();
  }, [router]);

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
        <h2 className="text-4xl font-black text-white uppercase tracking-tight mb-12">Dashboard</h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-8">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-neutral-900 border border-[#E8B904]/20 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#E8B904]/10 rounded-xl">
                <Package className="w-6 h-6 text-[#E8B904]" />
              </div>
            </div>
            <p className="text-white/50 text-sm uppercase tracking-wider mb-1">Total Products</p>
            <p className="text-4xl font-black text-white">{stats?.products?.total || 0}</p>
          </div>

          <div className="bg-neutral-900 border border-[#E8B904]/20 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#A31616]/10 rounded-xl">
                <Layers className="w-6 h-6 text-[#A31616]" />
              </div>
            </div>
            <p className="text-white/50 text-sm uppercase tracking-wider mb-1">Categories</p>
            <p className="text-4xl font-black text-white">{stats?.categories?.total || 0}</p>
          </div>

          <div className="bg-neutral-900 border border-[#E8B904]/20 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#E8B904]/10 rounded-xl">
                <DollarSign className="w-6 h-6 text-[#E8B904]" />
              </div>
            </div>
            <p className="text-white/50 text-sm uppercase tracking-wider mb-1">Total Revenue</p>
            <p className="text-4xl font-black text-white">${Number(stats?.orders?.totalRevenue || 0).toFixed(2)}</p>
          </div>

          <div className="bg-neutral-900 border border-[#E8B904]/20 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#A31616]/10 rounded-xl">
                <Users className="w-6 h-6 text-[#A31616]" />
              </div>
            </div>
            <p className="text-white/50 text-sm uppercase tracking-wider mb-1">Total Users</p>
            <p className="text-4xl font-black text-white">{stats?.users?.total || 0}</p>
          </div>
        </div>

        {/* Order Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-neutral-900 border border-[#E8B904]/20 rounded-3xl p-8">
            <div className="flex items-center gap-4 mb-4">
              <Clock className="w-6 h-6 text-[#E8B904]" />
              <p className="text-white/50 text-sm uppercase tracking-wider">Pending Orders</p>
            </div>
            <p className="text-4xl font-black text-white">{stats?.orders?.pendingOrders || 0}</p>
          </div>

          <div className="bg-neutral-900 border border-[#E8B904]/20 rounded-3xl p-8">
            <div className="flex items-center gap-4 mb-4">
              <ShoppingBag className="w-6 h-6 text-[#E8B904]" />
              <p className="text-white/50 text-sm uppercase tracking-wider">Total Orders</p>
            </div>
            <p className="text-4xl font-black text-white">{stats?.orders?.totalOrders || 0}</p>
          </div>

          <div className="bg-neutral-900 border border-[#E8B904]/20 rounded-3xl p-8">
            <div className="flex items-center gap-4 mb-4">
              <Package className="w-6 h-6 text-[#E8B904]" />
              <p className="text-white/50 text-sm uppercase tracking-wider">Out of Stock</p>
            </div>
            <p className="text-4xl font-black text-white">{stats?.products?.outOfStock || 0}</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/products"
            className="bg-neutral-900 border border-[#E8B904]/20 rounded-3xl p-8 hover:border-[#E8B904]/50 transition-colors group"
          >
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#E8B904] transition-colors">Manage Products</h3>
            <p className="text-white/50 text-sm">View, edit, and manage your product catalog</p>
          </Link>

          <Link
            href="/admin/categories"
            className="bg-neutral-900 border border-[#E8B904]/20 rounded-3xl p-8 hover:border-[#E8B904]/50 transition-colors group"
          >
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#E8B904] transition-colors">Manage Categories</h3>
            <p className="text-white/50 text-sm">Organize your product categories</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
