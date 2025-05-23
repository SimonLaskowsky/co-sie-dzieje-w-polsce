'use client';

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
  const totalDots = 14;
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
      className={`bg-neutral-700/10 dark:bg-neutral-800/40 mx-auto max-w-11/12 sm:max-w-60 border-2 rounded-3xl ${
        isImportant
          ? 'border-red-500/70'
          : 'border-neutral-200 dark:border-neutral-700'
      } flex flex-col gap-3 p-5 rounded-3xl shadow-md cursor-pointer hover:ring-2 
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
        &quot;{summary}&quot;
      </div>
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {categories.map((category, index) => (
            <span
              key={index}
              className="dark:bg-neutral-700/50 bg-neutral-600/10 px-2 py-1 text-xs font-medium text-neutral-900 dark:text-neutral-100 rounded-full"
            >
              {category}
            </span>
          ))}
        </div>
      )}
      <p className="line-clamp-7 font-light text-sm">
        {stripHtml(content)}
      </p>

      <div className="dark:text-neutral-600 text-neutral-500 text-xs">
        Rozkład głosów &quot;za&quot;
      </div>
      <div className="flex flex-col items-center gap-1 -mt-1.5">
        <div className="flex justify-between w-full">
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
    </div>
  );
};

export default Card;
