import React, { useEffect } from 'react';

type SearchBarProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const SearchBar = ({ searchQuery, setSearchQuery }: SearchBarProps) => {
  useEffect(() => {
    if (searchQuery === '2137') {
      document.body.style.backgroundImage = 'url("/papaj.jpg")';
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
    } else {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
    }
  }, [searchQuery]);

  return (
    <div
      className="group w-11/12 md:w-full max-w-[600px] relative before:absolute before:bg-neutral-100
        before:flex before:top-1/2 before:-translate-y-1/2
        before:left-1/2 before:-translate-x-1/2 before:bg-gradient-to-r before:from-white before:to-red-500 
        before:opacity-50 before:blur-3xl before:rounded-full before:w-160 before:h-120 before:rotate-45 before:-z-1"
    >
      <div
        className="dark:bg-neutral-800/40 bg-neutral-700/10 border-neutral-200 dark:border-neutral-700 focus-within:!border-transparent border-2 rounded-3xl p-5 py-0 w-full focus:outline-none
            focus-within:ring-2 dark:focus-within:ring-neutral-100 focus-within:ring-neutral-300 transition-all duration-300
            shadow-md flex items-center"
      >
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Szukaj..."
          className="hover:outline-none focus:outline-none bg-transparent w-full pr-5 py-5 dark:text-neutral-100
           text-neutral-600 placeholder:text-neutral-400 group-hover:placeholder:text-neutral-600 
           dark:placeholder:text-neutral-500 dark:group-hover:placeholder:text-neutral-100 
           placeholder:transition-all placeholder:duration-300"
          aria-label="Wyszukaj"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="dark:group-hover:text-neutral-100 dark:text-neutral-500 text-neutral-400 duration-300 transition-all
          group-hover:text-neutral-600"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
    </div>
  );
};

export default SearchBar;
