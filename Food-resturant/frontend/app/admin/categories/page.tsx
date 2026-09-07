'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { categoryAPI } from '@/lib/api';
import { toast } from '@/components/Toast';
import { Plus, Edit, Trash2, Layers, X, ChevronRight, FolderTree } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  parent_id: number | null;
  children?: Category[];
}

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [categoryTree, setCategoryTree] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [viewMode, setViewMode] = useState<'flat' | 'tree'>('tree');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parentId: '' as string
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchCategories();
  }, [router]);

  const fetchCategories = async () => {
    try {
      const [data, treeData] = await Promise.all([
        categoryAPI.getAll(),
        categoryAPI.getTree()
      ]);
      setCategories(data.categories);
      setParentCategories(data.categories.filter((c: Category) => !c.parent_id));
      setCategoryTree(treeData.categories);
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
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      parentId: ''
    });
    setShowModal(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      parentId: category.parent_id ? category.parent_id.toString() : ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const data: any = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || undefined,
        parentId: formData.parentId ? parseInt(formData.parentId) : null
      };

      if (editingCategory) {
        await categoryAPI.update(editingCategory.id, data, token);
        toast.success('Category updated successfully!');
      } else {
        await categoryAPI.create(data, token);
        toast.success('Category created successfully!');
      }

      setShowModal(false);
      fetchCategories();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save category');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category? This will also remove all subcategories under it.')) return;

    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      await categoryAPI.delete(id, token);
      toast.success('Category deleted successfully!');
      fetchCategories();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete category');
    }
  };

  const getParentName = (parentId: number | null) => {
    if (!parentId) return null;
    const parent = categories.find(c => c.id === parentId);
    return parent ? parent.name : null;
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
          <div className="flex items-center gap-4">
            <h2 className="text-4xl font-black text-white uppercase tracking-tight">Categories</h2>
            <div className="flex gap-2 bg-neutral-900 rounded-xl p-1 border border-[#E8B904]/20">
              <button
                onClick={() => setViewMode('tree')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${viewMode === 'tree' ? 'bg-[#E8B904] text-black' : 'text-white/50 hover:text-white'}`}
              >
                <FolderTree className="w-4 h-4 inline mr-2" />
                Hierarchy
              </button>
              <button
                onClick={() => setViewMode('flat')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${viewMode === 'flat' ? 'bg-[#E8B904] text-black' : 'text-white/50 hover:text-white'}`}
              >
                <Layers className="w-4 h-4 inline mr-2" />
                All
              </button>
            </div>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-[#E8B904] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#CFA203] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Category
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-8">
            {error}
          </div>
        )}

        {/* Tree View */}
        {viewMode === 'tree' && (
          <div className="space-y-4">
            {categoryTree.map((parent) => (
              <div key={parent.id} className="space-y-3">
                {/* Parent Category */}
                <div className="bg-neutral-900 border border-[#E8B904]/30 rounded-3xl p-6 hover:border-[#E8B904]/60 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[#E8B904]/10 rounded-xl">
                        <FolderTree className="w-6 h-6 text-[#E8B904]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{parent.name}</h3>
                        <p className="text-white/40 text-sm">{parent.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(parent)}
                        className="p-2 text-white/50 hover:text-[#E8B904] transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(parent.id)}
                        className="p-2 text-white/50 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  {parent.description && (
                    <p className="text-white/40 text-sm ml-16">{parent.description}</p>
                  )}
                  {parent.children && parent.children.length > 0 && (
                    <div className="mt-2 ml-16 text-[#E8B904] text-xs font-bold uppercase tracking-wider">
                      {parent.children.length} subcategor{parent.children.length === 1 ? 'y' : 'ies'}
                    </div>
                  )}
                </div>

                {/* Child Categories */}
                {parent.children && parent.children.length > 0 && (
                  <div className="ml-8 pl-8 border-l-2 border-[#E8B904]/20 space-y-3">
                    {parent.children.map((child) => (
                      <div
                        key={child.id}
                        className="bg-neutral-900/60 border border-[#E8B904]/20 rounded-2xl p-5 hover:border-[#E8B904]/40 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <ChevronRight className="w-4 h-4 text-[#E8B904]/50" />
                            <div className="p-2.5 bg-[#E8B904]/5 rounded-lg">
                              <Layers className="w-4 h-4 text-[#E8B904]/70" />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-white">{child.name}</h4>
                              <p className="text-white/40 text-xs">{child.slug}</p>
                              <p className="text-white/30 text-xs mt-0.5">
                                Parent: <span className="text-[#E8B904]/70">{parent.name}</span>
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditModal(child)}
                              className="p-2 text-white/50 hover:text-[#E8B904] transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(child.id)}
                              className="p-2 text-white/50 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {child.description && (
                          <p className="text-white/40 text-sm mt-2 ml-12">{child.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {categoryTree.length === 0 && (
              <div className="text-center py-20 bg-neutral-900 border border-[#E8B904]/20 rounded-3xl">
                <FolderTree className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/50">No categories found. Add your first category!</p>
              </div>
            )}
          </div>
        )}

        {/* Flat View */}
        {viewMode === 'flat' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const parentName = getParentName(category.parent_id);
              return (
                <div
                  key={category.id}
                  className={`bg-neutral-900 border rounded-3xl p-8 hover:border-[#E8B904]/50 transition-colors ${category.parent_id ? 'border-[#E8B904]/10' : 'border-[#E8B904]/20'}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${category.parent_id ? 'bg-[#E8B904]/5' : 'bg-[#E8B904]/10'}`}>
                      {category.parent_id ? (
                        <Layers className="w-6 h-6 text-[#E8B904]/60" />
                      ) : (
                        <FolderTree className="w-6 h-6 text-[#E8B904]" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(category)}
                        className="p-2 text-white/50 hover:text-[#E8B904] transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-2 text-white/50 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                  <p className="text-white/50 text-sm mb-2">{category.slug}</p>
                  {parentName && (
                    <p className="text-[#E8B904]/70 text-xs font-medium mb-2">
                      Subcategory of: <span className="text-white/50">{parentName}</span>
                    </p>
                  )}
                  {category.description && (
                    <p className="text-white/40 text-sm">{category.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {categories.length === 0 && viewMode === 'flat' && (
          <div className="text-center py-20 bg-neutral-900 border border-[#E8B904]/20 rounded-3xl">
            <Layers className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50">No categories found. Add your first category!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-[#E8B904]/20 rounded-3xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-[#E8B904]/20">
              <h3 className="text-xl font-bold text-white">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
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
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Parent Category
                  <span className="text-white/30 font-normal ml-1">(optional - leave empty for main category)</span>
                </label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#E8B904] outline-none appearance-none cursor-pointer"
                >
                  <option value="">-- No Parent (Main Category) --</option>
                  {parentCategories
                    .filter(c => !editingCategory || c.id !== editingCategory.id)
                    .map((parent) => (
                      <option key={parent.id} value={parent.id}>
                        {parent.name}
                      </option>
                    ))}
                </select>
                <p className="text-white/30 text-xs mt-1">
                  Only main categories (without parent) are shown here to avoid deep nesting.
                </p>
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
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
