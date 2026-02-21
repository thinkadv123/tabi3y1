import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';

interface LoginProps {
  onLogin: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        onLogin(data.token);
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F0]">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-[#2F5233]/10">
        <h2 className="text-3xl font-serif font-bold text-[#2F5233] mb-6 text-center">Admin Access</h2>
        {error && <div className="bg-rose-100 text-rose-600 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#5C4033] mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C4033]/50" size={20} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#2F5233]/20 rounded-xl focus:ring-2 focus:ring-[#2F5233] outline-none"
                placeholder="Enter username"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-[#5C4033] mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C4033]/50" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#2F5233]/20 rounded-xl focus:ring-2 focus:ring-[#2F5233] outline-none"
                placeholder="Enter password"
              />
            </div>
          </div>
          <button className="w-full bg-[#2F5233] text-white font-bold py-4 rounded-xl hover:bg-[#5C4033] transition-colors shadow-lg">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
