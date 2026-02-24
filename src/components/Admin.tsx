import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, X, Layout, FileText, ShoppingBag, Package, Database, LogOut } from 'lucide-react';
import { Product, Category, SiteContent, Order } from '../types';
import { api } from '../services/api';
import { motion } from 'framer-motion';

interface AdminProps {
  products: Product[];
  categories: Category[];
  siteContent: SiteContent;
  onLogout: () => void;
  refreshData: () => void;
  token: string;
}

export default function Admin({ products, categories, siteContent, onLogout, refreshData, token }: AdminProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders' | 'content'>('products');
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [contentForm, setContentForm] = useState(siteContent);

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    const data = await api.getOrders(token);
    setOrders(data);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const productData = {
      name: formData.get('name') as string,
      price: parseFloat(formData.get('price') as string),
      description: formData.get('description') as string,
      image: formData.get('image') as string,
      category: formData.get('category') as string,
      unit: formData.get('unit') as string,
    } as Product;

    if (editingProduct) {
      await api.updateProduct({ ...productData, id: editingProduct.id }, token);
    } else {
      await api.saveProduct(productData, token);
    }
    
    setEditingProduct(null);
    setIsAddingProduct(false);
    refreshData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Delete this product?')) {
      await api.deleteProduct(id, token);
      refreshData();
    }
  };

  const handleAddCategory = async () => {
    if (newCategory) {
      await api.saveCategory({ id: '', name: newCategory }, token);
      setNewCategory('');
      refreshData();
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Delete this category?')) {
      await api.deleteCategory(id, token);
      refreshData();
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    await api.updateOrderStatus(id, status, token);
    fetchOrders();
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <div className="bg-[#2F5233] text-white p-6 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg"><Layout size={24} /></div>
          <h1 className="text-2xl font-serif font-bold">Admin Dashboard</h1>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20 transition-all">
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex gap-4 mb-12 overflow-x-auto pb-2 no-scrollbar">
          {[
            { id: 'products', label: 'Products', icon: Package },
            { id: 'categories', label: 'Categories', icon: Database },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
            { id: 'content', label: 'Site Content', icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
                activeTab === tab.id ? 'bg-[#2F5233] text-white shadow-lg' : 'bg-white text-[#5C4033] hover:bg-white/80'
              }`}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-sm p-8 border border-[#2F5233]/5">
          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-serif font-bold text-[#2F5233]">Manage Products</h2>
                <button onClick={() => setIsAddingProduct(true)} className="bg-[#2F5233] text-white px-6 py-2 rounded-xl flex items-center gap-2 font-bold hover:bg-[#5C4033] transition-all">
                  <Plus size={18} /> Add Product
                </button>
              </div>

              {(isAddingProduct || editingProduct) && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <form onSubmit={handleSaveProduct} className="bg-white p-8 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto no-scrollbar">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-serif font-bold text-[#2F5233]">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                      <button type="button" onClick={() => { setEditingProduct(null); setIsAddingProduct(false); }}><X /></button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <label className="block text-sm font-bold">Product Name</label>
                        <input name="name" defaultValue={editingProduct?.name} required className="w-full p-3 rounded-xl border border-[#F5F5F0] bg-[#F5F5F0]/50" />
                        <label className="block text-sm font-bold">Price ($)</label>
                        <input name="price" type="number" step="0.01" defaultValue={editingProduct?.price} required className="w-full p-3 rounded-xl border border-[#F5F5F0] bg-[#F5F5F0]/50" />
                        <label className="block text-sm font-bold">Unit (e.g. kg, piece)</label>
                        <input name="unit" defaultValue={editingProduct?.unit} required className="w-full p-3 rounded-xl border border-[#F5F5F0] bg-[#F5F5F0]/50" />
                      </div>
                      <div className="space-y-4">
                        <label className="block text-sm font-bold">Category</label>
                        <select name="category" defaultValue={editingProduct?.category} className="w-full p-3 rounded-xl border border-[#F5F5F0] bg-[#F5F5F0]/50">
                          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                        <label className="block text-sm font-bold">Image URL</label>
                        <input name="image" defaultValue={editingProduct?.image} required className="w-full p-3 rounded-xl border border-[#F5F5F0] bg-[#F5F5F0]/50" />
                        <label className="block text-sm font-bold">Description</label>
                        <textarea name="description" defaultValue={editingProduct?.description} rows={3} className="w-full p-3 rounded-xl border border-[#F5F5F0] bg-[#F5F5F0]/50 resize-none" />
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-[#2F5233] text-white py-4 rounded-xl font-bold mt-8 hover:bg-[#5C4033] transition-all">
                      {editingProduct ? 'Update Product' : 'Save Product'}
                    </button>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map(p => (
                  <div key={p.id} className="flex items-center gap-4 p-4 border border-[#F5F5F0] rounded-2xl hover:bg-[#F5F5F0]/30 transition-all">
                    <img src={p.image} className="w-20 h-20 object-cover rounded-xl" />
                    <div className="flex-grow">
                      <h4 className="font-bold text-[#2F5233]">{p.name}</h4>
                      <p className="text-sm text-[#5C4033]/60">${p.price.toFixed(2)} / {p.unit}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingProduct(p)} className="p-2 text-[#2F5233] hover:bg-[#2F5233]/10 rounded-lg"><Edit size={18} /></button>
                      <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="max-w-xl">
              <h2 className="text-2xl font-serif font-bold text-[#2F5233] mb-8">Manage Categories</h2>
              <div className="flex gap-4 mb-8">
                <input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="New category name" className="flex-grow p-3 rounded-xl border border-[#F5F5F0] bg-[#F5F5F0]/50" />
                <button onClick={handleAddCategory} className="bg-[#2F5233] text-white px-6 rounded-xl font-bold hover:bg-[#5C4033] transition-all">Add</button>
              </div>
              <div className="space-y-3">
                {categories.map(c => (
                  <div key={c.id} className="flex justify-between items-center p-4 bg-[#F5F5F0]/30 rounded-xl">
                    <span className="font-bold text-[#2F5233]">{c.name}</span>
                    <button onClick={() => handleDeleteCategory(c.id)} className="text-rose-500 hover:text-rose-700"><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#2F5233] mb-8">Recent Orders</h2>
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[#5C4033]/40 text-xs uppercase tracking-widest border-b border-[#F5F5F0]">
                      <th className="pb-4 font-bold">Customer</th>
                      <th className="pb-4 font-bold">Items</th>
                      <th className="pb-4 font-bold">Total</th>
                      <th className="pb-4 font-bold">Status</th>
                      <th className="pb-4 font-bold">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5F5F0]">
                    {orders.map(o => (
                      <tr key={o.id} className="text-sm">
                        <td className="py-6">
                          <div className="font-bold text-[#2F5233]">{o.customerName}</div>
                          <div className="text-xs text-[#5C4033]/60">{o.customerEmail}</div>
                        </td>
                        <td className="py-6">
                          <div className="text-xs">{o.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</div>
                        </td>
                        <td className="py-6 font-bold text-[#2F5233]">${o.total.toFixed(2)}</td>
                        <td className="py-6">
                          <select 
                            value={o.status} 
                            onChange={e => handleUpdateOrderStatus(o.id, e.target.value)}
                            className={`p-2 rounded-lg text-xs font-bold ${
                              o.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 
                              o.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </td>
                        <td className="py-6 text-xs text-[#5C4033]/60">{new Date(o.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="max-w-3xl space-y-8">
              <h2 className="text-2xl font-serif font-bold text-[#2F5233]">Site Content</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold">About Title</label>
                  <input value={contentForm.about.title} onChange={e => setContentForm({...contentForm, about: {...contentForm.about, title: e.target.value}})} className="w-full p-3 rounded-xl border border-[#F5F5F0] bg-[#F5F5F0]/50" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold">About Content</label>
                  <textarea value={contentForm.about.content} rows={5} onChange={e => setContentForm({...contentForm, about: {...contentForm.about, content: e.target.value}})} className="w-full p-3 rounded-xl border border-[#F5F5F0] bg-[#F5F5F0]/50 resize-none" />
                </div>
                <button onClick={() => api.saveContent(contentForm, token).then(() => refreshData())} className="bg-[#2F5233] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#5C4033] transition-all flex items-center gap-2">
                  <Save size={18} /> Save Changes
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
