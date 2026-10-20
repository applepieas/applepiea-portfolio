'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { codeSlides as slides } from '@/data/codeExamples';

// Lazy-load the syntax highlighter — it's ~90kB gzipped and only visible
// when the user scrolls to the Stack section. A skeleton placeholder
// matches the dark code area so there's no layout shift.
const SyntaxHighlighter = dynamic(
  () => import('react-syntax-highlighter').then((mod) => mod.Prism),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          margin: 0,
          padding: '1rem 1.5rem',
          height: '100%',
          background: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(0,0,0,0.2)',
          fontSize: '13px',
          fontFamily: '"JetBrains Mono", "Fira Code", monospace',
        }}
      >
        Loading...
      </div>
    ),
  }
);

/* ──────────────────────────────────────────────
   Custom Light Theme (VS Code–inspired)
   ────────────────────────────────────────────── */
const codeTheme: { [key: string]: React.CSSProperties } = {
  'code[class*="language-"]': { color: '#383a42' },
  'pre[class*="language-"]': { color: '#383a42' },
  comment: { color: '#a0a1a7', fontStyle: 'italic' },
  prolog: { color: '#a0a1a7' },
  doctype: { color: '#a0a1a7' },
  cdata: { color: '#a0a1a7' },
  punctuation: { color: '#383a42' },
  property: { color: '#e45649' },
  tag: { color: '#e45649' },
  boolean: { color: '#986801' },
  number: { color: '#986801' },
  constant: { color: '#986801' },
  symbol: { color: '#986801' },
  deleted: { color: '#e45649' },
  selector: { color: '#50a14f' },
  'attr-name': { color: '#986801' },
  string: { color: '#50a14f' },
  char: { color: '#50a14f' },
  builtin: { color: '#c18401' },
  inserted: { color: '#50a14f' },
  operator: { color: '#0184bc' },
  entity: { color: '#0184bc' },
  url: { color: '#0184bc' },
  'language-css .token.string': { color: '#0184bc' },
  'style .token.string': { color: '#0184bc' },
  atrule: { color: '#a626a4' },
  'attr-value': { color: '#50a14f' },
  keyword: { color: '#a626a4' },
  function: { color: '#4078f2' },
  'class-name': { color: '#c18401' },
  regex: { color: '#986801' },
  important: { color: '#a626a4', fontWeight: 'bold' as const },
  variable: { color: '#e45649' },
  bold: { fontWeight: 'bold' as const },
  italic: { fontStyle: 'italic' as const },
  'template-string': { color: '#50a14f' },
  'template-punctuation': { color: '#50a14f' },
  'function-variable': { color: '#4078f2' },
  parameter: { color: '#383a42' },
  interpolation: { color: '#e45649' },
  'punctuation.interpolation-punctuation': { color: '#e45649' },
};


/* ──────────────────────────────────────────────
   Summary Card (Left)
   ────────────────────────────────────────────── */

