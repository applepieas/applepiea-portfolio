'use client';

import { useRef } from 'react';
import { useChartReveal } from '@/hooks/useChartReveal';
import { BLUE, Eyebrow, PanelHeading } from './shared';

const nodes = {
  browser: { name: 'Browser', kicker: 'Mic & speaker', lines: ['Short-lived token only', 'Interrupt any time'] },
  speech: { name: 'ElevenLabs', kicker: 'Speech Engine', lines: ['Speech-to-text', 'Text-to-speech', 'Turn-taking'] },
  voice: { name: 'Voice service', kicker: 'SvelteKit · Node · WS', lines: ['Holds the keys', 'Streams the reply', 'Speaks per sentence', 'Czech pronunciation'], mine: true },
  agent: { name: 'Hermes agent', kicker: 'OpenAI-compatible API', lines: ['Unchanged', 'Tools, memory, skills', 'Internal network only'] },
  tools: { name: 'n8n tools', kicker: 'via MCP', lines: ['Revenue', 'League results', '…'] },
};

const notes = [
  { title: 'Keys stay home', text: 'The browser only gets a short-lived token.' },
  { title: 'One login', text: 'Reuses the chat’s sign-in. No new user database.' },
  { title: 'Agent untouched', text: 'Private network only, config unchanged.' },
  { title: 'No new ports', text: 'Behind the existing proxy under /voice.' },
]

function Node({ node }: { node: { name: string; kicker: string; lines: string[]; mine?: boolean } }) {
  return (
    <div
      data-pop
      className="relative flex-1 min-w-0 rounded-lg overflow-hidden bg-white"
      style={{
        border: node.mine ? `1.5px solid ${BLUE}` : '1px solid #E7E5E4',
        boxShadow: node.mine ? `0 0 0 4px ${BLUE}33, 0 4px 20px rgba(0,0,0,0.08)` : '0 2px 10px rgba(0,0,0,0.05)',
      }}
    >
      <div
        className="flex items-center justify-between gap-2 px-3 xl:px-4 py-2 xl:py-2.5"
        style={{ background: 'linear-gradient(135deg,#292524,#171717)' }}
      >
        <span className="text-[12px] xl:text-[clamp(12px,0.8vw,17px)] font-semibold tracking-wide text-(--color-background) truncate">
          {node.name}
        </span>
      </div>
      <div className="px-3 xl:px-4 py-2.5 xl:py-3 flex flex-col gap-1.5">
        {node.mine && (
          <span className="self-start text-[9px] xl:text-[clamp(9px,0.55vw,12px)] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded text-black" style={{ backgroundColor: BLUE }}>
            Built by me
          </span>
        )}
        <span className="text-[10px] xl:text-[clamp(10px,0.6vw,13px)] uppercase tracking-wider text-stone-500 font-mono truncate">
          {node.kicker}
        </span>
        {node.lines.map((line) => (
          <span key={line} className="text-[12px] xl:text-[clamp(12px,0.75vw,16px)] text-(--color-foreground) leading-snug">
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}

/* Nodes outside the server frame get the frame's padding so every node lines up */
function OuterSlot({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col lg:flex-1 min-w-0 lg:border-[1.5px] lg:border-transparent lg:pt-9 lg:pb-3 xl:pt-10 xl:pb-4">{children}</div>;
}

/* Animated dashed link — horizontal on desktop, vertical on mobile */
function FlowLink({ label }: { label: string }) {
  return (
    <div className="relative flex items-center justify-center shrink-0 h-10 lg:h-auto lg:w-[clamp(36px,3vw,72px)]">
      <span className="flow-line-y lg:hidden absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1.5px]" />
      <span className="flow-line-x hidden lg:block absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1.5px]" />
      <span className="relative z-10 text-[9px] xl:text-[clamp(9px,0.55vw,12px)] uppercase tracking-wider font-mono text-stone-500 bg-(--color-background) px-1.5 py-0.5 rounded lg:-translate-y-4 ml-16 lg:ml-0">
        {label}
      </span>
    </div>
  );
}

export default function VoiceArchitecture() {
  const ref = useRef<HTMLElement>(null);
  useChartReveal(ref);

  return (
    <section
      ref={ref}
      className="relative w-full lg:h-[57vw] rounded-lg lg:rounded-xl overflow-hidden p-5 lg:p-10 xl:p-14 flex flex-col justify-between gap-10"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      {/* Grid — matches the backend case study diagram */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: 'linear-gradient(#171717 1px,transparent 1px),linear-gradient(90deg,#171717 1px,transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative flex flex-col gap-3 max-w-3xl">
        <Eyebrow dark={false}>Architecture</Eyebrow>
        <PanelHeading dark={false}>A thin voice layer. The agent stays untouched.</PanelHeading>
      </div>

      {/* Flow */}
      <div className="relative flex flex-col lg:flex-row lg:items-stretch">
        <OuterSlot><Node node={nodes.browser} /></OuterSlot>
        <FlowLink label="audio" />
        <OuterSlot><Node node={nodes.speech} /></OuterSlot>
        <FlowLink label="text" />

        {/* Server boundary */}
        <div className="relative flex flex-col lg:flex-row lg:items-stretch lg:flex-[3.3] rounded-xl border-[1.5px] border-dashed border-stone-300 p-3 xl:p-4 pt-9 xl:pt-10">
          <span className="absolute top-2.5 xl:top-3 left-3 xl:left-4 text-[10px] xl:text-[clamp(10px,0.6vw,13px)] uppercase tracking-wider font-mono text-stone-500">
            Client VPS · Docker · behind Traefik
          </span>
          <Node node={nodes.voice} />
          <FlowLink label="SSE" />
          <Node node={nodes.agent} />
          <FlowLink label="MCP" />
          <Node node={nodes.tools} />
        </div>
      </div>

      {/* Notes */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        {notes.map((note, i) => (
          <div key={note.title} className="flex flex-col gap-1.5 border-t border-stone-300 pt-3">
            <span className="text-[11px] lg:text-[clamp(11px,0.65vw,14px)] font-mono text-stone-500">0{i + 1}</span>
            <span className="text-[15px] lg:text-[clamp(15px,1vw,22px)] font-semibold text-(--color-foreground)">{note.title}</span>
            <span className="text-[13px] lg:text-[clamp(13px,0.8vw,18px)] leading-snug text-stone-600">{note.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
