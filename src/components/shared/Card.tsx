"use client";

type InfoTileProps = {
  title: string;
  description: string;
  isImportant?: boolean;
  onActionClick?: () => void;
  categories?: string[];
};

const Card = ({
  title,
  description,
  isImportant = false,
  categories = [],
}: InfoTileProps) => {
  return (
    <div className={`bg-neutral-700/10 dark:bg-neutral-800/40 max-w-60 border-2 ${
        isImportant ? "border-red-500/50" : "border-neutral-200 dark:border-neutral-700"
      } flex flex-col gap-2 p-5 rounded-3xl shadow-md cursor-pointer hover:ring-2 
      dark:hover:ring-neutral-100 hover:ring-neutral-300 hover:border-transparent transition-all duration-300 h-fit`}>
        <h3 className="text-lg font-semibold tracking-tight line-clamp-3">{title}</h3>
        {categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
            {categories.map((category, index) => (
                <span
                key={index}
                className="px-2 py-1 text-xs font-medium text-neutral-900 dark:text-neutral-100 border-2 dark:border-neutral-700 border-neutral-300 rounded-full"
                >
                {category}
                </span>
            ))}
            </div>
        )}
        <p className="line-clamp-6 font-light text-sm">{description}</p>
    </div>
  );
}

export default Card;