export function CodeSummary({ className = '' }: { className?: string }) {
  const { slide, activeIndex, goTo, goNext, goPrev } = useCarousel();

  return (
    <div
      className={`rounded-lg lg:rounded-xl p-5 lg:p-8 xl:p-10 flex flex-col justify-between ${className}`}
      style={{ backgroundColor: 'var(--color-foreground)' }}
    >
      {/* Top: heading + summary */}
      <div className="flex flex-col gap-3">
        <h3
          className="text-xs lg:text-[clamp(14px,0.8vw,18px)] uppercase font-medium tracking-wider"
          style={{ color: 'var(--color-muted)' }}
        >
          {slide.heading}
        </h3>
        <p
          className="text-[clamp(16px,1.3vw,30px)] font-medium leading-[1.4]"
          style={{ color: 'var(--color-background)' }}
        >
          {slide.summary}
        </p>
      </div>

      {/* Bottom: navigation */}
      <div className="flex flex-col gap-4">

        {/* Arrows + Dots */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={goPrev}
            disabled={activeIndex === 0}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer disabled:opacity-20 disabled:cursor-default hover:bg-white/10"
            aria-label="Previous slide"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(250,250,249,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="flex items-center gap-2.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${i === activeIndex
                  ? 'w-6'
                  : 'w-2 hover:bg-white/30'
                  }`}
                style={{
                  backgroundColor: i === activeIndex ? 'var(--color-background)' : 'rgba(250,250,249,0.15)'
                }}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === activeIndex ? 'true' : undefined}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            disabled={activeIndex === slides.length - 1}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer disabled:opacity-20 disabled:cursor-default hover:bg-white/10"
            aria-label="Next slide"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(250,250,249,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Code Snippet Card (Right) — macOS Window
   ────────────────────────────────────────────── */

export function CodeSnippet({ className = '' }: { className?: string }) {
  const { slide } = useCarousel();

  /* Turn file path into breadcrumb segments */
  const breadcrumb = slide.filePath.split('/');

  return (
    <div
      className={`rounded-lg lg:rounded-xl flex flex-col overflow-hidden ${className}`}
      style={{
        backgroundColor: 'var(--color-background)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.12), 0 1px 6px rgba(0,0,0,0.08)',
      }}
    >
      {/* ── Title Bar ── */}
      <div
        className="flex items-center gap-3 px-4 py-2.5 flex-shrink-0"
        style={{ backgroundColor: 'var(--color-secondary)', borderBottom: '1px solid var(--color-secondary)' }}
      >
        {/* Traffic light buttons */}
        <div className="flex items-center gap-[6px] flex-shrink-0">
          <span className="w-[12px] h-[12px] rounded-full" style={{ backgroundColor: '#ff5f57' }} />
          <span className="w-[12px] h-[12px] rounded-full" style={{ backgroundColor: '#febc2e' }} />
          <span className="w-[12px] h-[12px] rounded-full" style={{ backgroundColor: '#28c840' }} />
        </div>

        {/* Breadcrumb path */}
        <div className="flex items-center gap-1 overflow-hidden">
          {breadcrumb.map((segment, i) => (
            <span key={i} className="flex items-center gap-1 flex-shrink-0">
              {i > 0 && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 6 15 12 9 18" />
                </svg>
              )}
              <span
                className="text-[11px] lg:text-xs whitespace-nowrap"
                style={{
                  color: i === breadcrumb.length - 1 ? '#333' : '#888',
                  fontWeight: i === breadcrumb.length - 1 ? 600 : 400,
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                }}
              >
                {segment}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Code Content ── */}
      <div className="flex-1 overflow-y-auto min-h-0" data-lenis-prevent>
        <SyntaxHighlighter
          language={slide.language}
          style={codeTheme}
          customStyle={{
            margin: 0,
            padding: '1rem 1.5rem',
            borderRadius: 0,
            fontSize: 'clamp(12px, 0.75vw, 15px)',
            lineHeight: 1.75,
            fontWeight: 500,
            background: 'transparent',
            fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
            height: '100%',
          }}
          showLineNumbers
          lineNumberStyle={{
            minWidth: '2.5em',
            paddingRight: '1.25em',
            color: '#c0c0c0',
            fontStyle: 'normal',
            fontWeight: 450,
          }}
          codeTagProps={{
            style: { fontWeight: 450 },
          }}
        >
          {slide.code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Shared Carousel State (hook)
   Both cards share the same active slide index
   via a simple module-level state + listeners.
   ────────────────────────────────────────────── */

type Listener = () => void;
let _activeIndex = 0;
const _listeners = new Set<Listener>();

function setGlobalIndex(index: number) {
  const next = Math.max(0, Math.min(index, slides.length - 1));
  if (next === _activeIndex) return;
  _activeIndex = next;
  _listeners.forEach((fn) => fn());
}

function useCarousel() {
  const [activeIndex, setActiveIndex] = useState(_activeIndex);
  const touchStartX = useRef(0);

  useEffect(() => {
    const listener = () => setActiveIndex(_activeIndex);
    _listeners.add(listener);
    return () => { _listeners.delete(listener); };
  }, []);

  const goTo = useCallback((i: number) => setGlobalIndex(i), []);
  const goNext = useCallback(() => setGlobalIndex(_activeIndex + 1), []);
  const goPrev = useCallback(() => setGlobalIndex(_activeIndex - 1), []);

  /* Keyboard */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setGlobalIndex(_activeIndex + 1);
      if (e.key === 'ArrowLeft') setGlobalIndex(_activeIndex - 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeIndex]);

  return {
    slide: slides[activeIndex],
    activeIndex,
    goTo,
    goNext,
    goPrev,
    touchStartX,
  };
}
