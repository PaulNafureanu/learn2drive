import Navbar from "../components/layout/Navbar";
import Hero from "../components/sections/Hero";

export default function Website() {
  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#171717]">
      <Navbar />

      <main>
        <Hero />
      </main>
    </div>
  );
}
