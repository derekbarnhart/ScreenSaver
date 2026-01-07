
import React, { useState, useEffect } from 'react';

interface ClockOverlayProps {
  format: '12h' | '24h';
}

const ClockOverlay: React.FC<ClockOverlayProps> = ({ format }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    
    let ampm = '';

    if (format === '12h') {
      ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
    }

    const pad = (num: number) => num.toString().padStart(2, '0');
    
    return {
      timeString: `${pad(hours)}:${pad(minutes)}`,
      secondsString: pad(seconds),
      ampm
    };
  };

  const { timeString, secondsString, ampm } = formatTime(time);
  const dateString = time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-40 select-none">
      <div className="flex flex-col items-center text-white drop-shadow-md mix-blend-difference" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
        <div className="flex items-baseline">
            <span className="text-[6rem] md:text-[12rem] font-thin leading-none tracking-tighter tabular-nums">
            {timeString}
            </span>
            <div className="flex flex-col ml-2 md:ml-6">
                 <span className="text-2xl md:text-5xl font-light opacity-80 tabular-nums">{secondsString}</span>
                 {format === '12h' && <span className="text-lg md:text-2xl font-medium opacity-60 mt-1">{ampm}</span>}
            </div>
        </div>
        <div className="text-xl md:text-4xl font-light mt-2 md:mt-4 opacity-90 tracking-wide uppercase">
          {dateString}
        </div>
      </div>
    </div>
  );
};

export default ClockOverlay;
