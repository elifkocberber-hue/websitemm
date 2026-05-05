'use client';

import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const { register } = useUser();
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return;
    }

    setLoading(true);
    const result = await register({ email, password, firstName, lastName });
    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Kayıt başarısız');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-bone flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="heading-display text-3xl md:text-4xl text-charcoal mb-3">Üye Ol</h1>
          <p className="text-earth text-sm">Yeni bir hesap oluşturun</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-xs tracking-[0.15em] uppercase text-earth mb-2">
                Ad
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full min-h-11 px-4 py-3 text-base bg-white border border-warm-gray rounded-lg text-charcoal placeholder:text-clay focus:outline-none focus:border-charcoal transition-colors"
                placeholder="Adınız"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-xs tracking-[0.15em] uppercase text-earth mb-2">
                Soyad
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full min-h-11 px-4 py-3 text-base bg-white border border-warm-gray rounded-lg text-charcoal placeholder:text-clay focus:outline-none focus:border-charcoal transition-colors"
                placeholder="Soyadınız"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-xs tracking-[0.15em] uppercase text-earth mb-2">
              E-posta
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full min-h-11 px-4 py-3 text-base bg-white border border-warm-gray rounded-lg text-charcoal placeholder:text-clay focus:outline-none focus:border-charcoal transition-colors"
              placeholder="ornek@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs tracking-[0.15em] uppercase text-earth mb-2">
              Şifre
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full min-h-11 px-4 py-3 text-base bg-white border border-warm-gray rounded-lg text-charcoal placeholder:text-clay focus:outline-none focus:border-charcoal transition-colors"
              placeholder="En az 6 karakter"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-xs tracking-[0.15em] uppercase text-earth mb-2">
              Şifre Tekrar
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full min-h-11 px-4 py-3 text-base bg-white border border-warm-gray rounded-lg text-charcoal placeholder:text-clay focus:outline-none focus:border-charcoal transition-colors"
              placeholder="Şifrenizi tekrarlayın"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-charcoal text-bone py-3.5 text-sm tracking-wider uppercase hover:bg-accent transition-colors duration-300 disabled:opacity-50 rounded-lg"
          >
            {loading ? 'Kayıt yapılıyor...' : 'Üye Ol'}
          </button>
        </form>

        <p className="text-center text-earth text-sm mt-8">
          Zaten hesabınız var mı?{' '}
          <Link href="/login" className="text-charcoal hover:text-accent font-medium transition-colors">
            Giriş Yap
          </Link>
        </p>

        <p className="text-center mt-4">
          <Link href="/" className="text-earth text-sm hover:text-charcoal transition-colors">
            ← Ana Sayfaya Dön
          </Link>
        </p>
      </div>
    </div>
  );
}
