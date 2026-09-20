// src/App.tsx
import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getForensicsData } from './lib/analyzer';
import { Navbar, type ActiveTab } from './components/Navbar';
import { EntryHeroModal } from './components/EntryHeroModal';
import { ReceiptDetailModal } from './components/ReceiptDetailModal';
import { FindMissedModal } from './components/FindMissedModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';

import { StoryView } from './views/StoryView';
import { AtlasView } from './views/AtlasView';
import { ChaptersView } from './views/ChaptersView';
import { ReceiptsView } from './views/ReceiptsView';
import { InvestigationView } from './views/InvestigationView';

export function App() {
  const data = useMemo(() => getForensicsData(), []);

  const [activeTab, setActiveTab] = useState<ActiveTab>('story');
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);

  const [showEntryHero, setShowEntryHero] = useState<boolean>(() => {
    return !sessionStorage.getItem('lf_hero_dismissed');
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFindMissedOpen, setIsFindMissedOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    // Keep navigation deterministic. Native scrolling remains enabled and each
    // view starts at the top without triggering smooth-scroll inertia.
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when typing in input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.key === '/') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const root = document.documentElement;
      const max = Math.max(root.scrollHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, window.scrollY / max));
      document.documentElement.style.setProperty('--lf-scroll-progress', `${progress * 100}%`);
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  const handleDismissEntryHero = () => {
    setShowEntryHero(false);
    sessionStorage.setItem('lf_hero_dismissed', 'true');
  };

  const handleOpenChapter = (chapterId: string) => {
    setActiveChapterId(chapterId);
    handleTabChange('chapters');
  };

  const handleOpenAtlasWithFocus = (receiptIds: string[]) => {
    if (receiptIds.length > 0) {
      setSelectedReceiptId(receiptIds[0]);
    }
    handleTabChange('atlas');
  };

  const selectedReceipt = selectedReceiptId ? data.receiptMap.get(selectedReceiptId) || null : null;

  return (
    <div className="lf-app-shell min-h-screen text-[#f4f4f6] flex flex-col font-sans selection:bg-zinc-700 selection:text-white">
      {/* Entry Hero Experience on First Launch */}
      {showEntryHero && (
        <EntryHeroModal
          statistics={data.statistics}
          onDiscoverStory={() => {
            handleDismissEntryHero();
            setActiveTab('story');
          }}
          onExploreReceipts={() => {
            handleDismissEntryHero();
            setActiveTab('receipts');
          }}
        />
      )}

      {/* Persistent Global Header */}
      <Navbar
        activeTab={activeTab}
        onTabChange={tab => {
          handleTabChange(tab);
        }}
        onFindMissed={() => setIsFindMissedOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        receiptCount={data.statistics.totalReceipts}
      />

      <div className="lf-scroll-progress" aria-hidden="true" />

      {/* Main View Area. This remains a normal document flow container so wheel,
          trackpad and touch scrolling are never trapped by a nested viewport. */}
      <main className="flex-1 w-full lf-main-stage">
        <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {activeTab === 'story' && (
              <StoryView
                data={data}
                onSelectReceipt={id => setSelectedReceiptId(id)}
                onOpenChapter={handleOpenChapter}
                onOpenAtlasWithFocus={handleOpenAtlasWithFocus}
                onFindMissed={() => setIsFindMissedOpen(true)}
                onSwitchTab={handleTabChange}
              />
            )}

            {activeTab === 'atlas' && (
              <AtlasView
                data={data}
                onSelectReceipt={id => setSelectedReceiptId(id)}
                selectedReceiptId={selectedReceiptId}
              />
            )}

            {activeTab === 'chapters' && (
              <ChaptersView
                data={data}
                onSelectReceipt={id => setSelectedReceiptId(id)}
                initialChapterId={activeChapterId}
              />
            )}

            {activeTab === 'receipts' && (
              <ReceiptsView
                data={data}
                onSelectReceipt={id => setSelectedReceiptId(id)}
                searchInputRef={searchInputRef}
              />
            )}

            {activeTab === 'investigation' && (
              <InvestigationView
                data={data}
                onSelectReceipt={id => setSelectedReceiptId(id)}
              />
            )}
        </motion.div>
      </main>

      {/* Detail Slide-over / Modal */}
      <ReceiptDetailModal
        receipt={selectedReceipt}
        connections={data.connections}
        receiptMap={data.receiptMap}
        onClose={() => setSelectedReceiptId(null)}
        onSelectReceipt={id => setSelectedReceiptId(id)}
        onOpenChapter={handleOpenChapter}
        onViewInAtlas={id => {
          setSelectedReceiptId(id);
          handleTabChange('atlas');
        }}
      />

      {/* Find Something I Missed Spotlight Modal */}
      <FindMissedModal
        isOpen={isFindMissedOpen}
        onClose={() => setIsFindMissedOpen(false)}
        discoveries={data.discoveries}
        receiptMap={data.receiptMap}
        onSelectReceipt={id => setSelectedReceiptId(id)}
        onExploreInAtlas={_discId => {
          handleTabChange('atlas');
        }}
        onExploreChapter={handleOpenChapter}
      />

      {/* Global Quick Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        receipts={data.receipts}
        onSelectReceipt={id => setSelectedReceiptId(id)}
      />
    </div>
  );
}

export default App;
