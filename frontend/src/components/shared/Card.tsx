'use client';

import { useRef, useState, useEffect } from 'react';

type InfoTileProps = {
  title: string;
  content: string;
  summary: string;
  date: string;
  isImportant?: boolean;
  onClick: () => void;
  categories?: string[];
  governmentPercentage: number;
};

const Card = ({
  title,
  content,
  summary,
  date,
  isImportant = false,
  onClick,
  categories = [],
  governmentPercentage,
}: InfoTileProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [totalDots, setTotalDots] = useState(14);

  const updateTotalDots = () => {
    if (!containerRef.current) return;
    const width = containerRef.current.offsetWidth;
    const dotWidth = 8;
    const desiredGap = 8;
    const N = Math.round((width + desiredGap) / (dotWidth + desiredGap));
    setTotalDots(Math.max(10, N));
  };

  useEffect(() => {
    window.addEventListener('resize', updateTotalDots);
    updateTotalDots();

    return () => window.removeEventListener('resize', updateTotalDots);
  }, []);

  const governmentDots = Math.round((governmentPercentage / 100) * totalDots);
  const oppositionDots = totalDots - governmentDots;

  const formattedDate = new Date(date).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '');
  };

  return (
    <div
      onClick={onClick}
      className={`bg-neutral-700/10 dark:bg-neutral-800/40 mx-auto max-w-11/12 sm:max-w-80 rounded-3xl ${
        isImportant ? 'border-2 border-red-500/70 shadow-red-500/10' : ''
      } flex flex-col gap-3 p-5 rounded-3xl shadow-xl cursor-pointer hover:ring-2 
      dark:hover:ring-neutral-100 hover:ring-neutral-300 hover:!border-transparent transition-all duration-300 h-fit`}
    >
      <div className="dark:text-neutral-600 text-neutral-500 text-xs">
        {formattedDate}
      </div>
      <h3 className="text-lg leading-snug font-semibold tracking-tight line-clamp-3 -mt-2.5">
        {title}
      </h3>
      <div className="dark:text-neutral-600 text-neutral-500 text-xs">
        W skrócie
      </div>
      <div className="text-sm text-muted-foreground leading-snug line-clamp-4 text-gradient-gloss font-medium -mt-2.5">
        "{summary}"
      </div>
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {categories.slice(0, 4).map((category, index) => (
            <span
              key={index}
              className="dark:bg-neutral-700/50 bg-neutral-600/10 px-2 py-1 text-xs font-medium text-neutral-900 dark:text-neutral-100 rounded-full"
            >
              {category}
            </span>
          ))}
        </div>
      )}
      <p className="line-clamp-7 font-light text-sm">{stripHtml(content)}</p>
      {governmentPercentage > 0 && (
        <>
          <div className="dark:text-neutral-600 text-neutral-500 text-xs">
            Rozkład głosów "za"
          </div>
          <div className="flex flex-col items-center gap-1 -mt-1.5">
            <div ref={containerRef} className="flex justify-between w-full">
              {[...Array(governmentDots)].map((_, index) => (
                <div
                  key={`gov-${index}`}
                  className="w-2 h-2 bg-neutral-100 rounded-full"
                ></div>
              ))}
              {[...Array(oppositionDots)].map((_, index) => (
                <div
                  key={`opp-${index}`}
                  className="w-2 h-2 bg-red-500/70 rounded-full"
                ></div>
              ))}
            </div>
            <div className="flex justify-between w-full dark:text-neutral-600 text-neutral-500 text-xs">
              <span>Rządz.</span>
              <span>Opoz.</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Card;
