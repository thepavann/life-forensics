// src/components/ReceiptIcon.tsx
import React from 'react';
import {
  Headphones,
  Film,
  MapPin,
  ShoppingBag,
  Camera,
  MessageSquare,
  Search,
  Calendar,
  FileText
} from 'lucide-react';
import type { ReceiptType } from '../types/receipt';

interface ReceiptIconProps {
  type: ReceiptType;
  className?: string;
  size?: number;
}

export const ReceiptIcon: React.FC<ReceiptIconProps> = ({ type, className = '', size = 16 }) => {
  switch (type) {
    case 'music':
      return <Headphones size={size} className={className} />;
    case 'movie':
      return <Film size={size} className={className} />;
    case 'place':
      return <MapPin size={size} className={className} />;
    case 'purchase':
      return <ShoppingBag size={size} className={className} />;
    case 'photo':
      return <Camera size={size} className={className} />;
    case 'message':
      return <MessageSquare size={size} className={className} />;
    case 'search':
      return <Search size={size} className={className} />;
    case 'event':
      return <Calendar size={size} className={className} />;
    case 'note':
    default:
      return <FileText size={size} className={className} />;
  }
};

export function getTypeBadgeClass(type: ReceiptType): string {
  switch (type) {
    case 'music':
      return 'badge-music border';
    case 'movie':
      return 'badge-movie border';
    case 'place':
      return 'badge-place border';
    case 'purchase':
      return 'badge-purchase border';
    case 'photo':
      return 'badge-photo border';
    case 'message':
      return 'badge-message border';
    case 'search':
      return 'badge-search border';
    case 'event':
      return 'badge-event border';
    case 'note':
    default:
      return 'badge-note border';
  }
}

export function getTypeHexColor(type: ReceiptType): string {
  switch (type) {
    case 'music':
      return '#34d399';
    case 'movie':
      return '#818cf8';
    case 'place':
      return '#fbbf24';
    case 'purchase':
      return '#2dd4bf';
    case 'photo':
      return '#fb7185';
    case 'message':
      return '#38bdf8';
    case 'search':
      return '#fb923c';
    case 'event':
      return '#c084fc';
    case 'note':
    default:
      return '#94a3b8';
  }
}
