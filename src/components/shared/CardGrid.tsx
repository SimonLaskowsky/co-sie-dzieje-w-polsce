"use client";

import React, { useState } from "react";
import Masonry from "react-masonry-css";
import Card from "@/components/shared/Card";
import DialogModal from "@/components/shared/DialogModal";


const cards = [
  {
    title: "Uchwała podnosząca minimalną pensję programistów do 2 baniek (na miecha)",
    description:
      "text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sh",
    isImportant: true,
    categories: ["Tech", "News", "Update"],
    governmentPercentage: 30,
    partyVotes: [
      { party: "PIS", percentage: 30 },
      { party: "KO", percentage: 25 },
      { party: "Lewica", percentage: 15 },
      { party: "PSL", percentage: 10 },
      { party: "Konfederacja", percentage: 20 },
    ],
  },
  {
    title: "Uchwała podnosząca minimalną pensję programistów do 2 baniek (na miecha)",
    description: "It is a long established fact that a reader will be distract",
    categories: ["News", "Update"],
    governmentPercentage: 50,
    partyVotes: [
      { party: "PIS", percentage: 30 },
      { party: "KO", percentage: 25 },
      { party: "Lewica", percentage: 15 },
      { party: "PSL", percentage: 10 },
      { party: "Konfederacja", percentage: 20 },
    ],
  },
  {
    title: "Uchwała podnosząca minimalną pensję programistów do 2 baniek (na miecha)",
    description: "It is a long established fact that a reader will be distract",
    governmentPercentage: 60,
    partyVotes: [
      { party: "PIS", percentage: 30 },
      { party: "KO", percentage: 25 },
      { party: "Lewica", percentage: 15 },
      { party: "PSL", percentage: 10 },
      { party: "Konfederacja", percentage: 20 },
    ],

  },
  {
    title: "Uchwała podnosząca minimalną pensję programistów do 2 baniek (na miecha)",
    description: "Zyski netto po opodatkowaniu. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    governmentPercentage: 10,
    partyVotes: [
      { party: "PIS", percentage: 30 },
      { party: "KO", percentage: 25 },
      { party: "Lewica", percentage: 15 },
      { party: "PSL", percentage: 10 },
      { party: "Konfederacja", percentage: 20 },
    ],
  },
  {
    title: "Uchwała podnosząca minimalną pensję programistów do 2 baniek (na miecha)",
    description: "It is a long established fact",
    categories: ["Tech", "News"],
    governmentPercentage: 80,
    partyVotes: [
      { party: "PIS", percentage: 30 },
      { party: "KO", percentage: 25 },
      { party: "Lewica", percentage: 15 },
      { party: "PSL", percentage: 10 },
      { party: "Konfederacja", percentage: 20 },
    ],
  },
  {
    title: "Uchwała podnosząca minimalną pensję programistów do 2 baniek (na miecha)",
    description:
      "text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sh",
    categories: ["Tech", "News", "Update", "Important"],
    governmentPercentage: 70,
    partyVotes: [
      { party: "PIS", percentage: 30 },
      { party: "KO", percentage: 25 },
      { party: "Lewica", percentage: 15 },
      { party: "PSL", percentage: 10 },
      { party: "Konfederacja", percentage: 20 },
    ],
  },
  {
    title: "Uchwała podnosząca minimalną pensję programistów do 2 baniek (na miecha)",
    description: "It is a long established fact",
    isImportant: true,
    governmentPercentage: 30,
    partyVotes: [
      { party: "PIS", percentage: 30 },
      { party: "KO", percentage: 25 },
      { party: "Lewica", percentage: 15 },
      { party: "PSL", percentage: 10 },
      { party: "Konfederacja", percentage: 20 },
    ],
  },
  {
    title: "Uchwała podnosząca minimalną pensję programistów do 2 baniek (na miecha)",
    description: "It is a long established fact that a reader will be distract",
    categories: ["Tech", "News", "Update"],
    governmentPercentage: 0,
    partyVotes: [
      { party: "PIS", percentage: 30 },
      { party: "KO", percentage: 25 },
      { party: "Lewica", percentage: 15 },
      { party: "PSL", percentage: 10 },
      { party: "Konfederacja", percentage: 20 },
    ],
  },
  {
    title: "Uchwała podnosząca minimalną pensję programistów do 2 baniek (na miecha)",
    description: "It is a long established fact that a reader will be distract",
    governmentPercentage: 50,
    partyVotes: [
      { party: "PIS", percentage: 30 },
      { party: "KO", percentage: 25 },
      { party: "Lewica", percentage: 15 },
      { party: "PSL", percentage: 10 },
      { party: "Konfederacja", percentage: 20 },
    ],
  },
  {
    title: "Uchwała podnosząca minimalną pensję programistów do 2 baniek (na miecha)",
    description: "It is a long established fact",
    governmentPercentage: 90,
    partyVotes: [
      { party: "PIS", percentage: 30 },
      { party: "KO", percentage: 25 },
      { party: "Lewica", percentage: 15 },
      { party: "PSL", percentage: 10 },
      { party: "Konfederacja", percentage: 20 },
    ],

  },
  {
    title: "Uchwała podnosząca minimalną pensję programistów do 2 baniek (na miecha)",
    description:
      "text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sh",
    categories: ["Tech", "News", "Update"],
    governmentPercentage: 80,
    partyVotes: [
      { party: "PIS", percentage: 30 },
      { party: "KO", percentage: 25 },
      { party: "Lewica", percentage: 15 },
      { party: "PSL", percentage: 10 },
      { party: "Konfederacja", percentage: 20 },
    ],
  },
];

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

  const filteredCards = cards.filter((card) => {
    const query = searchQuery.toLowerCase();
    return (
      card.title.toLowerCase().includes(query) ||
      card.description.toLowerCase().includes(query) ||
      (card.categories && card.categories.some((category: string) => category.toLowerCase().includes(query)))
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
            isImportant={card.isImportant}
            categories={card.categories}
            governmentPercentage={card.governmentPercentage}
            onClick={() => openModal(card)}
          />
        ))}
      </Masonry>
      {selectedCard && (
        <DialogModal
          isOpen={!!selectedCard}
          onClose={closeModal}
          card={selectedCard}
        />
      )}
    </>
  );
};

export default CardGrid;