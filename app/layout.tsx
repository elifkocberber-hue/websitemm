import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CeramicCartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { AdminProvider } from "@/context/AdminContext";
import { UserProvider } from "@/context/UserContext";
import { Header, Footer, ScrollToTop, MetaPixel } from "@/components";

import { CookieConsent } from "@/components/CookieConsent";
import { VisitorTracker } from "@/components/VisitorTracker";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // Basic SEO — Ana sayfa için hedef anahtar kelimeler
  title: {
    default: "El's Dream Factory | El Yapımı Seramik Ürünler & Hediyeler",
    template: "%s | El's Dream Factory",
  },
  description: "El yapımı seramik ürünler, sevimli kedi figürleri, dekoratif objeler ve özel hediyeler. Benzersiz el yapımı seramik kupalar, vazolar ve hediye seçenekleri.",
  keywords: [
    "el yapımı seramik",
    "seramik ürünler",
    "handmade seramik",
    "seramik kedi figür",
    "dekoratif seramik",
    "seramik kupa",
    "seramik hediye",
    "sevimli seramik objeler",
    "el yapımı hediye",
    "seramik ev dekorasyonu",
    "handmade ceramic",
    "Turkish ceramics",
    "ceramic cat figurine",
    "handmade pottery gifts",
  ],

  // Verification — Google Search Console'dan alınan gerçek kodu .env dosyasından oku
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE || '',
  },

  // Open Graph (Social Media)
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://elsdreamfactory.com",
    title: "El's Dream Factory | El Yapımı Seramik & Hediye",
    description: "Sevimli kedi figürleri, el yapımı seramik kupalar ve dekoratif objeler. Sevdiklerinize özel, sanatsal hediyeler keşfedin.",
    siteName: "El's Dream Factory",
    images: [
      {
        url: "https://elsdreamfactory.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "El's Dream Factory - El Yapımı Seramik Ürünler ve Hediyeler",
      },
      {
        url: "https://elsdreamfactory.com/instagram-image.png",
        width: 1080,
        height: 1080,
        alt: "El's Dream Factory - El Yapımı Seramik",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "El's Dream Factory | El Yapımı Seramik & Hediye",
    description: "Sevimli seramik kedi figürleri, el yapımı kupalar ve dekoratif objeler. Sanatsal hediyeler keşfedin.",
    images: ["https://elsdreamfactory.com/twitter-image.png"],
  },

  // Additional Metadata
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Canonical (for Next.js)
  metadataBase: new URL("https://elsdreamfactory.com"),
  alternates: {
    canonical: "https://elsdreamfactory.com",
  },

  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },

  authors: [
    {
      name: "El's Dream Factory",
      url: "https://elsdreamfactory.com",
    },
  ],

  creator: "Elif Koçberber",
  publisher: "El's Dream Factory",
  category: "El Yapımı Seramik & Hediye",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        {/* JSON-LD: Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "El's Dream Factory",
              alternateName: "Els Dream Factory",
              url: "https://elsdreamfactory.com",
              logo: "https://elsdreamfactory.com/logo.png",
              description: "El yapımı seramik ürünler, sevimli kedi figürleri, dekoratif objeler ve özel hediyeler. Benzersiz sanat eserleri.",
              foundingDate: "1994",
              foundingLocation: {
                "@type": "Place",
                name: "Türkiye",
              },
              sameAs: [
                "https://www.instagram.com/elsdreamfactory",
                "https://www.facebook.com/elsdreamfactory",
                "https://www.pinterest.com/elsdreamfactory",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Customer Service",
                email: "elsdreamfactory@gmail.com",
                availableLanguage: ["Turkish", "English"],
              },
            }),
          }}
        />

        {/* JSON-LD: WebSite with Search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "El's Dream Factory",
              url: "https://elsdreamfactory.com",
              description: "El yapımı seramik ürünler ve hediyeler",
              inLanguage: "tr",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://elsdreamfactory.com/search?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        {/* JSON-LD: LocalBusiness (Yerel SEO) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              name: "El's Dream Factory",
              image: "https://elsdreamfactory.com/og-image.png",
              url: "https://elsdreamfactory.com",
              description: "El yapımı seramik ürünler, kedi figürleri, dekoratif objeler ve özel hediye seçenekleri",
              address: {
                "@type": "PostalAddress",
                addressCountry: "TR",
              },
              priceRange: "₺₺",
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                opens: "09:00",
                closes: "18:00",
              },
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "El Yapımı Seramik Koleksiyonu",
                itemListElement: [
                  {
                    "@type": "OfferCatalog",
                    name: "Seramik Kedi Figürleri",
                  },
                  {
                    "@type": "OfferCatalog",
                    name: "El Yapımı Seramik Kupalar",
                  },
                  {
                    "@type": "OfferCatalog",
                    name: "Dekoratif Seramik Objeler",
                  },
                  {
                    "@type": "OfferCatalog",
                    name: "Seramik Hediye Setleri",
                  },
                ],
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${playfair.variable} antialiased`}
      >
        <AdminProvider>
          <UserProvider>
          <FavoritesProvider>
          <CartProvider>
            <MetaPixel />
            <CookieConsent />
            <VisitorTracker />
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="grow animate-page-enter">
                {children}
              </main>
              <Footer />
              <ScrollToTop />
            </div>
            <Analytics />
          </CartProvider>
          </FavoritesProvider>
          </UserProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
