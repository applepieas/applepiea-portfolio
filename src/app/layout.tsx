import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/providers/LenisProvider";
import GSAPProvider from "@/components/providers/GSAPProvider";
import TransitionProvider from "@/components/providers/TransitionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pavel Rosenberg | Designer & Developer",
  description: "18-year-old designer and developer from Prague. Designer and Developer.",
  icons: [
    {
      rel: "icon",
      url: "/favicon-light.png",
      media: "(prefers-color-scheme: light)",
    },
    {
      rel: "icon",
      url: "/favicon-dark.png",
      media: "(prefers-color-scheme: dark)",
    },
  ],
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
            </TransitionProvider>
          </GSAPProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
