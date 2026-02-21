import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import Footer from './components/Footer';
import Admin from './components/Admin';
import Toast from './components/Toast';
import About from './components/About';
import Contact from './components/Contact';
import Login from './components/Login';
import { Product, CartItem, ViewState, Category, SiteContent } from './types';
import { INITIAL_SITE_CONTENT } from './data';

function App() {
  const [view, setView] = useState<ViewState>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent>(INITIAL_SITE_CONTENT);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Check for admin route on load
  useEffect(() => {
    if (window.location.pathname === '/admin') {
      setView('admin');
    }
  }, []);

  // Fetch Data from API
  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, contentRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
        fetch('/api/content')
      ]);

      if (productsRes.ok) setProducts(await productsRes.json());
      if (categoriesRes.ok) setCategories(await categoriesRes.json());
      if (contentRes.ok) setSiteContent(await contentRes.json());
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  useEffect(() => {
    fetchData();
    const storedCart = localStorage.getItem('tabi3y_cart');
    if (storedCart) setCart(JSON.parse(storedCart));
    
    const token = localStorage.getItem('admin_token');
    if (token) setAuthToken(token);
  }, []);

  useEffect(() => {
    localStorage.setItem('tabi3y_cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const handleLogin = (token: string) => {
    setAuthToken(token);
    localStorage.setItem('admin_token', token);
    showToast('Logged in successfully');
  };

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('admin_token');
    setView('home');
    showToast('Logged out');
  };

  // ... Cart Handlers (unchanged) ...
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`Added ${product.name} to cart`);
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      ).filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
    showToast('Item removed from cart', 'error');
  };

  const handleCheckout = () => {
    setCart([]);
    showToast('Order placed successfully! Thank you.');
    setView('home');
  };

  // ... Admin API Handlers ...
  const apiCall = async (url: string, method: string, body?: any) => {
    if (!authToken) return;
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('API Error');
      fetchData(); // Refresh data
      return true;
    } catch (err) {
      showToast('Operation failed', 'error');
      return false;
    }
  };

  const handleAddProduct = async (product: Product) => {
    if (await apiCall('/api/products', 'POST', product)) showToast('Product added');
  };

  const handleUpdateProduct = async (product: Product) => {
    if (await apiCall(`/api/products/${product.id}`, 'PUT', product)) showToast('Product updated');
  };

  const handleDeleteProduct = async (id: string) => {
    if (await apiCall(`/api/products/${id}`, 'DELETE')) showToast('Product deleted', 'error');
  };

  const handleAddCategory = async (category: Category) => {
    if (await apiCall('/api/categories', 'POST', category)) showToast('Category added');
  };

  const handleDeleteCategory = async (id: string) => {
    if (await apiCall(`/api/categories/${id}`, 'DELETE')) showToast('Category deleted', 'error');
  };

  const handleUpdateSiteContent = async (content: SiteContent) => {
    if (await apiCall('/api/content', 'PUT', content)) showToast('Content updated');
  };

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  // If viewing admin and not logged in, show login
  if (view === 'admin' && !authToken) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F0] font-sans text-[#5C4033]">
      {view === 'admin' ? (
        <div className="bg-[#2F5233] text-white p-4 flex justify-between items-center">
          <span className="font-bold">Admin Mode</span>
          <button onClick={handleLogout} className="text-sm underline">Logout</button>
        </div>
      ) : (
        <Header cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} view={view} setView={setView} />
      )}

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Hero onShopNow={() => setView('shop')} />
              
              <section className="py-20 container mx-auto px-4">
                <div className="text-center mb-16">
                  <span className="text-[#2F5233] font-bold tracking-widest uppercase text-sm">Fresh from Farm</span>
                  <h2 className="text-4xl font-serif font-bold text-[#2F5233] mt-2 mb-4">Featured Products</h2>
                  <div className="w-20 h-1 bg-[#F4E285] mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {products.slice(0, 4).map(product => (
                    <ProductCard key={product.id} product={product} onAdd={addToCart} />
                  ))}
                </div>

                <div className="text-center mt-12">
                  <button 
                    onClick={() => setView('shop')}
                    className="inline-block border-2 border-[#2F5233] text-[#2F5233] px-8 py-3 rounded-full font-bold hover:bg-[#2F5233] hover:text-white transition-colors"
                  >
                    View All Products
                  </button>
                </div>
              </section>

              <section className="bg-[#2F5233] py-20 text-[#F5F5F0]">
                <div className="container mx-auto px-4 text-center">
                  <h2 className="text-4xl font-serif font-bold mb-8">Why Choose Tabi3y?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="p-6 bg-white/5 rounded-2xl backdrop-blur-sm">
                      <h3 className="text-xl font-bold text-[#F4E285] mb-4">100% Organic</h3>
                      <p className="text-[#F5F5F0]/80">Certified organic produce grown without harmful pesticides or chemicals.</p>
                    </div>
                    <div className="p-6 bg-white/5 rounded-2xl backdrop-blur-sm">
                      <h3 className="text-xl font-bold text-[#F4E285] mb-4">Free-Range</h3>
                      <p className="text-[#F5F5F0]/80">Our poultry is raised in open pastures with natural diets and care.</p>
                    </div>
                    <div className="p-6 bg-white/5 rounded-2xl backdrop-blur-sm">
                      <h3 className="text-xl font-bold text-[#F4E285] mb-4">Local Support</h3>
                      <p className="text-[#F5F5F0]/80">We partner directly with local farmers to ensure fair trade and freshness.</p>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {view === 'shop' && (
            <motion.div
              key="shop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="container mx-auto px-4 py-12"
            >
              <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                <h2 className="text-4xl font-serif font-bold text-[#2F5233]">Shop Our Market</h2>
                
                <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className={`px-6 py-2 rounded-full whitespace-nowrap transition-colors ${
                      selectedCategory === 'All' 
                        ? 'bg-[#2F5233] text-white font-bold' 
                        : 'bg-white text-[#5C4033] hover:bg-[#F5F5F0] border border-[#2F5233]/10'
                    }`}
                  >
                    All
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`px-6 py-2 rounded-full whitespace-nowrap transition-colors ${
                        selectedCategory === cat.name 
                          ? 'bg-[#2F5233] text-white font-bold' 
                          : 'bg-white text-[#5C4033] hover:bg-[#F5F5F0] border border-[#2F5233]/10'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} onAdd={addToCart} />
                ))}
              </div>
            </motion.div>
          )}

          {view === 'cart' && (
            <motion.div
              key="cart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Cart 
                items={cart} 
                onUpdateQuantity={updateCartQuantity} 
                onRemove={removeFromCart} 
                onCheckout={handleCheckout} 
              />
            </motion.div>
          )}

          {view === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Admin 
                products={products} 
                categories={categories}
                siteContent={siteContent}
                onAddProduct={handleAddProduct} 
                onUpdateProduct={handleUpdateProduct} 
                onDeleteProduct={handleDeleteProduct}
                onAddCategory={handleAddCategory}
                onDeleteCategory={handleDeleteCategory}
                onUpdateSiteContent={handleUpdateSiteContent}
              />
            </motion.div>
          )}

          {view === 'about' && (
            <About content={siteContent.about} />
          )}

          {view === 'contact' && (
            <Contact content={siteContent.contact} />
          )}
        </AnimatePresence>
      </main>

      {view !== 'admin' && <Footer />}
      
      <Toast 
        message={toast?.message || null} 
        type={toast?.type} 
        onClose={() => setToast(null)} 
      />
    </div>
  );
}

export default App;
