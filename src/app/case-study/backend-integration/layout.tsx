import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Backend Integration — Case Study",
  description:
    "Backend infrastructure for an e-commerce platform: authentication, sessions and complete audit trails with PostgreSQL and Drizzle ORM.",
  alternates: { canonical: "/case-study/backend-integration" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
