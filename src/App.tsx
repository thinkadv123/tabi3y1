import React, { useState, useEffect } from 'react';
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
import Checkout from './components/Checkout';
import { Product, CartItem, ViewState, Category, SiteContent } from './types';
import { INITIAL_SITE_CONTENT } from './data';
import { api } from './services/api';

function App() {
  const [view, setView] = useState<ViewState>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent>(INITIAL_SITE_CONTENT);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('tabi3y_token'));

  useEffect(() => {
    fetchData();
    const storedCart = localStorage.getItem('tabi3y_cart');
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('tabi3y_cart', JSON.stringify(cart));
  }, [cart]);

  const fetchData = async () => {
    try {
      const [prods, cats, content] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getContent()
      ]);
      setProducts(prods || []);
      setCategories(cats || []);
      setSiteContent(content || INITIAL_SITE_CONTENT);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const handleLogin = (token: string) => {
    setAuthToken(token);
    localStorage.setItem('tabi3y_token', token);
    setView('admin');
    showToast('Logged in successfully');
  };

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('tabi3y_token');
    setView('home');
    showToast('Logged out');
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`Added ${product.name} to cart`);
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
    showToast('Item removed', 'error');
  };

  const handleOrderSuccess = () => {
    setCart([]);
    setView('home');
    showToast('Order placed successfully!');
  };

  const filteredProducts = selectedCategory === 'All' ? products : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col">
      {view !== 'admin' && <Header cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} view={view} setView={setView} />}
      
      <main className="flex-grow">
        {view === 'home' && (
          <div>
            <Hero onShopNow={() => setView('shop')} />
            <section className="py-20 container mx-auto px-4">
              <h2 className="text-4xl font-serif font-bold text-[#2F5233] text-center mb-12">Featured Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.slice(0, 4).map(p => <ProductCard key={p.id} product={p} onAdd={addToCart} />)}
              </div>
            </section>
          </div>
        )}

        {view === 'shop' && (
          <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
              <h2 className="text-4xl font-serif font-bold text-[#2F5233]">Our Market</h2>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                <button onClick={() => setSelectedCategory('All')} className={`px-6 py-2 rounded-full ${selectedCategory === 'All' ? 'bg-[#2F5233] text-white' : 'bg-white'}`}>All</button>
                {categories.map(cat => (
                  <button key={cat.id} onClick={() => setSelectedCategory(cat.name)} className={`px-6 py-2 rounded-full ${selectedCategory === cat.name ? 'bg-[#2F5233] text-white' : 'bg-white'}`}>{cat.name}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map(p => <ProductCard key={p.id} product={p} onAdd={addToCart} />)}
            </div>
          </div>
        )}

        {view === 'cart' && <Cart key="cart" items={cart} onUpdateQuantity={updateCartQuantity} onRemove={removeFromCart} onCheckout={() => setView('checkout')} />}
        {view === 'checkout' && <Checkout key="checkout" cart={cart} total={cart.reduce((s, i) => s + i.price * i.quantity, 0)} onSuccess={handleOrderSuccess} onBack={() => setView('cart')} />}
        {view === 'about' && <About key="about" content={siteContent.about} />}
        {view === 'contact' && <Contact key="contact" content={siteContent.contact} />}
        {view === 'admin' && (authToken ? <Admin key="admin" products={products} categories={categories} siteContent={siteContent} onLogout={handleLogout} refreshData={fetchData} token={authToken} /> : <Login key="login" onLogin={handleLogin} />)}
      </main>

      {view !== 'admin' && <Footer />}
      <Toast message={toast?.message || null} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}

export default App;
