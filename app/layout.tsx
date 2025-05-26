import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Providers from "@/components/Providers";
import BottomNav from "@/components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brindle - Animal Family",
  description: "Brindle helps you manage your countless pets' needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-stone-900 text-stone-50 h-[100.1vh]`}>
        <script dangerouslySetInnerHTML={{ __html: `window.scrollBy(0, 1);` }} />
        <Providers>
          {/* emerald, teal, and stone palettes */}
          <main className="flex flex-col items-center h-[calc(100vh-2rem)] overflow-y-auto overflow-x-hidden p-4">
            {children}
            <BottomNav />
          </main>
          {/* <footer className="text-center text-xs text-stone-500">
            <p>
              &copy; {new Date().getFullYear()} Brindle - Animal Family. All rights reserved.
            </p>
          </footer> */}
        </Providers>
      </body>
    </html>
  );
}
