"use client";
import "./globals.css";
import Header from "@/components/header/Header";
import dynamic from "next/dynamic";

const CartProvider = dynamic(() => import('@/context/CartContext').then(mod => mod.CartProvider), { ssr: false });
const WishlistProvider = dynamic(() => import('@/context/WishlistContext').then(mod => mod.WishlistProvider), { ssr: false });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white">
        <div className="max-w-[1600px] mx-auto w-full px-4 py-4">
          <CartProvider>
            <WishlistProvider>
              <Header />
              {children}
            </WishlistProvider>
          </CartProvider>
        </div>
      </body>
    </html>

  );
}
