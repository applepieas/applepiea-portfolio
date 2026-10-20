'use client';

import CaseStudyLayout from "@/components/layout/CaseStudyLayout";
import { usePageTransition } from "@/components/providers/TransitionProvider";
import { ChatShot } from "@/components/portfolio/voice-agent/ProductShots";
import VoiceStats from "@/components/portfolio/voice-agent/VoiceStats";
import VoiceArchitecture from "@/components/portfolio/voice-agent/VoiceArchitecture";
import LatencyBreakdown from "@/components/portfolio/voice-agent/LatencyBreakdown";
import TelephonyComparison from "@/components/portfolio/voice-agent/TelephonyComparison";
import LocalModels from "@/components/portfolio/voice-agent/LocalModels";
import AlsoShipped from "@/components/portfolio/voice-agent/AlsoShipped";
import VoiceCta from "@/components/portfolio/voice-agent/VoiceCta";

export default function VoiceAgentCaseStudy() {
  const { isContentReady } = usePageTransition();

  return (
    <CaseStudyLayout
      title="Voice AI Agent"
      year="2026"
      services={['Voice AI', 'ElevenLabs', 'SvelteKit', 'WebSockets', 'Latency Profiling', 'Traefik', 'Docker', 'n8n']}
      summary="Talk to a company's in-house AI agent in natural Czech, and interrupt it like a person. I built the voice layer on top of the existing chat, cut response time by 39%, and gave the client hard data for their telephony decision."
      isContentReady={isContentReady}
    >
      <div className="flex flex-col gap-4 lg:gap-5">

        {/* Proof first — the real product */}
        <ChatShot />

        {/* Headline results */}
        <VoiceStats />


        {/* How it works */}
        <VoiceArchitecture />

        {/* How fast it got */}
        <LatencyBreakdown />

        {/* Data-backed decision */}
        <TelephonyComparison />

        {/* Side quest */}
        <LocalModels />

        <AlsoShipped />

        {/* For businesses that want the same */}
        <VoiceCta />

      </div>
    </CaseStudyLayout>
  );
}
