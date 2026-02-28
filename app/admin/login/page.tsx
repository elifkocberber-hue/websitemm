'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@ter-aseramik.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAdmin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push('/admin/dashboard');
      } else {
        setError('Geçersiz e-posta veya şifre');
      }
    } catch (err) {
      setError('Giriş hatası. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🏛️ Admin Paneli</h1>
          <p className="text-gray-600">ter-aseramik Yönetim Sistemi</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-posta
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                placeholder="admin@ter-aseramik.com"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 rounded-lg transition-all"
            >
              {loading ? '🔄 Giriş yapılıyor...' : '🔐 Giriş Yap'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-600 mb-3 font-medium">Demo Kimlik Bilgileri:</p>
            <div className="bg-gray-50 p-3 rounded text-xs space-y-1">
              <p><strong>E-posta:</strong> admin@ter-aseramik.com</p>
              <p><strong>Şifre:</strong> admin123</p>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              ⚠️ Production'da güvenli şifre kullanın!
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <a href="/" className="text-amber-600 hover:text-amber-700 font-medium">
            ← Ana Sayfa
          </a>
        </div>
      </div>
    </div>
  );
}
