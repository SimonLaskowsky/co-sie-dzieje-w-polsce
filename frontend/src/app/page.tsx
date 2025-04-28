'use client';

import SearchBar from '@/components/shared/SearchBar';
import CardGrid from '@/components/shared/CardGrid';
import Navbar from '@/components/layout/Navbar';
import { useState } from 'react';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <Navbar />
      <div className="overflow-hidden flex flex-col gap-10 md:gap-20 items-center justify-items-center w-full min-h-screen pt-20 md:pt-[110px] py-8 pb-20 font-[family-name:var(--font-geist-sans)]">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <main className="w-full h-full after:pointer-events-none after:block after:fixed after:bottom-0 after:w-full after:h-1/3 after:bg-gradient-to-t after:from-background after:to-transparent">
          <CardGrid searchQuery={searchQuery} />
        </main>
      </div>
    </>
  );
};

export default Home;
