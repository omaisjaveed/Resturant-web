'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { productAPI, categoryAPI } from '@/lib/api';
import { toast } from '@/components/Toast';
import { Plus, Edit, Trash2, Package, X, Image } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  category_name: string | null;
  category_id: number | null;
  featured: boolean;
  status: 'draft' | 'published';
  stock_quantity: number;
  image_url?: string; // Image URL from product_images table
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface MediaFile {
  filename: string;
  url: string;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>('');
  const [editingImageId, setEditingImageId] = useState<number | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  
  // Helper to get full image URL
  const getFullImageUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    const baseUrl = API_URL.replace('/api', '');
    return `${baseUrl}${url}`;
  };

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    categoryId: '',
    featured: false,
    status: 'published' as 'draft' | 'published',
    stockQuantity: '100',
    imageUrl: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchData(token);
  }, [router]);

  const fetchData = async (token: string) => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        productAPI.getAll(),
        categoryAPI.getAll()
      ]);
      setProducts(productsData.products);
      setCategories(categoriesData.categories);
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

  const openCreateModal = () => {
    setEditingProduct(null);
    setOriginalImageUrl('');
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: '',
      categoryId: '',
      featured: false,
      status: 'published',
      stockQuantity: '100',
      imageUrl: ''
    });
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    // Use existing image_url if available, otherwise empty
    const existingImageUrl = product.image_url || '';
    setOriginalImageUrl(existingImageUrl);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: product.price.toString(),
      categoryId: product.category_id?.toString() || '',
      featured: product.featured,
      status: product.status,
      stockQuantity: product.stock_quantity.toString(),
      imageUrl: existingImageUrl
    });
    setShowModal(true);
  };

  const openMediaLibrary = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    setIsLoadingMedia(true);
    setShowMediaModal(true);

    try {
      const response = await fetch(`${API_URL}/media`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      // Transform URLs to full URLs for display
      const filesWithFullUrls = (data.files || []).map((file: any) => ({
        ...file,
        displayUrl: getFullImageUrl(file.url)
      }));
      setMediaFiles(filesWithFullUrls);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoadingMedia(false);
    }
  };

  const selectImage = (url: string) => {
    // Store the relative URL (like /uploads/filename.png) for database storage
    // The URL already comes as /uploads/filename.png from the API
    setFormData({ ...formData, imageUrl: url });
    setShowMediaModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const data = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || undefined,
        price: parseFloat(formData.price),
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : undefined,
        featured: formData.featured,
        status: formData.status,
        stockQuantity: parseInt(formData.stockQuantity)
      };

      if (editingProduct) {
        await productAPI.update(editingProduct.id, data, token);
        
        // Only add image if the image URL has changed from the original
        if (formData.imageUrl && formData.imageUrl !== originalImageUrl) {
          await productAPI.addImage(editingProduct.id, formData.imageUrl, true, token);
        }
        toast.success('Product updated successfully!');
      } else {
        const newProduct = await productAPI.create(data, token);
        
        // Add image if selected for new products
        if (formData.imageUrl && newProduct.product?.id) {
          await productAPI.addImage(newProduct.product.id, formData.imageUrl, true, token);
        }
        toast.success('Product created successfully!');
      }

      setShowModal(false);
      fetchData(token);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      await productAPI.delete(id, token);
      toast.success('Product deleted successfully!');
      fetchData(token);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete product');
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
          <h2 className="text-4xl font-black text-white uppercase tracking-tight">Products</h2>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-[#E8B904] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#CFA203] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-8">
            {error}
          </div>
        )}

        {/* Products Table */}
        <div className="bg-neutral-900 border border-[#E8B904]/20 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8B904]/20">
                  <th className="text-left px-6 py-4 text-[#E8B904] font-bold text-sm uppercase tracking-wider">Product</th>
                  <th className="text-left px-6 py-4 text-[#E8B904] font-bold text-sm uppercase tracking-wider">Category</th>
                  <th className="text-left px-6 py-4 text-[#E8B904] font-bold text-sm uppercase tracking-wider">Price</th>
                  <th className="text-left px-6 py-4 text-[#E8B904] font-bold text-sm uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-[#E8B904] font-bold text-sm uppercase tracking-wider">Stock</th>
                  <th className="text-right px-6 py-4 text-[#E8B904] font-bold text-sm uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center overflow-hidden">
                          {product.image_url ? (
                            <img src={getFullImageUrl(product.image_url)} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-6 h-6 text-white/30" />
                          )}
                        </div>
                        <p className="text-white font-bold">{product.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/70">{product.category_name || 'Uncategorized'}</td>
                    <td className="px-6 py-4 text-[#E8B904] font-bold">${Number(product.price).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        product.status === 'published' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/70">{product.stock_quantity}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 text-white/50 hover:text-[#E8B904] transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-white/50 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {products.length === 0 && (
            <div className="p-12 text-center">
              <Package className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/50">No products found. Add your first product!</p>
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-[#E8B904]/20 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[#E8B904]/20">
              <h3 className="text-xl font-bold text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-white/50 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Image Selection */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Product Image</label>
                <div className="flex gap-4">
                  {formData.imageUrl ? (
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-[#E8B904]/20">
                      <img src={getFullImageUrl(formData.imageUrl)} alt="Selected" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: '' })}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : null}
                  <button
                    type="button"
                    onClick={openMediaLibrary}
                    className="w-32 h-32 rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-white/50 hover:border-[#E8B904] hover:text-[#E8B904] transition-colors"
                  >
                    <Image className="w-8 h-8 mb-2" />
                    <span className="text-xs">Select Image</span>
                  </button>
                </div>
              </div>

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
                <label className="block text-sm font-medium text-white/70 mb-2">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    required
                    className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Category</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5 rounded border-white/20 bg-black text-[#E8B904] focus:ring-[#E8B904]"
                  />
                  <span className="text-white">Featured Product</span>
                </label>

                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                  className="bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none"
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
                  {editingProduct ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Library Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-[#E8B904]/20 rounded-3xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-[#E8B904]/20">
              <h3 className="text-xl font-bold text-white">Media Library</h3>
              <button onClick={() => setShowMediaModal(false)} className="text-white/50 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {isLoadingMedia ? (
                <div className="text-center py-12">
                  <div className="text-[#E8B904] text-xl">Loading...</div>
                </div>
              ) : mediaFiles.length === 0 ? (
                <div className="text-center py-12">
                  <Image className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/50">No images in media library.</p>
                  <p className="text-white/30 text-sm mt-2">Upload images from the Media Library page first.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {mediaFiles.map((file) => (
                    <button
                      key={file.filename}
                      onClick={() => selectImage(file.url)}
                      className="aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-[#E8B904] transition-colors"
                    >
                      <img src={getFullImageUrl(file.url)} alt={file.filename} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
