'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export interface Faq {
  id: number;
  question: string;
  answer: string;
}

export default function FaqClient({ initialFaqs }: { initialFaqs: Faq[] }) {
  const { language } = useLanguage();
  const [faqs] = useState<Faq[]>(initialFaqs);
  const [openId, setOpenId] = useState<number | null>(null);
  const [question, setQuestion] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submitMsg, setSubmitMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setSubmitStatus('loading');
    try {
      const res = await fetch('/api/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitStatus('success');
        setSubmitMsg(
          language === 'tr'
            ? 'Sorunuz alındı! En kısa sürede cevaplandıktan sonra burada yayınlanacak.'
            : 'Your question has been received! It will be published here once answered.'
        );
        setQuestion('');
      } else {
        setSubmitStatus('error');
        setSubmitMsg(data.error || (language === 'tr' ? 'Bir hata oluştu.' : 'An error occurred.'));
      }
    } catch {
      setSubmitStatus('error');
      setSubmitMsg(language === 'tr' ? 'Bağlantı hatası.' : 'Connection error.');
    }
  };

  const copy = {
    tr: {
      hero_label: 'Bilgi',
      title: 'Sıkça Sorulan Sorular',
      subtitle: 'Aklınızdaki soruları buradan bize iletebilirsiniz. Cevapladıktan sonra bu sayfada yayınlayacağız.',
      empty: 'Henüz yayınlanmış soru yok. İlk soruyu siz sorun!',
      ask_title: 'Sorunuzu Gönderin',
      placeholder: 'Sormak istediğiniz şeyi yazın...',
      send: 'Gönder',
      sending: 'Gönderiliyor...',
    },
    en: {
      hero_label: 'Info',
      title: 'Frequently Asked Questions',
      subtitle: 'You can send us your questions here. Once answered, we\'ll publish them on this page.',
      empty: 'No published questions yet. Be the first to ask!',
      ask_title: 'Send Your Question',
      placeholder: 'Write what you\'d like to know...',
      send: 'Send',
      sending: 'Sending...',
    },
  }[language];

  return (
    <div className="max-w-350 mx-auto px-6 md:px-10 py-20 md:py-32">
      {/* Header */}
      <div className="mb-16">
        <p className="text-xs tracking-[0.2em] uppercase text-earth mb-3">{copy.hero_label}</p>
        <h1 className="heading-display text-4xl md:text-5xl text-charcoal mb-4">{copy.title}</h1>
        <p className="text-earth max-w-xl leading-relaxed">{copy.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16">
        {/* Sol: Accordion SSS listesi */}
        <div>
          {faqs.length === 0 ? (
            <p className="text-earth text-sm italic">{copy.empty}</p>
          ) : (
            <ul className="divide-y divide-warm-gray">
              {faqs.map((faq) => (
                <li key={faq.id}>
                  <button
                    type="button"
                    onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                    className="w-full flex items-start justify-between gap-6 py-6 text-left group"
                  >
                    <span className="heading-serif text-base md:text-lg text-charcoal group-hover:text-accent transition-colors">
                      {faq.question}
                    </span>
                    <span className={`mt-1 shrink-0 text-earth transition-transform duration-300 ${openId === faq.id ? 'rotate-45' : ''}`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </span>
                  </button>
                  {openId === faq.id && (
                    <div className="pb-6 pr-10">
                      <p className="text-earth leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Sağ: Soru gönderme formu */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="bg-[#5C0A1A] p-8">
            <h2 className="heading-serif text-xl text-bone mb-6">{copy.ask_title}</h2>
            {submitStatus === 'success' ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-700 text-sm leading-relaxed">{submitMsg}</p>
                <button
                  type="button"
                  onClick={() => setSubmitStatus('idle')}
                  className="mt-4 text-xs text-green-600 underline hover:text-green-800"
                >
                  {language === 'tr' ? 'Başka bir soru sor' : 'Ask another question'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={copy.placeholder}
                  rows={5}
                  maxLength={500}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 text-sm text-bone placeholder:text-bone/50 focus:outline-none focus:border-white resize-none"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-bone/60">{question.length}/500</span>
                  <button
                    type="submit"
                    disabled={submitStatus === 'loading' || !question.trim()}
                    className="bg-white text-[#5C0A1A] px-6 py-2.5 text-sm tracking-wider uppercase hover:bg-bone transition-colors duration-300 disabled:opacity-50"
                  >
                    {submitStatus === 'loading' ? copy.sending : copy.send}
                  </button>
                </div>
                {submitStatus === 'error' && (
                  <p className="text-red-600 text-xs">{submitMsg}</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
