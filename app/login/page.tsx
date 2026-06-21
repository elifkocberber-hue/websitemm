'use client';

import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function LoginPage() {
  const { login } = useUser();
  const { t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || t.auth.login_failed);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-bone flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="heading-display text-3xl md:text-4xl text-charcoal mb-3">{t.auth.login_title}</h1>
          <p className="text-earth text-sm">{t.auth.login_subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-xs tracking-[0.15em] uppercase text-earth mb-2">
              {t.auth.email}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full min-h-11 px-4 py-3 text-base bg-white border border-warm-gray rounded-lg text-charcoal placeholder:text-clay focus:outline-none focus:border-charcoal transition-colors"
              placeholder={t.auth.email_ph}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs tracking-[0.15em] uppercase text-earth mb-2">
              {t.auth.password}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full min-h-11 px-4 py-3 text-base bg-white border border-warm-gray rounded-lg text-charcoal placeholder:text-clay focus:outline-none focus:border-charcoal transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div className="flex justify-end -mt-2">
            <Link href="/forgot-password" className="text-xs text-earth hover:text-charcoal transition-colors">
              {t.auth.forgot_link}
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-charcoal text-bone py-3.5 text-sm tracking-wider uppercase hover:bg-accent transition-colors duration-300 disabled:opacity-50 rounded-lg"
          >
            {loading ? t.auth.logging_in : t.auth.login_btn}
          </button>
        </form>

        <p className="text-center text-earth text-sm mt-8">
          {t.auth.no_account}{' '}
          <Link href="/register" className="text-charcoal hover:text-accent font-medium transition-colors">
            {t.auth.register_link}
          </Link>
        </p>

        <p className="text-center mt-4">
          <Link href="/" className="text-earth text-sm hover:text-charcoal transition-colors">
            {t.auth.back_home}
          </Link>
        </p>
      </div>
    </div>
  );
}
