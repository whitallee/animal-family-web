import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Providers from "@/components/Providers";

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-stone-900 text-stone-50`}>
        <Providers>
          {/* emerald, teal, and stone palettes */}
          <main className="flex flex-col items-center max-w-screen-sm mx-auto">
            {children}
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
