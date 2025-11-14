import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MobileNav } from "@/components/layout/MobileNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SA Schools - Browse South African Schools",
  description: "Browse, search, and verify South African schools information",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MobileNav />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
