import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CeramicCartContext";
import { AdminProvider } from "@/context/AdminContext";
import { Header, Footer } from "@/components";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E-Commerce - Kaliteli Ürünler",
  description: "Modern e-ticaret sitesi - Elektronik ve aksesuarlar",
  keywords: "e-commerce, alışveriş, elektronik",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <AdminProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow max-w-7xl mx-auto w-full px-4">
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
