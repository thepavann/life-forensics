import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowRight, CalendarDays, MapPin, ReceiptText } from 'lucide-react';
import type { LifeStatistics } from '../types/receipt';

interface EntryHeroModalProps {
  statistics: LifeStatistics;
  onDiscoverStory: () => void;
  onExploreReceipts: () => void;
}

function CountUp({ to, duration = 1100 }: { to: number; duration?: number }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * to));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <>{current.toLocaleString()}</>;
}

const ease = [0.22, 1, 0.36, 1] as const;

export const EntryHeroModal: React.FC<EntryHeroModalProps> = ({
  statistics,
  onDiscoverStory,
  onExploreReceipts
}) => {
  const pulse = statistics.activityPulse ?? [];

  const scrollToStory = () => {
    onDiscoverStory();
    requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }));
  };
  const bars = useMemo(() => {
    if (!pulse.length) return Array.from({ length: 36 }, (_, i) => 20 + ((i * 17) % 60));
    const max = Math.max(...pulse.map(p => p.count), 1);
    return pulse.slice(-42).map(p => Math.max(12, Math.round((p.count / max) * 100)));
  }, [pulse]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55 }}
      className="lf-entry relative z-20 w-full overflow-visible bg-[#07070a] text-white"
    >
      <div className="lf-entry-noise" />
      <div className="lf-entry-grid" />
      <div className="lf-entry-orb lf-entry-orb-a" />
      <div className="lf-entry-orb lf-entry-orb-b" />

      <div className="relative min-h-[100svh] px-5 py-5 sm:px-8 sm:py-7 lg:px-12">
        {/* top chrome */}
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="relative z-10 mx-auto flex max-w-[1500px] items-center justify-between"
        >
          <button onClick={scrollToStory} className="lf-entry-brand lf-entry-brand-logo" aria-label="Enter Life Forensics">
            <span className="lf-entry-brand-mark lf-entry-brand-mark-image"><img src="/lf-app-icon.png" alt="" /></span>
            <span className="lf-entry-brand-copy">
              <strong>LIFE <i>//</i> FORENSICS</strong>
              <small>YOUR LIFE, IN RECEIPTS.</small>
            </span>
          </button>
          <div className="hidden items-center gap-5 text-[10px] font-mono uppercase tracking-[0.2em] text-white/35 sm:flex">
            <span>Local forensic synthesis</span>
            <span className="h-px w-10 bg-white/10" />
            <span>Case 001</span>
          </div>
          <button onClick={onExploreReceipts} className="lf-entry-skip">
            Browse receipts <ArrowRight size={13} />
          </button>
        </motion.header>

        <main className="relative z-10 mx-auto grid min-h-[calc(100vh-120px)] max-w-[1500px] items-center gap-12 py-12 lg:grid-cols-[1.02fr_.98fr] lg:gap-20 lg:py-8">
          {/* editorial side */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } } }}
            className="max-w-3xl"
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: .65, ease } } }} className="mb-7 flex items-center gap-3">
              <span className="lf-entry-kicker"><span /> PRIVATE DIGITAL ARCHIVE</span>
              <span className="text-[10px] font-mono text-white/25">{statistics.dateRange.start} — {statistics.dateRange.end}</span>
            </motion.div>

            <motion.h1 variants={{ hidden: { opacity: 0, y: 28, filter: 'blur(8px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: .9, ease } } }} className="lf-entry-title">
              <span>YOUR LIFE</span>
              <em>leaves traces.</em>
            </motion.h1>

            <motion.p variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: .65, ease } } }} className="lf-entry-deck">
              Every receipt is a fragment. Every place is a thread. We reconstruct the pattern hidden inside the ordinary.
            </motion.p>

            <motion.div variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: .65, ease } } }} className="lf-entry-actions">
              <button onClick={scrollToStory} className="lf-entry-primary">
                <span>Enter the story</span><ArrowDownRight size={17} />
              </button>
              <button onClick={onExploreReceipts} className="lf-entry-secondary">
                <ReceiptText size={15} /><span>Inspect raw receipts</span>
              </button>
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: .7, delay: .1 } } }} className="lf-entry-metrics">
              <div><strong><CountUp to={statistics.totalReceipts} /></strong><span>signals</span></div>
              <i />
              <div><strong><CountUp to={statistics.uniquePlacesCount} /></strong><span>places</span></div>
              <i />
              <div><strong><CountUp to={statistics.totalConnections} /></strong><span>connections</span></div>
              <i />
              <div><strong><CountUp to={statistics.totalChapters} /></strong><span>chapters</span></div>
            </motion.div>
          </motion.section>

          {/* visual investigation side */}
          <motion.section
            initial={{ opacity: 0, x: 35, scale: .97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: .95, delay: .25, ease }}
            className="relative mx-auto w-full max-w-[700px]"
          >
            <div className="lf-casefile">
              <div className="lf-casefile-top">
                <div>
                  <span>ACTIVITY FIELD</span>
                  <strong>{statistics.dateRange.daysSpan.toLocaleString()} DAYS / {statistics.totalReceipts.toLocaleString()} SIGNALS</strong>
                </div>
                <div className="lf-live"><b /> LIVE SYNTHESIS</div>
              </div>

              <div className="lf-constellation" aria-hidden="true">
                <div className="lf-ring lf-ring-1" />
                <div className="lf-ring lf-ring-2" />
                <div className="lf-ring lf-ring-3" />
                <div className="lf-cross lf-cross-h" />
                <div className="lf-cross lf-cross-v" />
                <div className="lf-node lf-node-main"><span>YOU</span></div>
                <div className="lf-node lf-node-a"><span>HOME</span></div>
                <div className="lf-node lf-node-b"><span>CAFÉ</span></div>
                <div className="lf-node lf-node-c"><span>WORK</span></div>
                <div className="lf-node lf-node-d"><span>TRAVEL</span></div>
                <svg viewBox="0 0 600 430" className="lf-links">
                  <path d="M300 215 C230 150 185 125 130 105" />
                  <path d="M300 215 C370 150 430 135 492 110" />
                  <path d="M300 215 C235 285 195 315 118 338" />
                  <path d="M300 215 C380 280 425 315 500 340" />
                </svg>
                <div className="lf-particle p1" /><div className="lf-particle p2" /><div className="lf-particle p3" />
              </div>

              <div className="lf-signal-strip">
                <div className="lf-signal-label"><CalendarDays size={13} /> ACTIVITY DENSITY</div>
                <div className="lf-bars">
                  {bars.map((h, i) => <span key={i} style={{ height: `${h}%`, animationDelay: `${i * 24}ms` }} />)}
                </div>
              </div>

              <div className="lf-casefile-bottom">
                <div className="flex items-center gap-2"><MapPin size={13} /> {statistics.uniquePlacesCount.toLocaleString()} indexed locations</div>
                <div>Evidence model <strong>ACTIVE</strong></div>
              </div>
            </div>

            <div className="lf-floating-note lf-floating-note-a"><span>01</span><strong>Recurring anchor</strong><small>Repeated place signature detected</small></div>
            <div className="lf-floating-note lf-floating-note-b"><span>02</span><strong>Temporal shift</strong><small>Activity pattern changes over time</small></div>
          </motion.section>
        </main>

        <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05, duration: .7 }} className="relative z-10 mx-auto flex max-w-[1500px] items-center justify-between border-t border-white/[0.06] pt-4 text-[10px] font-mono uppercase tracking-[0.16em] text-white/25">
          <span>Individually, they mean very little.</span>
          <span className="hidden sm:inline">Together, they tell a story.</span>
          <span className="lf-entry-scroll-cue"><span className="lf-scroll-wheel" /> Scroll / enter</span>
        </motion.footer>
      </div>
    </motion.div>
  );
};
