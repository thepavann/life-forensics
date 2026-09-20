import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { getForensicsData, type ForensicsDataset } from '../lib/analyzer';
import { useForensicsData } from '../hooks/useForensicsData';
import { Navbar, type ActiveTab } from '../components/Navbar';
import { EntryHeroModal } from '../components/EntryHeroModal';
import { ReceiptDetailModal } from '../components/ReceiptDetailModal';
import { FindMissedModal } from '../components/FindMissedModal';
import { GlobalSearchModal } from '../components/GlobalSearchModal';
import { DatasetUploadModal } from '../components/DatasetUploadModal';

const StoryView = lazy(() => import('../views/StoryView').then(module => ({ default: module.StoryView })));
const AtlasView = lazy(() => import('../views/AtlasView').then(module => ({ default: module.AtlasView })));
const ChaptersView = lazy(() => import('../views/ChaptersView').then(module => ({ default: module.ChaptersView })));
const ReceiptsView = lazy(() => import('../views/ReceiptsView').then(module => ({ default: module.ReceiptsView })));
const InvestigationView = lazy(() => import('../views/InvestigationView').then(module => ({ default: module.InvestigationView })));

function ViewFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-live="polite">
      <div className="text-sm text-zinc-500">Loading investigation view…</div>
    </div>
  );
}

export function AppShell() {
  const { data, error, isLoading, load } = useForensicsData();
  const [activeTab, setActiveTab] = useState<ActiveTab>('story');
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [showEntryHero, setShowEntryHero] = useState<boolean>(() => !sessionStorage.getItem('lf_hero_dismissed'));
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFindMissedOpen, setIsFindMissedOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
      if (event.key === '/') {
        event.preventDefault();
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
      root.style.setProperty('--lf-scroll-progress', progress * 100 + '%');
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
    if (receiptIds.length > 0) setSelectedReceiptId(receiptIds[0]);
    handleTabChange('atlas');
  };

  const handleDatasetLoaded = async (raw: Parameters<typeof getForensicsData>[0]) => {
    setUploadLoading(true);
    await load(raw);
    setUploadLoading(false);
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center px-6" role="status" aria-live="polite">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-5 w-12 h-12 rounded-2xl border border-zinc-700 bg-zinc-900 flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
          </div>
          <h1 className="text-lg font-semibold">LIFE//FORENSICS</h1>
          <p className="mt-2 text-sm text-zinc-400">{error || 'Loading the evidence layer…'}</p>
          {error && (
            <button type="button" onClick={() => window.location.reload()} className="mt-5 px-4 py-2 rounded-lg bg-white text-zinc-950 text-sm font-medium">
              Reload
            </button>
          )}
        </div>
      </div>
    );
  }

  const selectedReceipt = selectedReceiptId ? data.receiptMap.get(selectedReceiptId) || null : null;

  return (
    <div className="lf-app-shell min-h-screen text-[#f4f4f6] flex flex-col font-sans selection:bg-zinc-700 selection:text-white">
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

      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onFindMissed={() => setIsFindMissedOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onUploadDataset={() => setIsUploadOpen(true)}
        receiptCount={data.statistics.totalReceipts}
      />

      {uploadLoading && (
        <div className="fixed top-16 left-0 right-0 z-50 h-0.5 bg-emerald-400 animate-pulse" role="status" aria-live="polite" aria-label="Analyzing uploaded dataset" />
      )}

      <div className="lf-scroll-progress" aria-hidden="true" />

      <main className="flex-1 w-full lf-main-stage">
        <Suspense fallback={<ViewFallback />}>
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
        </Suspense>
      </main>

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

      <FindMissedModal
        isOpen={isFindMissedOpen}
        onClose={() => setIsFindMissedOpen(false)}
        discoveries={data.discoveries}
        receiptMap={data.receiptMap}
        onSelectReceipt={id => setSelectedReceiptId(id)}
        onExploreInAtlas={() => handleTabChange('atlas')}
        onExploreChapter={handleOpenChapter}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        receipts={data.receipts}
        onSelectReceipt={id => setSelectedReceiptId(id)}
      />

      <DatasetUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onDatasetLoaded={handleDatasetLoaded}
      />
    </div>
  );
}
