"use client";

import React from "react";
import Masonry from "react-masonry-css";
import Card from "@/components/shared/Card";

const cards = [
  {
    title: "Uchwała podnosząca minimalną pensję programistów do 2 baniek (na miecha)",
    description:
      "text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sh",
    isImportant: true,
    categories: ["Tech", "News", "Update"],
  },
  {
    title: "Uchwała podnosząca minimalną pensję programistów do 2 baniek (na miecha)",
    description: "It is a long established fact that a reader will be distract",
    categories: ["News", "Update"],
  },
  {
    title: "Uchwała podnosząca minimalną pensję programistów do 2 baniek (na miecha)",
    description: "It is a long established fact that a reader will be distract",
  },
  {
    title: "Uchwała podnosząca minimalną pensję programistów do 2 baniek (na miecha)",
    description: "Zyski netto po opodatkowaniu. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    title: "Uchwała podnosząca minimalną pensję programistów do 2 baniek (na miecha)",
    description: "It is a long established fact",
    categories: ["Tech", "News"],
  },
  {
    title: "Uchwała podnosząca minimalną pensję programistów do 2 baniek (na miecha)",
    description:
      "text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sh",
    categories: ["Tech", "News", "Update", "Important"],
  },
  {
    title: "Uchwała podnosząca minimalną pensję programistów do 2 baniek (na miecha)",
    description: "It is a long established fact",
    isImportant: true,
  },
  {
    title: "Uchwała podnosząca minimalną pensję programistów do 2 baniek (na miecha)",
    description: "It is a long established fact that a reader will be distract",
    categories: ["Tech", "News", "Update"],
  },
  {
    title: "Uchwała podnosząca minimalną pensję programistów do 2 baniek (na miecha)",
    description: "It is a long established fact that a reader will be distract",
  },
  {
    title: "Uchwała podnosząca minimalną pensję programistów do 2 baniek (na miecha)",
    description: "It is a long established fact",
  },
  {
    title: "Uchwała podnosząca minimalną pensję programistów do 2 baniek (na miecha)",
    description:
      "text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sh",
    categories: ["Tech", "News", "Update"],
  },
];

type CardGridProps = {
  searchQuery: string;
};

const CardGrid = ({ searchQuery }: CardGridProps) => {
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
      (card.categories && card.categories.some((category) => category.toLowerCase().includes(query)))
    );
  });

  return (
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
        />
      ))}
    </Masonry>
  );
};

export default CardGrid;