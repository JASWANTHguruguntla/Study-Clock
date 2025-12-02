import React, { useState, useEffect, useRef } from 'react';

interface DigitalClockProps {
  time: Date;
  is24Hour: boolean;
}

// CSS Animations for the flip effect
const FlipStyles = () => (
  <style>{`
    @keyframes flipTop {
      0% { transform: rotateX(0deg); }
      100% { transform: rotateX(-90deg); }
    }
    @keyframes flipBottom {
      0% { transform: rotateX(90deg); }
      100% { transform: rotateX(0deg); }
    }
    .perspective-container {
      perspective: 400px;
      transform-style: preserve-3d;
    }
    .backface-hidden {
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
    }
  `}</style>
);

interface HalfCardProps {
  value: string;
  label?: string;
  size: 'large' | 'small';
  side: 'top' | 'bottom';
}

const HalfCard: React.FC<HalfCardProps> = ({ value, label, size, side }) => {
  return (
    <div 
      className={`
        absolute left-0 w-full bg-[var(--surface)]
        flex justify-center overflow-hidden
        ${side === 'top' ? 'top-0 h-[50%] origin-bottom' : 'bottom-0 h-[50%] origin-top'}
      `}
    >
      {/* Inner container to hold the full-height text but cropped */}
      <div 
        className={`
          relative w-full h-[200%] flex justify-center items-center
          ${side === 'top' ? 'top-0' : '-top-[100%]'}
        `}
      >
        {/* AM/PM Label - Top Left Alignment (Only on top half) */}
        {label && side === 'top' && (
          <span className="absolute top-3 left-3 text-[2.5vmin] font-bold text-[var(--muted)] opacity-80 uppercase z-20">
            {label}
          </span>
        )}

        {/* Number */}
        <span 
          className={`
            font-sans font-bold tracking-tighter leading-none text-[var(--accent)] z-10
            ${size === 'large' ? 'text-[26vmin] sm:text-[22vmin]' : 'text-[12vmin] sm:text-[10vmin]'}
            tabular-nums
          `}
        >
          {value}
        </span>
      </div>

      {/* 
        The "Invisible" Cut Line 
        A 0.5px strip of the background color at the fold edge.
        It blends with the background (invisible) but cuts the number (visible).
      */}
      <div 
        className={`
          absolute left-0 w-full h-[1px] bg-[var(--surface)] z-30
          ${side === 'top' ? 'bottom-0' : 'top-0'}
        `}
      />

      {/* Subtle Shadow/Depth overlay for the flaps */}
      <div className={`absolute inset-0 pointer-events-none z-40 mix-blend-multiply opacity-30 ${side === 'top' ? 'bg-gradient-to-b from-transparent to-black' : 'bg-gradient-to-t from-transparent to-black'}`} />
    </div>
  );
};

interface FlipCardProps {
  value: string;
  label?: string;
  size?: 'large' | 'small';
}

const FlipCard: React.FC<FlipCardProps> = ({ value, label, size = 'large' }) => {
  const [curr, setCurr] = useState(value);
  const [prev, setPrev] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);
  // Accessible state to hold the value for screen readers, updated only after animation
  const [announcedValue, setAnnouncedValue] = useState(value);

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  
  useEffect(() => {
    if (value !== curr) {
      setPrev(curr); // The value we are leaving
      setCurr(value); // The new value we are going to
      setIsFlipping(true);
      
      // Reset animation state after completion
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      // Total duration 300ms (0.15s top + 0.15s bottom)
      timeoutRef.current = setTimeout(() => {
        setIsFlipping(false);
        setPrev(value); // Sync previous to current after flip
        setAnnouncedValue(value); // Update accessible value after animation completes
      }, 300); 
    }
  }, [value, curr]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const containerClass = size === 'large' 
    ? 'w-[32vmin] h-[32vmin] sm:w-[28vmin] sm:h-[28vmin]' 
    : 'w-[18vmin] h-[18vmin] sm:w-[15vmin] sm:h-[15vmin]';

  return (
    <div className={`relative perspective-container ${containerClass} select-none`}>
      
      {/* Screen Reader Live Region: Updates only after animation completes */}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {announcedValue}{label ? ` ${label}` : ''}
      </span>

      {/* STATIC HOUSING: The rounded container that masks everything. Hidden from SRs to avoid duplication. */}
      <div 
        className="absolute inset-0 rounded-xl overflow-hidden bg-[var(--surface)] shadow-2xl ring-1 ring-white/5"
        aria-hidden="true"
      >
        
        {/* BASE LAYER (Next Value) - Always visible at back */}
        <HalfCard value={curr} label={label} size={size} side="top" />
        <HalfCard value={curr} label={label} size={size} side="bottom" />

        {/* FLAP LAYER (Animating) */}
        
        {/* Top Half of Old Value (Waits to flip down) */}
        {(!isFlipping) && (
           <HalfCard value={curr} label={label} size={size} side="top" />
        )}
        {(isFlipping) && (
          <div 
            className="absolute inset-0 z-20 backface-hidden origin-bottom h-[50%]"
            style={{ 
              animation: 'flipTop 0.15s ease-in forwards',
              willChange: 'transform'
            }}
          >
             <HalfCard value={prev} label={label} size={size} side="top" />
          </div>
        )}

        {/* Bottom Half of Old Value (Visible behind the falling top flap) */}
        {isFlipping && (
          <div className="absolute inset-0 z-0">
             <HalfCard value={prev} label={label} size={size} side="bottom" />
          </div>
        )}
        
        {/* Bottom Half of New Value (Flips down to cover old bottom) */}
        {isFlipping && (
          <div 
            className="absolute inset-0 top-[50%] z-30 backface-hidden origin-top h-[50%]"
            style={{ 
              animation: 'flipBottom 0.15s ease-out 0.15s forwards', 
              transform: 'rotateX(90deg)',
              willChange: 'transform'
            }}
          >
             <HalfCard value={curr} label={label} size={size} side="bottom" />
          </div>
        )}

      </div>
      
    </div>
  );
};

const DigitalClock: React.FC<DigitalClockProps> = ({ time, is24Hour }) => {
  const hours24 = time.getHours();
  
  // Format Logic
  let displayHours = hours24;
  let label = undefined;

  if (!is24Hour) {
    const isPm = hours24 >= 12;
    displayHours = hours24 % 12 || 12;
    label = isPm ? 'PM' : 'AM';
  }

  const hoursStr = displayHours.toString().padStart(2, '0');
  const minutesStr = time.getMinutes().toString().padStart(2, '0');
  const secondsStr = time.getSeconds().toString().padStart(2, '0');

  return (
    <>
      <FlipStyles />
      <div 
        className="flex flex-row items-center gap-[2vmin] sm:gap-[3vmin]"
        aria-label={`Current time is ${hoursStr}:${minutesStr} ${label || ''}`}
      >
        {/* Hours */}
        <FlipCard value={hoursStr} label={label} />
        
        {/* Minutes */}
        <FlipCard value={minutesStr} />
        
        {/* Seconds (Plain Text, No Flip, No Background) */}
        <div className="flex items-center justify-center ml-[2vmin]">
          <span className="font-sans font-bold tabular-nums text-[var(--accent)] text-[12vmin] sm:text-[10vmin] leading-none opacity-80">
            {secondsStr}
          </span>
        </div>
      </div>
    </>
  );
};

export default DigitalClock;