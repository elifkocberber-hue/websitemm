'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/user/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || t.auth.generic_error);
      }
    } catch {
      setError(t.auth.connection_error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bone flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {!submitted ? (
          <>
            <div className="text-center mb-10">
              <h1 className="heading-display text-3xl md:text-4xl text-charcoal mb-3">{t.auth.forgot_title}</h1>
              <p className="text-earth text-sm">
                {t.auth.forgot_subtitle}
              </p>
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
                  className="w-full px-4 py-3 bg-white border border-warm-gray rounded-lg text-charcoal placeholder:text-clay focus:outline-none focus:border-charcoal transition-colors"
                  placeholder={t.auth.email_ph}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-charcoal text-bone py-3.5 text-sm tracking-wider uppercase hover:bg-accent transition-colors duration-300 disabled:opacity-50 rounded-lg"
              >
                {loading ? t.auth.sending : t.auth.send_link}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="heading-serif text-2xl text-charcoal mb-3">{t.auth.email_sent_title}</h2>
            <p className="text-earth text-sm mb-2">
              {t.auth.email_sent_to_1}<span className="font-medium text-charcoal">{email}</span>{t.auth.email_sent_to_2}
            </p>
            <p className="text-earth text-sm mb-8">
              {t.auth.link_valid_1}<strong>{t.auth.link_valid_dur}</strong>{t.auth.link_valid_2}
            </p>
          </div>
        )}

        <p className="text-center mt-8">
          <Link href="/login" className="text-earth text-sm hover:text-charcoal transition-colors">
            {t.auth.back_login}
          </Link>
        </p>
      </div>
    </div>
  );
}
