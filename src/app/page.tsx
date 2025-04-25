"use client"

import SearchBar from "@/components/shared/SearchBar";
import CardGrid from "@/components/shared/CardGrid";
import { useState } from "react";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className="flex flex-col gap-20 items-center justify-items-center w-full min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <main className="w-full h-full">
        <CardGrid searchQuery={searchQuery} />
      </main>
    </div>
  );
}

export default Home;