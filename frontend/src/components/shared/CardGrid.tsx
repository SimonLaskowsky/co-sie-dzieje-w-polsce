'use client';

import React, { useState } from 'react';
import Masonry from 'react-masonry-css';
import Card from '@/components/shared/Card';
import DialogModal from '@/components/shared/DialogModal';
import cards from '@/data/cards.json';

type CardGridProps = {
  searchQuery: string;
};

const CardGrid = ({ searchQuery }: CardGridProps) => {
  const [selectedCard, setSelectedCard] = useState<any>(null);

  const breakpointColumnsObj = {
    default: 4,
    1200: 3,
    950: 2,
    700: 1,
  };

  const filteredCards = cards.filter(card => {
    const query = searchQuery.toLowerCase();
    return (
      card.title.toLowerCase().includes(query) ||
      card.description.toLowerCase().includes(query) ||
      (card.categories &&
        card.categories.some((category: string) =>
          category.toLowerCase().includes(query)
        ))
    );
  });

  const openModal = (card: any) => {
    setSelectedCard(card);
  };

  const closeModal = () => {
    setSelectedCard(null);
  };

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex gap-5 w-full max-w-screen-lg mx-auto justify-center"
        columnClassName="flex flex-col gap-5 !w-fit"
      >
        {filteredCards.map((card, index) => (
          <Card
            key={index}
            title={card.title}
            description={card.description}
            summary={card.summary}
            date={card.date}
            isImportant={card.isImportant}
            categories={card.categories}
            governmentPercentage={card.votesYes.governmentPercentage}
            onClick={() => openModal(card)}
          />
        ))}
      </Masonry>
      <DialogModal
        isOpen={selectedCard !== null}
        onClose={closeModal}
        card={selectedCard}
      />
    </>
  );
};

export default CardGrid;