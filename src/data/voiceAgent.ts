// Voice AI Agent case study — all figures come from measured runs (ElevenLabs
// metrics API, agent SQLite logs, and a scripted variant benchmark).

/* ─── Latency breakdown: end of speech → first audio (median, seconds) ─── */
export interface LatencyStage {
  label: string;
  note: string;
  detection: number;   // end-of-speech detection
  agent: number;       // voice service + agent to first sentence
  total: number;       // remainder = speech synthesis + transport
}

export const latencyStages: LatencyStage[] = [
  { label: 'Baseline', note: 'Shared agent, all tools', detection: 1.4, agent: 4.1, total: 6.4 },
  { label: 'Lean instance', note: 'Voice-only agent, 4 tools', detection: 0.7, agent: 2.9, total: 4.1 },
  { label: 'Streaming tweaks', note: 'Sentence chunking tuned', detection: 1.0, agent: 2.7, total: 4.3 },
  { label: 'Speculative turn', note: 'Reply prepared before you finish', detection: 0.7, agent: 2.6, total: 3.9 },
];

/* ─── Telephony comparison: end of speech → first audio (seconds, 2 runs each) ─── */
export const telephonyRuns = [
  { question: 'General question', engine: [3.93, 4.14], agents: [3.94, 4.43] },
  { question: 'Phone number & amount', engine: [3.08, 3.84], agents: [3.19, 3.32] },
  { question: 'Tool call: revenue', engine: [8.53, 11.64], agents: [7.67, 8.52] },
  { question: 'Tool call: league results', engine: [10.07, 9.13], agents: [13.47, 11.14] },
  { question: '“What time is it?”', engine: [11.95, 12.38], agents: [29.2, 35.96], highlight: true },
];

/* ─── Local model side quest: 15 sample messages, 4 fields each ─── */
export const localModels = [
  { name: 'Gemma 4 E2B', quant: 'QAT', correct: 15, median: 5.8, ram: 5.3, tps: 19.5, best: true },
  { name: 'Qwen 3.5 2B', quant: 'Q4_K_M', correct: 10, median: 4.8, ram: 3.0, tps: 21.1 },
  { name: 'Qwen 3.5 4B', quant: 'Q4_K_M', correct: 10, median: 11.5, ram: 5.2, tps: 10.5 },
];

export const longInput = [
  { tokens: '1.3k', seconds: 25 },
  { tokens: '2.1k', seconds: 40 },
  { tokens: '4.2k', seconds: 82 },
  { tokens: '8.1k', seconds: 172 },
  { tokens: '16.1k', seconds: 396 },
];

/* ─── Other deliverables ─── */
export const alsoShipped = [
  { title: 'Agent identity', text: 'The agent became “Jarvis” in chat and voice, with global instructions documented and verified.' },
  { title: 'Files round-trip plan', text: 'How the agent can hand back edited files, and why Word/Excel formatting can’t survive.' },
  { title: 'Ops hygiene', text: 'Backups, rollbacks and a port audit on a shared production server.' },
];
