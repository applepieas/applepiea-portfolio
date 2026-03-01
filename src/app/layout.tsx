import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/providers/LenisProvider";
import GSAPProvider from "@/components/providers/GSAPProvider";
import TransitionProvider from "@/components/providers/TransitionProvider";
import { SpeedInsights } from "@vercel/speed-insights/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pavelrosenberg.com"),

  title: {
    default: "Pavel Rosenberg — Designer & Developer",
    template: "%s | Pavel Rosenberg",
  },

  description:
    "Portfolio of Pavel Rosenberg — Prague-based UI/UX designer & full-stack developer. " +
    "Specialising in React, Next.js, TypeScript, and motion design.",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml", media: "(prefers-color-scheme: dark)" },
      { url: "/favicon-light.svg", type: "image/svg+xml", media: "(prefers-color-scheme: light)" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
    shortcut: "/favicon.ico",
  },

  openGraph: {
    type: "website",
    url: "https://pavelrosenberg.com",
    title: "Pavel Rosenberg — Designer & Developer",
    description:
      "Portfolio of Pavel Rosenberg — Prague-based UI/UX designer & full-stack developer. " +
      "Specialising in React, Next.js, TypeScript, and motion design.",
    siteName: "Pavel Rosenberg",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pavel Rosenberg — Designer & Developer",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Pavel Rosenberg — Designer & Developer",
    description:
      "Prague-based UI/UX designer & full-stack developer. " +
      "React, Next.js, TypeScript, motion design.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  // viewport-fit=cover is required for env(safe-area-inset-bottom) to
  // return the real safe area height on iOS and Android Chrome.
  // Without this the env() variable always resolves to 0.
  viewportFit: 'cover',
  width: 'device-width',
  initialScale: 1,
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
        <LenisProvider>
          <GSAPProvider>
            <TransitionProvider>
              {children}
              <SpeedInsights />
            </TransitionProvider>
          </GSAPProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
