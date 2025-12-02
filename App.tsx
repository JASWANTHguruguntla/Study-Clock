import React, { useState, useEffect, useCallback, useRef } from 'react';
import { THEMES } from './constants';
import { ClockView } from './types';
import { useTime } from './hooks/useTime';
import { 
  getStoredThemeIndex, 
  setStoredThemeIndex, 
  getStoredView, 
  setStoredView,
  getStoredIs24Hour,
  setStoredIs24Hour
} from './services/storageService';
import DigitalClock from './components/DigitalClock';
import AnalogueClock from './components/AnalogueClock';
import Controls from './components/Controls';

const App: React.FC = () => {
  const time = useTime();
  
  // State
  const [themeIndex, setThemeIndex] = useState<number>(() => getStoredThemeIndex());
  const [view, setView] = useState<ClockView>(() => getStoredView());
  const [is24Hour, setIs24Hour] = useState<boolean>(() => getStoredIs24Hour());
  const [controlsVisible, setControlsVisible] = useState(false);
  
  // Interaction timer ref
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout>>(null);

  // Apply theme colors
  useEffect(() => {
    const root = document.documentElement;
    const theme = THEMES[themeIndex];
    
    if (theme) {
      root.style.setProperty('--bg', theme.colors.bg);
      root.style.setProperty('--surface', theme.colors.surface);
      root.style.setProperty('--accent', theme.colors.accent);
      root.style.setProperty('--muted', theme.colors.muted);
    }
  }, [themeIndex]);

  // Handle interaction for auto-hiding controls
  useEffect(() => {
    const showControls = () => {
      setControlsVisible(true);
      if (hideControlsTimer.current) {
        clearTimeout(hideControlsTimer.current);
      }
      hideControlsTimer.current = setTimeout(() => {
        setControlsVisible(false);
      }, 3000); // Hide after 3 seconds of inactivity
    };

    // Initial show
    showControls();

    window.addEventListener('mousemove', showControls);
    window.addEventListener('keydown', showControls);
    window.addEventListener('touchstart', showControls);
    window.addEventListener('click', showControls);

    return () => {
      window.removeEventListener('mousemove', showControls);
      window.removeEventListener('keydown', showControls);
      window.removeEventListener('touchstart', showControls);
      window.removeEventListener('click', showControls);
      if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    };
  }, []);

  // Handlers
  const handleToggleView = useCallback(() => {
    setView((prev) => {
      const newView = prev === ClockView.ANALOGUE ? ClockView.DIGITAL : ClockView.ANALOGUE;
      setStoredView(newView);
      return newView;
    });
  }, []);

  const handleCycleTheme = useCallback(() => {
    setThemeIndex((prev) => {
      const nextIndex = (prev + 1) % THEMES.length;
      setStoredThemeIndex(nextIndex);
      return nextIndex;
    });
  }, []);

  const handleToggleFormat = useCallback(() => {
    setIs24Hour((prev) => {
      const newValue = !prev;
      setStoredIs24Hour(newValue);
      return newValue;
    });
  }, []);

  const handleToggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, []);

  return (
    <main 
      className="relative w-screen h-screen flex items-center justify-center overflow-hidden theme-transition bg-[var(--bg)]"
    >
      <Controls 
        currentView={view}
        is24Hour={is24Hour}
        onToggleView={handleToggleView}
        onCycleTheme={handleCycleTheme}
        onToggleFormat={handleToggleFormat}
        onToggleFullScreen={handleToggleFullScreen}
        currentThemeName={THEMES[themeIndex].name}
        isVisible={controlsVisible}
      />

      <div className="flex items-center justify-center p-4 w-full h-full">
        {/* Key forces remount on view change, triggering the CSS animation */}
        <div key={view} className="clock-switch-enter flex items-center justify-center">
          {view === ClockView.ANALOGUE ? (
            <AnalogueClock time={time} />
          ) : (
            <DigitalClock time={time} is24Hour={is24Hour} />
          )}
        </div>
      </div>
    </main>
  );
};

export default App;