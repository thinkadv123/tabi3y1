import React, { useState } from 'react';
import { Lock, User, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { motion } from 'framer-motion';

interface LoginProps {
  onLogin: (token: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = await api.login(username, password);
      if (token) {
        onLogin(token);
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F0] px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md border border-[#2F5233]/5"
      >
        <div className="text-center mb-10">
          <div className="bg-[#2F5233] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Lock className="text-white" size={32} />
          </div>
          <h2 className="text-4xl font-serif font-bold text-[#2F5233]">Admin Access</h2>
          <p className="text-[#5C4033]/60 mt-2">Enter your credentials to manage the farm.</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-rose-50 text-rose-600 p-4 rounded-2xl mb-6 text-sm text-center font-medium"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#5C4033] ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C4033]/30" size={20} />
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-[#F5F5F0] bg-[#F5F5F0]/50 rounded-2xl focus:ring-2 focus:ring-[#2F5233]/10 outline-none transition-all"
                placeholder="admin"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#5C4033] ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C4033]/30" size={20} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-[#F5F5F0] bg-[#F5F5F0]/50 rounded-2xl focus:ring-2 focus:ring-[#2F5233]/10 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button 
            disabled={loading}
            className="w-full bg-[#2F5233] text-white font-bold py-5 rounded-2xl hover:bg-[#5C4033] transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : <><ArrowRight size={20} /> Sign In</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
