'use client';

import React, { useState, useMemo } from 'react';
import Masonry from 'react-masonry-css';
import Card from '@/components/shared/Card';
import DialogModal from '@/components/shared/DialogModal';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type CardGridProps = {
  searchQuery: string;
};

const CardGrid = ({ searchQuery }: CardGridProps) => {
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [isFilterOptionsOpen, setIsFilterOptionsOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [sortByTitle, setSortByTitle] = useState<'asc' | 'desc' | null>(null);

  const { data, error } = useSWR('/api/acts', fetcher);

  const breakpointColumnsObj = {
    default: 4,
    1200: 3,
    950: 2,
    700: 1,
  };

  const toggleFilterOptions = () => {
    setIsFilterOptionsOpen((prev) => !prev);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setSortByTitle(null);
  };

  const toggleSortByTitle = () => {
    setSortByTitle((prev) => {
      if (prev === null) return 'asc';
      if (prev === 'asc') return 'desc';
      return null;
    });
    setSortOrder('desc');
  };

  const filteredAndSortedCards = useMemo(() => {
    if (!data) return [];

    const filtered = data.filter((card: any) => {
      const query = searchQuery.toLowerCase();
      return (
        card.title.toLowerCase().includes(query) ||
        (card.content && card.content.toLowerCase().includes(query)) ||
        (card.keywords &&
          card.keywords.some((keyword: string) =>
            keyword.toLowerCase().includes(query)
          ))
      );
    });

    if (sortByTitle) {
      return filtered.sort((a: any, b: any) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        return sortByTitle === 'asc'
          ? titleA.localeCompare(titleB)
          : titleB.localeCompare(titleA);
      });
    } else {
      return filtered.sort((a: any, b: any) => {
        const dateA = new Date(a.announcement_date).getTime();
        const dateB = new Date(b.announcement_date).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
    }
  }, [data, searchQuery, sortOrder, sortByTitle]);

  const openModal = (card: any) => {
    setSelectedCard(card);
  };

  const closeModal = () => {
    setSelectedCard(null);
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto px-2.5">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex gap-5 w-fit justify-center relative mx-auto"
        columnClassName="flex flex-col gap-5 !w-fit"
      >
        {filteredAndSortedCards.map((card: any) => (
          <Card
            key={card.id}
            title={card.title}
            content={card.content}
            summary={card.simple_title}
            date={card.announcement_date}
            categories={card.keywords}
            isImportant={card.item_type === 'Ustawa'} 
            governmentPercentage={card.votes?.government?.votesPercentage?.yes || 0}
            onClick={() => openModal(card)}
          />
        ))}
        {filteredAndSortedCards.length > 0 && (
          <div className="flex justify-end absolute right-0 -top-11">
            <button
              onClick={toggleFilterOptions}
              className={`p-2 cursor-pointer transition-all duration-300 ${
                isFilterOptionsOpen
                  ? 'text-neutral-600 dark:text-neutral-100'
                  : 'text-neutral-400 dark:text-neutral-500'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                height="18"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                width="18"
              >
                <path
                  d="M3.99961 3H19.9997C20.552 3 20.9997 3.44764 20.9997 3.99987L20.9999 5.58569C21 5.85097 20.8946 6.10538 20.707 6.29295L14.2925 12.7071C14.105 12.8946 13.9996 13.149 13.9996 13.4142L13.9996 19.7192C13.9996 20.3698 13.3882 20.8472 12.7571 20.6894L10.7571 20.1894C10.3119 20.0781 9.99961 19.6781 9.99961 19.2192L9.99961 13.4142C9.99961 13.149 9.89425 12.8946 9.70672 12.7071L3.2925 6.29289C3.10496 6.10536 2.99961 5.851 2.99961 5.58579V4C2.99961 3.44772 3.44732 3 3.99961 3Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="flex gap-2">
              <button
                onClick={toggleSortOrder}
                className={`
                  p-2 absolute top-0 right-0 opacity-0 pointer-events-none transition-all duration-300 cursor-pointer
                  ${
                    isFilterOptionsOpen &&
                    'opacity-100 !pointer-events-auto -translate-y-7 -translate-x-5'
                  }
                  ${
                    sortOrder === 'asc'
                      ? 'text-neutral-600 dark:text-neutral-100'
                      : 'text-neutral-400 dark:text-neutral-500'
                  }
                `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22px"
                  height="22px"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M10 7L2 7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8 12H2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M10 17H2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="17"
                    cy="12"
                    r="5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M17 10V11.8462L18 13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                onClick={toggleSortByTitle}
                className={`
                  p-2 absolute top-0 right-0 opacity-0 pointer-events-none transition-all duration-300 cursor-pointer
                  ${
                    isFilterOptionsOpen &&
                    'opacity-100 !pointer-events-auto -translate-y-7 translate-x-6'
                  }
                  ${
                    sortByTitle !== null
                      ? 'text-neutral-600 dark:text-neutral-100'
                      : 'text-neutral-400 dark:text-neutral-500'
                  }
                `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22px"
                  height="22px"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M13 7L3 7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M10 12H3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8 17H3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M11.3161 16.6922C11.1461 17.07 11.3145 17.514 11.6922 17.6839C12.07 17.8539 12.514 17.6855 12.6839 17.3078L11.3161 16.6922ZM16.5 7L17.1839 6.69223C17.0628 6.42309 16.7951 6.25 16.5 6.25C16.2049 6.25 15.9372 6.42309 15.8161 6.69223L16.5 7ZM20.3161 17.3078C20.486 17.6855 20.93 17.8539 21.3078 17.6839C21.6855 17.514 21.8539 17.07 21.6839 16.6922L20.3161 17.3078ZM19.3636 13.3636L20.0476 13.0559L19.3636 13.3636ZM13.6364 12.6136C13.2222 12.6136 12.8864 12.9494 12.8864 13.3636C12.8864 13.7779 13.2222 14.1136 13.6364 14.1136V12.6136ZM12.6839 17.3078L17.1839 7.30777L15.8161 6.69223L11.3161 16.6922L12.6839 17.3078ZM21.6839 16.6922L20.0476 13.0559L18.6797 13.6714L20.3161 17.3078L21.6839 16.6922ZM20.0476 13.0559L17.1839 6.69223L15.8161 7.30777L18.6797 13.6714L20.0476 13.0559ZM19.3636 12.6136H13.6364V14.1136H19.3636V12.6136Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </Masonry>
      <DialogModal
        isOpen={selectedCard !== null}
        onClose={closeModal}
        card={selectedCard}
      />
    </div>
  );
};

export default CardGrid;