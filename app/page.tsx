"use client";

import Navbar from "@/components/layout/Navbar";
import MarketListings from "@/components/property/MarketListings";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background-light text-nordic-dark font-sans antialiased">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full flex-grow">
        <MarketListings />
      </main>
    </div>
  );
}
