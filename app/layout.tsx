import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";

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
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Brindle",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#065f46",
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
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
