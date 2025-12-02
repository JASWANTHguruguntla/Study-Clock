import React from 'react';
import { Palette, Scan, RefreshCcw } from 'lucide-react';
import { ClockView } from '../types';

interface ControlsProps {
  currentView: ClockView;
  is24Hour: boolean;
  onToggleView: () => void;
  onCycleTheme: () => void;
  onToggleFormat: () => void;
  onToggleFullScreen: () => void;
  currentThemeName: string;
  isVisible: boolean;
}

const Controls: React.FC<ControlsProps> = ({ 
  currentView, 
  is24Hour,
  onToggleView, 
  onCycleTheme,
  onToggleFormat,
  onToggleFullScreen,
  currentThemeName,
  isVisible
}) => {
  return (
    <div 
      className={`
        fixed bottom-8 right-8 flex flex-row gap-6 z-50
        transition-all duration-500 ease-in-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
      `}
    >
      {/* 24h Toggle */}
      <button
        onClick={onToggleFormat}
        className="
          group relative flex items-center justify-center w-12 h-12
          text-[var(--muted)] hover:text-[var(--accent)] hover:scale-110
          focus:outline-none focus:text-[var(--accent)]
          transition-all duration-300
        "
        aria-label={`Switch to ${is24Hour ? '12-hour' : '24-hour'} format`}
        title="Toggle 12h/24h"
      >
        <span 
          className="text-3xl leading-none tracking-tighter" 
          style={{ fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif' }}
        >
          24h
        </span>
      </button>

      {/* Theme Cycle */}
      <button
        onClick={onCycleTheme}
        className="
          group relative flex items-center justify-center w-12 h-12
          text-[var(--muted)] hover:text-[var(--accent)] hover:scale-110
          focus:outline-none focus:text-[var(--accent)]
          transition-all duration-300
        "
        aria-label={`Current theme: ${currentThemeName}. Click to cycle theme.`}
        title="Change Theme"
      >
        <Palette size={32} strokeWidth={2.5} />
      </button>

      {/* View Toggle (Switch/Cycle Icon) */}
      <button
        onClick={onToggleView}
        className="
          group relative flex items-center justify-center w-12 h-12
          text-[var(--muted)] hover:text-[var(--accent)] hover:rotate-180
          focus:outline-none focus:text-[var(--accent)]
          transition-all duration-500
        "
        aria-label={`Switch to ${currentView === ClockView.ANALOGUE ? 'Digital' : 'Analogue'} view`}
        title="Toggle Clock View"
      >
        <RefreshCcw size={32} strokeWidth={2.5} />
      </button>

      {/* Full Screen Toggle (Corners Icon) */}
      <button
        onClick={onToggleFullScreen}
        className="
          group relative flex items-center justify-center w-12 h-12
          text-[var(--muted)] hover:text-[var(--accent)] hover:scale-110
          focus:outline-none focus:text-[var(--accent)]
          transition-all duration-300
        "
        aria-label="Toggle Fullscreen"
        title="Fullscreen"
      >
        <Scan size={32} strokeWidth={2.5} />
      </button>
    </div>
  );
};

export default Controls;