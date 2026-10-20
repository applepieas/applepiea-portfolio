import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Voice AI Agent — Case Study",
  description:
    "A real-time Czech voice mode for a company's in-house AI agent. Architecture, latency profiling (6.4 s → 3.9 s) and a data-backed telephony decision.",
  alternates: { canonical: "/case-study/voice-agent" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
