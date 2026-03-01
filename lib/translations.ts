// Turkish translations
export const tr = {
  nav: {
    home: 'Ana Sayfa',
    ceramics: 'Ürünler',
    about: 'Hakkımızda',
    contact: 'İletişim',
    cart: 'Sepet',
    login: 'Giriş',
  },
  footer: {
    rights: 'Tüm hakları saklıdır',
    email: 'Email',
    phone: 'Telefon',
    address: 'Adres',
    hours: 'Çalışma Saatleri',
  },
  home: {
    hero_title: 'Geleneksel Seramik Sanatı',
    hero_description: 'El yapımı seramik ürünlerin en güzel ve özgün koleksiyonu. Her parça, ustalarımızın kalp ve emekleriyle yaratılmıştır.',
    explore: 'Koleksiyonu Keşfet',
    read_story: 'Hikayemizi Oku',
    featured: 'Öne Çıkan Ürünler',
    why_choose: 'Bizi Neden Seçmelisiniz?',
  },
  about: {
    title: 'El\'s Dream Factory',
    subtitle: '30 yıldan fazla, geleneksel seramik sanatını modern dünyada tutarlı bir şekilde sunuyoruz.',
    story_title: 'Hikayemiz',
    values_title: 'Değerlerimiz',
    team_title: 'Ekibimiz',
  },
  contact: {
    title: 'İletişim',
    subtitle: 'Sorularınız, talepleriniz veya deneyimlerinizi paylaşmak için bize ulaşın',
    form_title: 'İletişim Formu',
    name: 'Ad Soyad',
    email: 'Email',
    phone: 'Telefon',
    subject: 'Konu',
    message: 'Mesaj',
    send: 'Mesajı Gönder',
    faq_title: 'Sıkça Sorulan Sorular',
  },
};

// English translations
export const en = {
  nav: {
    home: 'Home',
    ceramics: 'Products',
    about: 'About',
    contact: 'Contact',
    cart: 'Cart',
    login: 'Login',
  },
  footer: {
    rights: 'All rights reserved',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    hours: 'Working Hours',
  },
  home: {
    hero_title: 'Traditional Ceramic Art',
    hero_description: 'The finest and most unique collection of handmade ceramic products. Each piece is created with the heart and hard work of our craftsmen.',
    explore: 'Explore Collection',
    read_story: 'Read Our Story',
    featured: 'Featured Products',
    why_choose: 'Why Choose Us?',
  },
  about: {
    title: 'Ter-a Ceramics',
    subtitle: 'For over 30 years, we have been consistently presenting traditional ceramic art to the modern world.',
    story_title: 'Our Story',
    values_title: 'Our Values',
    team_title: 'Our Team',
  },
  contact: {
    title: 'Contact',
    subtitle: 'Reach out to share your questions, requests, or experiences',
    form_title: 'Contact Form',
    name: 'Full Name',
    email: 'Email',
    phone: 'Phone',
    subject: 'Subject',
    message: 'Message',
    send: 'Send Message',
    faq_title: 'Frequently Asked Questions',
  },
};

export type LanguageType = 'tr' | 'en';
export type TranslationKeys = typeof tr;
