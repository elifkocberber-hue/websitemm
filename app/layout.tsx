import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CeramicCartContext";
import { AdminProvider } from "@/context/AdminContext";
import { Header, Footer } from "@/components";
import { CustomCursor } from "@/components/CustomCursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // Basic SEO
  title: "El's Dream Factory | Handmade Ceramic Products & Home Decor",
  description: "Discover beautiful handmade ceramic products, pottery, and home décor items. High-quality Turkish ceramics crafted with care.",
  keywords: "ceramic, pottery, handmade, home decor, Turkish ceramics, seramik, el yapımı",
  
  // Verification
  verification: {
    google: "google_verification_code_here", // Google Search Console
  },

  // Open Graph (Social Media)
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://elsdreamfactory.com",
    title: "El's Dream Factory | Handmade Ceramic Products",
    description: "Discover beautiful handmade ceramic products and home décor items.",
    siteName: "El's Dream Factory",
    images: [
      {
        url: "https://elsdreamfactory.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "El's Dream Factory - Handmade Ceramics",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "El's Dream Factory | Handmade Ceramics",
    description: "Beautiful handmade ceramic products and home décor.",
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

  authors: [
    {
      name: "El's Dream Factory",
      url: "https://elsdreamfactory.com",
    },
  ],

  creator: "Elif Koçberber",
  publisher: "El's Dream Factory",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "El's Dream Factory",
              url: "https://elsdreamfactory.com",
              logo: "https://elsdreamfactory.com/logo.png",
              description: "Handmade ceramic products and home décor",
              sameAs: [
                "https://www.instagram.com/elsdreamfactory",
                "https://www.facebook.com/elsdreamfactory",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Customer Service",
                email: "info@elsdreamfactory.com",
                telephone: "+90-555-123-4567",
              },
            }),
          }}
        />

        {/* Website Schema for Search Results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "El's Dream Factory",
              url: "https://elsdreamfactory.com",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://elsdreamfactory.com/search?q={search_term_string}",
                },
                query_input: "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        <AdminProvider>
          <CartProvider>
            <CustomCursor />
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="grow">
                {children}
              </main>
              <Footer />
            </div>
          </CartProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
// Cache bust: 1772315049
