'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

function ResetPasswordContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) setError(t.auth.invalid_link);
  }, [token, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError(t.auth.passwords_mismatch);
      return;
    }
    // Sunucu kuralıyla aynı: en az 8 karakter, büyük/küçük harf ve rakam
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
      setError(t.auth.password_min);
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/user/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 3000);
      } else {
        setError(data.error || t.auth.generic_error);
      }
    } catch {
      setError(t.auth.connection_error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="heading-serif text-2xl text-charcoal mb-3">{t.auth.password_updated_title}</h2>
        <p className="text-earth text-sm">{t.auth.redirecting_login}</p>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-10">
        <h1 className="heading-display text-3xl md:text-4xl text-charcoal mb-3">{t.auth.reset_title}</h1>
        <p className="text-earth text-sm">{t.auth.reset_subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="password" className="block text-xs tracking-[0.15em] uppercase text-earth mb-2">
            {t.auth.new_password}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            disabled={!token}
            className="w-full px-4 py-3 bg-white border border-warm-gray rounded-lg text-charcoal placeholder:text-clay focus:outline-none focus:border-charcoal transition-colors disabled:opacity-50"
            placeholder={t.auth.password_min_ph}
          />
        </div>

        <div>
          <label htmlFor="confirm" className="block text-xs tracking-[0.15em] uppercase text-earth mb-2">
            {t.auth.confirm_password}
          </label>
          <input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            disabled={!token}
            className="w-full px-4 py-3 bg-white border border-warm-gray rounded-lg text-charcoal placeholder:text-clay focus:outline-none focus:border-charcoal transition-colors disabled:opacity-50"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !token}
          className="w-full bg-charcoal text-bone py-3.5 text-sm tracking-wider uppercase hover:bg-accent transition-colors duration-300 disabled:opacity-50 rounded-lg"
        >
          {loading ? t.auth.saving : t.auth.update_password_btn}
        </button>
      </form>

      <p className="text-center mt-8">
        <Link href="/login" className="text-earth text-sm hover:text-charcoal transition-colors">
          {t.auth.back_login}
        </Link>
      </p>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-bone flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Suspense fallback={null}>
          <ResetPasswordContent />
        </Suspense>
      </div>
    </div>
  );
}
