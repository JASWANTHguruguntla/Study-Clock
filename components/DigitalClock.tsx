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
      60% { transform: rotateX(0deg); } /* Overshoot slightly for mechanical bounce */
      80% { transform: rotateX(10deg); }
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
        absolute left-0 w-full overflow-hidden bg-[var(--surface)] border-[var(--bg)]
        flex justify-center
        ${side === 'top' ? 'top-0 h-[50%] rounded-t-xl border-b-[1px] origin-bottom' : 'bottom-0 h-[50%] rounded-b-xl border-t-[1px] origin-top'}
      `}
    >
      {/* Inner container to hold the full-height text but cropped */}
      <div 
        className={`
          relative w-full h-[200%] flex justify-center items-center
          ${side === 'top' ? 'top-0' : '-top-[100%]'}
        `}
      >
        {/* AM/PM Label (Only rendered on top half) - Top Left Alignment */}
        {label && side === 'top' && (
          <span className="absolute top-2 left-3 text-[2.5vmin] font-bold text-[var(--muted)] opacity-80 uppercase z-20">
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
        
        {/* Subtle Gloss/Shadow for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      </div>
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
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  
  useEffect(() => {
    if (value !== curr) {
      setPrev(curr); // The value we are leaving
      setCurr(value); // The new value we are going to
      setIsFlipping(true);
      
      // Reset animation state after completion
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsFlipping(false);
        setPrev(value); // Sync previous to current after flip
      }, 400); // Faster duration (400ms) for clearer, sharper flip
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
    <div className={`relative perspective-container ${containerClass} select-none shadow-2xl rounded-xl bg-[var(--surface)]`}>
      {/* BACKGROUND (The New State) */}
      <HalfCard value={curr} label={label} size={size} side="top" />
      <HalfCard value={curr} label={label} size={size} side="bottom" />

      {/* FOREGROUND (The Old State - only visible if NOT flipped or during flip) */}
      {!isFlipping && (
         <HalfCard value={curr} label={label} size={size} side="bottom" />
      )}
      {!isFlipping && (
         <HalfCard value={curr} label={label} size={size} side="top" />
      )}

      {/* ANIMATION LAYERS */}
      {isFlipping && (
        <>
           {/* Static backdrop for bottom (Old Bottom) - stays until New Bottom covers it */}
           <div className="absolute inset-0 z-0">
             <HalfCard value={prev} label={label} size={size} side="bottom" />
           </div>

          {/* Top Flap: OLD Value. Rotates from 0 to -90. Z-Index High. */}
          {/* Faster duration (0.2s) and ease-in for gravity effect */}
          <div 
            className="absolute inset-0 z-20 backface-hidden origin-bottom"
            style={{ animation: 'flipTop 0.2s ease-in forwards' }}
          >
            <HalfCard value={prev} label={label} size={size} side="top" />
            <div className="absolute inset-0 bg-black/40 rounded-t-xl h-[50%]" />
          </div>

          {/* Bottom Flap: NEW Value. Rotates from 90 to 0. Z-Index High. */}
          {/* Slight delay (0.2s) to match top finish. slightly longer duration for bounce. */}
          <div 
            className="absolute inset-0 z-20 backface-hidden origin-top"
            style={{ animation: 'flipBottom 0.2s ease-out 0.2s forwards', transform: 'rotateX(90deg)' }}
          >
            <HalfCard value={curr} label={label} size={size} side="bottom" />
             {/* Highlight during flip */}
             <div className="absolute top-[50%] inset-x-0 h-[50%] bg-white/20 rounded-b-xl" />
          </div>
        </>
      )}
      
      {/* Split Line */}
      <div className="absolute top-1/2 w-full h-[2px] bg-[var(--bg)] z-30 opacity-80" />
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