'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { orderAPI } from '@/lib/api';
import { ShoppingBag, Eye, Trash2, X, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';

interface Order {
  id: number;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'unpaid' | 'paid' | 'refunded';
  payment_method: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  order_items: any;
  created_at: string;
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchOrders(token);
  }, [router]);

  const fetchOrders = async (token: string) => {
    try {
      const data = await orderAPI.getAll(token);
      setOrders(data.orders);
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

  const handleStatusUpdate = async (id: number, status: string) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      await orderAPI.updateStatus(id, status, token);
      fetchOrders(token);
      setSelectedOrder(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handlePaymentStatusUpdate = async (id: number, paymentStatus: string) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      await orderAPI.updatePaymentStatus(id, paymentStatus, token);
      fetchOrders(token);
      setSelectedOrder(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'processing': return 'bg-blue-500/20 text-blue-400';
      case 'shipped': return 'bg-purple-500/20 text-purple-400';
      case 'delivered': return 'bg-green-500/20 text-green-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/20 text-green-400';
      case 'unpaid': return 'bg-yellow-500/20 text-yellow-400';
      case 'refunded': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
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
        <h2 className="text-4xl font-black text-white uppercase tracking-tight mb-12">Orders</h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-8">
            {error}
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-neutral-900 border border-[#E8B904]/20 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8B904]/20">
                  <th className="text-left px-6 py-4 text-[#E8B904] font-bold text-sm uppercase tracking-wider">Order ID</th>
                  <th className="text-left px-6 py-4 text-[#E8B904] font-bold text-sm uppercase tracking-wider">Customer</th>
                  <th className="text-left px-6 py-4 text-[#E8B904] font-bold text-sm uppercase tracking-wider">Total</th>
                  <th className="text-left px-6 py-4 text-[#E8B904] font-bold text-sm uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-[#E8B904] font-bold text-sm uppercase tracking-wider">Payment</th>
                  <th className="text-left px-6 py-4 text-[#E8B904] font-bold text-sm uppercase tracking-wider">Date</th>
                  <th className="text-right px-6 py-4 text-[#E8B904] font-bold text-sm uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white font-bold">#{order.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-bold">{order.first_name} {order.last_name}</p>
                        <p className="text-white/40 text-sm">{order.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#E8B904] font-bold">${Number(order.total_amount).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase w-fit ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getPaymentStatusColor(order.payment_status)}`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/50 text-sm">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-white/50 hover:text-[#E8B904] transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && (
            <div className="p-12 text-center">
              <ShoppingBag className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/50">No orders found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-[#E8B904]/20 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[#E8B904]/20">
              <h3 className="text-xl font-bold text-white">Order #{selectedOrder.id}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-white/50 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h4 className="text-[#E8B904] font-bold text-sm uppercase tracking-wider mb-3">Customer Info</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-white/70"><span className="text-white">Name:</span> {selectedOrder.first_name} {selectedOrder.last_name}</p>
                  <p className="text-white/70"><span className="text-white">Email:</span> {selectedOrder.email}</p>
                  <p className="text-white/70"><span className="text-white">Phone:</span> {selectedOrder.phone}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-[#E8B904] font-bold text-sm uppercase tracking-wider mb-3">Order Items</h4>
                <div className="space-y-2">
                  {selectedOrder.order_items && JSON.parse(selectedOrder.order_items).map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-white/70">{item.quantity}x {item.name}</span>
                      <span className="text-white">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Total */}
              <div className="flex justify-between text-lg font-bold border-t border-white/10 pt-4">
                <span className="text-white">Total</span>
                <span className="text-[#E8B904]">${Number(selectedOrder.total_amount).toFixed(2)}</span>
              </div>

              {/* Update Status */}
              <div>
                <h4 className="text-[#E8B904] font-bold text-sm uppercase tracking-wider mb-3">Update Status</h4>
                <div className="flex flex-wrap gap-2">
                  {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(selectedOrder.id, status)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold uppercase transition-colors ${
                        selectedOrder.status === status
                          ? 'bg-[#E8B904] text-black'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Update Payment Status */}
              <div>
                <h4 className="text-[#E8B904] font-bold text-sm uppercase tracking-wider mb-3">Payment Status</h4>
                <div className="flex flex-wrap gap-2">
                  {['unpaid', 'paid', 'refunded'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handlePaymentStatusUpdate(selectedOrder.id, status)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold uppercase transition-colors ${
                        selectedOrder.payment_status === status
                          ? 'bg-[#E8B904] text-black'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
