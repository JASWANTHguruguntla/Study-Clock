import React, { useMemo } from 'react';

interface AnalogueClockProps {
  time: Date;
}

const AnalogueClock: React.FC<AnalogueClockProps> = ({ time }) => {
  const { hourAngle, minuteAngle, secondAngle } = useMemo(() => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const milliseconds = time.getMilliseconds();
    
    // Smooth continuous movement
    const totalSeconds = seconds + milliseconds / 1000;
    const totalMinutes = minutes + totalSeconds / 60;
    const totalHours = hours + totalMinutes / 60;

    return {
      secondAngle: totalSeconds * 6,
      minuteAngle: totalMinutes * 6,
      hourAngle: totalHours * 30,
    };
  }, [time]);

  // Generate tick marks
  const ticks = useMemo(() => {
    return [...Array(60)].map((_, i) => {
      const isHour = i % 5 === 0;
      const angle = i * 6;
      
      if (isHour) {
        return (
          <rect
            key={i}
            x="49"
            y="5"
            width="2"
            height="5"
            rx="1"
            transform={`rotate(${angle} 50 50)`}
            className="fill-[var(--muted)] opacity-90 transition-colors duration-500"
          />
        );
      }
      
      return (
        <circle
          key={i}
          cx="50"
          cy="7.5"
          r="0.5"
          transform={`rotate(${angle} 50 50)`}
          className="fill-[var(--muted)] opacity-40 transition-colors duration-500"
        />
      );
    });
  }, []);

  // Generate hour numbers
  const numbers = useMemo(() => {
    const radius = 34; // Position numbers inside the ticks
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
      // Calculate position: 12 is at -90deg (or 0 with cos), we use standard trig with rotation
      const angleInRadians = (num * 30) * (Math.PI / 180);
      const x = 50 + radius * Math.sin(angleInRadians);
      const y = 50 - radius * Math.cos(angleInRadians);
      
      return (
        <text
          key={num}
          x={x}
          y={y}
          dominantBaseline="central"
          textAnchor="middle"
          className="fill-[var(--accent)] text-[5px] font-bold font-sans select-none transition-colors duration-500"
        >
          {num}
        </text>
      );
    });
  }, []);

  return (
    <div 
      className="relative w-[75vmin] h-[75vmin] max-w-[600px] max-h-[600px]"
      aria-label="Analogue clock"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl overflow-visible">
        <defs>
          <filter id="hand-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" />
            <feOffset dx="0" dy="1.5" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Clock Face Ring (Subtle) */}
        <circle 
          cx="50" 
          cy="50" 
          r="48" 
          className="stroke-[var(--muted)] stroke-[0.5px] opacity-10 fill-none transition-colors duration-500" 
        />

        {/* Ticks */}
        {ticks}

        {/* Hour Numbers */}
        {numbers}

        {/* Hour Hand - Modern Tapered */}
        <g 
          transform={`rotate(${hourAngle} 50 50)`} 
          filter="url(#hand-shadow)"
          className="transition-transform duration-500 ease-out"
        >
          {/* Tapered shape: Wider at base, narrow at tip */}
          <path
            d="M50 54 L48 50 L48.5 28 L50 26 L51.5 28 L52 50 Z"
            className="fill-[var(--muted)] transition-colors duration-500"
          />
        </g>

        {/* Minute Hand - Modern Tapered */}
        <g 
          transform={`rotate(${minuteAngle} 50 50)`} 
          filter="url(#hand-shadow)"
          className="transition-transform duration-500 ease-out"
        >
          {/* Tapered shape: Longer and slightly thinner */}
          <path
            d="M50 54 L48.5 50 L49.25 16 L50 15 L50.75 16 L51.5 50 Z"
            className="fill-[var(--muted)] transition-colors duration-500"
          />
        </g>

        {/* Second Hand - Swiss Rail style with Accent */}
        <g 
          transform={`rotate(${secondAngle} 50 50)`}
          className="transition-transform duration-100 ease-[cubic-bezier(0.34,1.56,0.64,1)]" 
        >
          {/* Tail Counter-balance */}
          <line
            x1="50"
            y1="62"
            x2="50"
            y2="50"
            className="stroke-[var(--accent)] stroke-[2px] transition-colors duration-500"
          />
          <circle cx="50" cy="62" r="2.5" className="fill-[var(--accent)] transition-colors duration-500" />
          
          {/* Main Needle */}
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="14"
            className="stroke-[var(--accent)] stroke-[1.5px] transition-colors duration-500"
          />
          
          {/* Center Pivot Ring */}
          <circle 
            cx="50" 
            cy="50" 
            r="3" 
            className="fill-[var(--bg)] stroke-[var(--accent)] stroke-[2px] transition-colors duration-500"
          />
        </g>
        
        {/* Center Cap (covers hand convergence) */}
        <circle 
          cx="50" 
          cy="50" 
          r="1.5" 
          className="fill-[var(--accent)] transition-colors duration-500"
        />
      </svg>
    </div>
  );
};

export default AnalogueClock;