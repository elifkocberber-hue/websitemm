'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export const NewsletterForm: React.FC = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }

    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t.newsletter.placeholder}
        required
        className="flex-1 px-5 py-3 bg-transparent border border-charcoal/20 text-sm text-charcoal placeholder:text-clay focus:outline-none focus:border-accent transition-colors"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-charcoal text-bone px-6 py-3 text-sm tracking-wider uppercase hover:bg-accent transition-colors duration-300 disabled:opacity-50"
      >
        {status === 'loading' ? '...' : status === 'success' ? '' : t.newsletter.subscribe}
      </button>
      {status === 'success' && (
        <p className="absolute mt-14 text-xs text-green-600">{t.newsletter.success}</p>
      )}
      {status === 'error' && (
        <p className="absolute mt-14 text-xs text-red-600">{t.newsletter.error}</p>
      )}
    </form>
  );
};
