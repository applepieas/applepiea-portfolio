import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Landing Pages — Case Study",
  description:
    "A collection of landing page designs showcasing composition, type hierarchy and brand expression.",
  alternates: { canonical: "/case-study/landing-pages" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
