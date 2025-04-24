
import SearchBar from "@/components/shared/SearchBar";
import CardGrid from "@/components/shared/CardGrid";

const Home = () => {
  return (
    <div className="flex flex-col gap-20 items-center justify-items-center w-full min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <SearchBar />
      <main className="w-full h-full">
        <CardGrid />
      </main>
    </div>
  );
}

export default Home;