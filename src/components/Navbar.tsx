// src/components/Navbar.tsx
import React, { useState } from 'react';
import { Sparkles, Search, Compass, BookOpen, Layers, GitFork, Menu, X, BrainCircuit } from 'lucide-react';

export type ActiveTab = 'story' | 'atlas' | 'chapters' | 'receipts' | 'investigation';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onFindMissed: () => void;
  onOpenSearch: () => void;
  receiptCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onFindMissed,
  onOpenSearch,
  receiptCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'story', label: 'Story', icon: <BookOpen size={15} /> },
    { id: 'atlas', label: 'Atlas', icon: <GitFork size={15} /> },
    { id: 'chapters', label: 'Chapters', icon: <Layers size={15} /> },
    { id: 'receipts', label: 'Receipts', icon: <Compass size={15} /> },
    { id: 'investigation', label: 'Investigate', icon: <BrainCircuit size={15} /> }
  ];

  return (
    <header className="lf-navbar sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#09090b]/80 backdrop-blur-md">
      <div className="lf-nav-inner max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand & Status Pill */}
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => onTabChange('story')}
            className="lf-brand-mark group flex items-center gap-3 text-left"
            aria-label="Life Forensics — Story"
          >
            <span className="lf-brand-icon" aria-hidden="true">
              <img src="/lf-app-icon.png" alt="" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="lf-brand-wordmark">LIFE <i>//</i> FORENSICS</span>
              <span className="lf-brand-tagline hidden sm:block">YOUR LIFE, IN RECEIPTS.</span>
            </span>
          </button>

          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800/80 text-[11px] font-mono text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{receiptCount} receipts analyzed</span>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 bg-zinc-900/60 p-1 rounded-xl border border-zinc-800/60">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/60'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Utility Actions */}
        <div className="flex items-center space-x-2">
          {/* Find Something I Missed Action */}
          <button
            onClick={onFindMissed}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/90 text-xs font-medium text-amber-300 hover:text-amber-200 transition-all cursor-pointer"
            title="Find an unexpected connection"
          >
            <Sparkles size={14} className="text-amber-400 animate-spin-slow" />
            <span className="hidden sm:inline">Find something I missed</span>
            <span className="sm:hidden">Discover</span>
          </button>

          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800/80 text-xs text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            title="Search receipts (Press /)"
          >
            <Search size={14} />
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-800 rounded border border-zinc-700/60">
              /
            </kbd>
          </button>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="lf-mobile-navigation"
            className="md:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div id="lf-mobile-navigation" className="md:hidden border-t border-zinc-800/80 bg-[#0d0d12] px-4 py-3 space-y-1 animate-slide-down">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                onTabChange(tab.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                activeTab === tab.id
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
          <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400 px-3 py-1">
            <span>Status:</span>
            <span className="text-emerald-400 font-mono">{receiptCount} receipts analyzed</span>
          </div>
        </div>
      )}
    </header>
  );
};
