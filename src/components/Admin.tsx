import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, X, Sparkles, Layout, FileText, ShoppingBag, Package, Upload, Image as ImageIcon, Database } from 'lucide-react';
import { Product, Category, SiteContent, Order } from '../types';
import { api } from '../services/api';

interface AdminProps {
  products: Product[];
  categories: Category[];
  siteContent: SiteContent;
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onAddCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  onUpdateSiteContent: (content: SiteContent) => void;
}

const Admin: React.FC<AdminProps> = ({ 
  products, 
  categories, 
  siteContent,
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct,
  onAddCategory,
  onDeleteCategory,
  onUpdateSiteContent
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'pages' | 'orders'>('products');
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Product State
  const [isEditingProduct, setIsEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Category State
  const [newCategoryName, setNewCategoryName] = useState('');

  // Pages State
  const [contentForm, setContentForm] = useState<SiteContent>(siteContent);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    const token = localStorage.getItem('tabi3y_token');
    if (token) {
      const data = await api.getOrders(token);
      setOrders(data);
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    const token = localStorage.getItem('tabi3y_token');
    if (token) {
      await api.updateOrderStatus(id, status, token);
      fetchOrders();
    }
  };

  // --- Product Handlers ---
  const handleEditProduct = (product: Product) => {
    setIsEditingProduct(product.id);
    setProductForm(product);
  };

  const handleSaveProduct = () => {
    if (productForm.id) {
      onUpdateProduct(productForm as Product);
    } else {
      onAddProduct({ ...productForm, id: Date.now().toString() } as Product);
    }
    setIsEditingProduct(null);
    setProductForm({});
  };

  const generateDescription = async () => {
    if (!productForm.name) return;
    setIsGenerating(true);
    try {
      // Mock response for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProductForm(prev => ({ ...prev, description: `Fresh and organic ${productForm.name}, perfect for your healthy diet. Sustainably sourced and full of flavor.` }));
      
    } catch (error) {
      console.error("AI Error:", error);
      alert("Failed to generate description.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const generateImage = async () => {
    if (!productForm.name) return;
    setIsGeneratingImage(true);
    try {
       // Mock AI Image Generation for now (since we can't easily call backend AI from here without setup)
       // In a real scenario, this would call an API endpoint that uses gemini-3-pro-image-preview
       await new Promise(resolve => setTimeout(resolve, 2000));
       // Use a placeholder that looks like a generated image
       const mockImage = `https://source.unsplash.com/800x800/?organic,${encodeURIComponent(productForm.name)}`;
       setProductForm(prev => ({ ...prev, image: mockImage }));
    } catch (error) {
      console.error("AI Image Error:", error);
      alert("Failed to generate image.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // --- Category Handlers ---
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    onAddCategory({ id: Date.now().toString(), name: newCategoryName });
    setNewCategoryName('');
  };

  // --- Page Content Handlers ---
  const handleSaveContent = () => {
    onUpdateSiteContent(contentForm);
    alert('Site content updated successfully!');
  };

  const handleSeedDatabase = async () => {
    if (confirm('Are you sure you want to seed the database? This will add initial data if collections are empty.')) {
      const success = await api.seedDatabase();
      if (success) {
        alert('Database seeded successfully! Please refresh the page.');
        window.location.reload();
      } else {
        alert('Failed to seed database. Check console for details.');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-3xl font-serif font-bold text-[#2F5233]">Admin Dashboard</h2>
        <button
          onClick={handleSeedDatabase}
          className="bg-[#5C4033] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#2F5233] transition-colors shadow-sm text-sm"
        >
          <Database size={16} /> Seed Database
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        <button 
          onClick={() => setActiveTab('products')}
          className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition-colors ${activeTab === 'products' ? 'bg-[#2F5233] text-white' : 'bg-white text-[#5C4033] hover:bg-[#F5F5F0]'}`}
        >
          <ShoppingBag size={18} className="inline mr-2" /> Products
        </button>
        <button 
          onClick={() => setActiveTab('categories')}
          className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition-colors ${activeTab === 'categories' ? 'bg-[#2F5233] text-white' : 'bg-white text-[#5C4033] hover:bg-[#F5F5F0]'}`}
        >
          <Layout size={18} className="inline mr-2" /> Categories
        </button>
        <button 
          onClick={() => setActiveTab('pages')}
          className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition-colors ${activeTab === 'pages' ? 'bg-[#2F5233] text-white' : 'bg-white text-[#5C4033] hover:bg-[#F5F5F0]'}`}
        >
          <FileText size={18} className="inline mr-2" /> Pages Content
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition-colors ${activeTab === 'orders' ? 'bg-[#2F5233] text-white' : 'bg-white text-[#5C4033] hover:bg-[#F5F5F0]'}`}
        >
          <Package size={18} className="inline mr-2" /> Orders
        </button>
      </div>

      {/* --- PRODUCTS TAB --- */}
      {activeTab === 'products' && (
        // ... (existing product tab content)
        <div>
          <div className="flex justify-end mb-4">
            <button 
              onClick={() => {
                setIsEditingProduct('new');
                setProductForm({ category: categories[0]?.name || 'Vegetables', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=800' });
              }}
              className="bg-[#2F5233] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#5C4033] transition-colors shadow-sm"
            >
              <Plus size={20} /> Add Product
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-[#2F5233]/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead className="bg-[#F5F5F0] text-[#5C4033] font-bold">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2F5233]/5">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-[#F5F5F0]/50 transition-colors">
                      <td className="p-4 flex items-center gap-4">
                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-[#F5F5F0]" />
                        <div>
                          <div className="font-bold text-[#2F5233]">{product.name}</div>
                          <div className="text-xs text-[#5C4033]/60 truncate max-w-[150px] md:max-w-[300px]">{product.description}</div>
                        </div>
                      </td>
                      <td className="p-4 text-[#5C4033]">{product.category}</td>
                      <td className="p-4 font-bold text-[#2F5233]">EGP {product.price.toFixed(2)}</td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => handleEditProduct(product)} className="text-[#2F5233] hover:text-[#F4E285] transition-colors p-1"><Edit size={18} /></button>
                        <button onClick={() => onDeleteProduct(product.id)} className="text-[#5C4033]/40 hover:text-rose-500 transition-colors p-1"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-[#5C4033]/50">No products found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- ORDERS TAB --- */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-[#2F5233]/10">
              <div className="flex justify-between items-start mb-4 border-b border-[#2F5233]/10 pb-4">
                <div>
                  <h3 className="font-bold text-lg text-[#2F5233]">Order #{order.id}</h3>
                  <p className="text-sm text-[#5C4033]/60">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select 
                    value={order.status}
                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-sm font-bold border outline-none ${
                      order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      'bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-[#5C4033] mb-2 text-sm uppercase tracking-wider">Customer</h4>
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-sm text-[#5C4033]/80">{order.customerEmail}</p>
                  <p className="text-sm text-[#5C4033]/80">{order.customerPhone}</p>
                  <p className="text-sm text-[#5C4033]/80 mt-1 whitespace-pre-wrap">{order.customerAddress}</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#5C4033] mb-2 text-sm uppercase tracking-wider">Items</h4>
                  <ul className="space-y-2">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-2 border-t border-[#2F5233]/10 flex justify-between font-bold text-[#2F5233]">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="text-center p-12 bg-white rounded-xl border border-[#2F5233]/10 text-[#5C4033]/50">
              No orders found.
            </div>
          )}
        </div>
      )}

      {/* --- CATEGORIES TAB --- */}
      {activeTab === 'categories' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#2F5233]/10 mb-6">
            <h3 className="font-bold text-lg text-[#2F5233] mb-4">Add New Category</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category Name"
                className="flex-grow px-4 py-2 border border-[#2F5233]/20 rounded-lg focus:ring-2 focus:ring-[#2F5233] outline-none"
              />
              <button 
                onClick={handleAddCategory}
                className="bg-[#2F5233] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#5C4033] transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-[#2F5233]/10 overflow-hidden">
            <ul className="divide-y divide-[#2F5233]/5">
              {categories.map(category => (
                <li key={category.id} className="p-4 flex justify-between items-center hover:bg-[#F5F5F0]/50">
                  <span className="font-medium text-[#5C4033]">{category.name}</span>
                  <button 
                    onClick={() => onDeleteCategory(category.id)}
                    className="text-[#5C4033]/40 hover:text-rose-500 transition-colors p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
              {categories.length === 0 && (
                <li className="p-8 text-center text-[#5C4033]/50">No categories found.</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* --- PAGES TAB --- */}
      {activeTab === 'pages' && (
        <div className="max-w-4xl mx-auto space-y-8">
          {/* About Page Editor */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#2F5233]/10">
            <h3 className="font-serif font-bold text-2xl text-[#2F5233] mb-6 border-b border-[#2F5233]/10 pb-2">About Page</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#5C4033] mb-1">Main Title</label>
                <input 
                  value={contentForm.about.title}
                  onChange={(e) => setContentForm({...contentForm, about: {...contentForm.about, title: e.target.value}})}
                  className="w-full px-4 py-2 border border-[#2F5233]/20 rounded-lg outline-none focus:border-[#2F5233]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#5C4033] mb-1">Main Content</label>
                <textarea 
                  value={contentForm.about.content}
                  onChange={(e) => setContentForm({...contentForm, about: {...contentForm.about, content: e.target.value}})}
                  className="w-full px-4 py-2 border border-[#2F5233]/20 rounded-lg outline-none focus:border-[#2F5233] h-32"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#5C4033] mb-1">Hero Image URL</label>
                <input 
                  value={contentForm.about.image}
                  onChange={(e) => setContentForm({...contentForm, about: {...contentForm.about, image: e.target.value}})}
                  className="w-full px-4 py-2 border border-[#2F5233]/20 rounded-lg outline-none focus:border-[#2F5233]"
                />
              </div>
            </div>
          </div>

          {/* Contact Page Editor */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#2F5233]/10">
            <h3 className="font-serif font-bold text-2xl text-[#2F5233] mb-6 border-b border-[#2F5233]/10 pb-2">Contact Page</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#5C4033] mb-1">Title</label>
                <input 
                  value={contentForm.contact.title}
                  onChange={(e) => setContentForm({...contentForm, contact: {...contentForm.contact, title: e.target.value}})}
                  className="w-full px-4 py-2 border border-[#2F5233]/20 rounded-lg outline-none focus:border-[#2F5233]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#5C4033] mb-1">Intro Text</label>
                <textarea 
                  value={contentForm.contact.content}
                  onChange={(e) => setContentForm({...contentForm, contact: {...contentForm.contact, content: e.target.value}})}
                  className="w-full px-4 py-2 border border-[#2F5233]/20 rounded-lg outline-none focus:border-[#2F5233] h-24"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#5C4033] mb-1">Email</label>
                  <input 
                    value={contentForm.contact.email}
                    onChange={(e) => setContentForm({...contentForm, contact: {...contentForm.contact, email: e.target.value}})}
                    className="w-full px-4 py-2 border border-[#2F5233]/20 rounded-lg outline-none focus:border-[#2F5233]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#5C4033] mb-1">Phone</label>
                  <input 
                    value={contentForm.contact.phone}
                    onChange={(e) => setContentForm({...contentForm, contact: {...contentForm.contact, phone: e.target.value}})}
                    className="w-full px-4 py-2 border border-[#2F5233]/20 rounded-lg outline-none focus:border-[#2F5233]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-[#5C4033] mb-1">Address</label>
                  <input 
                    value={contentForm.contact.address}
                    onChange={(e) => setContentForm({...contentForm, contact: {...contentForm.contact, address: e.target.value}})}
                    className="w-full px-4 py-2 border border-[#2F5233]/20 rounded-lg outline-none focus:border-[#2F5233]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              onClick={handleSaveContent}
              className="bg-[#2F5233] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#5C4033] transition-colors flex items-center gap-2 shadow-lg"
            >
              <Save size={20} /> Save All Changes
            </button>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {isEditingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden my-8">
            <div className="p-6 border-b border-[#2F5233]/10 flex justify-between items-center bg-[#F5F5F0]">
              <h3 className="font-serif font-bold text-xl text-[#2F5233]">{isEditingProduct === 'new' ? 'Add New Product' : 'Edit Product'}</h3>
              <button onClick={() => setIsEditingProduct(null)}><X size={24} className="text-[#5C4033]" /></button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#5C4033] mb-1">Name</label>
                <input 
                  value={productForm.name || ''} 
                  onChange={e => setProductForm({...productForm, name: e.target.value})}
                  className="w-full px-4 py-2 border border-[#2F5233]/20 rounded-lg focus:ring-2 focus:ring-[#2F5233] outline-none"
                  placeholder="e.g. Organic Kale"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#5C4033] mb-1">Price (EGP)</label>
                  <input 
                    type="number" 
                    value={productForm.price || ''} 
                    onChange={e => setProductForm({...productForm, price: parseFloat(e.target.value)})}
                    className="w-full px-4 py-2 border border-[#2F5233]/20 rounded-lg focus:ring-2 focus:ring-[#2F5233] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#5C4033] mb-1">Unit</label>
                  <input 
                    value={productForm.unit || ''} 
                    onChange={e => setProductForm({...productForm, unit: e.target.value})}
                    className="w-full px-4 py-2 border border-[#2F5233]/20 rounded-lg focus:ring-2 focus:ring-[#2F5233] outline-none"
                    placeholder="e.g. kg, bunch"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#5C4033] mb-1">Category</label>
                <select 
                  value={productForm.category || categories[0]?.name} 
                  onChange={e => setProductForm({...productForm, category: e.target.value})}
                  className="w-full px-4 py-2 border border-[#2F5233]/20 rounded-lg focus:ring-2 focus:ring-[#2F5233] outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#5C4033] mb-1">Image</label>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <input 
                      value={productForm.image || ''} 
                      onChange={e => setProductForm({...productForm, image: e.target.value})}
                      className="flex-1 px-4 py-2 border border-[#2F5233]/20 rounded-lg focus:ring-2 focus:ring-[#2F5233] outline-none"
                      placeholder="Image URL"
                    />
                    <label className="cursor-pointer bg-[#F5F5F0] hover:bg-[#E5E5E0] text-[#5C4033] px-3 py-2 rounded-lg border border-[#2F5233]/20 flex items-center justify-center transition-colors">
                      <Upload size={18} />
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                  
                  <button 
                    onClick={generateImage}
                    disabled={isGeneratingImage || !productForm.name}
                    className="text-xs flex items-center gap-1 text-[#2F5233] font-bold hover:text-[#F4E285] disabled:opacity-50 w-fit"
                  >
                    <ImageIcon size={12} /> {isGeneratingImage ? 'Generating Image...' : 'Generate Image with AI'}
                  </button>

                  {productForm.image && (
                    <img src={productForm.image} alt="Preview" className="w-full h-32 object-cover rounded-lg border border-[#2F5233]/10" />
                  )}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-bold text-[#5C4033]">Description</label>
                  <button 
                    onClick={generateDescription} 
                    disabled={isGenerating || !productForm.name}
                    className="text-xs flex items-center gap-1 text-[#2F5233] font-bold hover:text-[#F4E285] disabled:opacity-50"
                  >
                    <Sparkles size={12} /> {isGenerating ? 'Generating...' : 'Generate with AI'}
                  </button>
                </div>
                <textarea 
                  value={productForm.description || ''} 
                  onChange={e => setProductForm({...productForm, description: e.target.value})}
                  className="w-full px-4 py-2 border border-[#2F5233]/20 rounded-lg focus:ring-2 focus:ring-[#2F5233] outline-none h-24 resize-none"
                />
              </div>
            </div>

            <div className="p-6 bg-[#F5F5F0] flex justify-end gap-3">
              <button onClick={() => setIsEditingProduct(null)} className="px-6 py-2 text-[#5C4033] font-bold hover:text-[#2F5233]">Cancel</button>
              <button onClick={handleSaveProduct} className="px-6 py-2 bg-[#2F5233] text-white font-bold rounded-lg hover:bg-[#5C4033] flex items-center gap-2">
                <Save size={18} /> Save Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
