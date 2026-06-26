"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import SearchFilters from "@/components/property/SearchFilters";
import FeaturedCard from "@/components/property/FeaturedCard";
import PropertyCard from "@/components/property/PropertyCard";
import { mockProperties } from "@/data/properties";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [marketStatus, setMarketStatus] = useState("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(4);

  // Toggle favorite property by ID
  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  // 1. Featured properties filtering
  const featuredProperties = mockProperties.filter((p) => p.featured);

  // 2. New in Market properties filtering (non-featured properties)
  const marketProperties = mockProperties.filter((p) => !p.featured);

  // Apply filters to New in Market properties
  const filteredMarketProperties = marketProperties.filter((property) => {
    // A. Filter by search query (title or location)
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase());

    // B. Filter by property type pill (e.g. House, Apartment)
    const matchesType =
      selectedType === "all" || property.type === selectedType;

    // C. Filter by transaction tab (All, Buy, Rent)
    const matchesStatus =
      marketStatus === "all" ||
      (marketStatus === "buy" && property.status === "sale") ||
      (marketStatus === "rent" && property.status === "rent");

    return matchesSearch && matchesType && matchesStatus;
  });

  const hasMoreProperties = filteredMarketProperties.length > visibleCount;

  return (
    <div className="min-h-screen flex flex-col bg-background-light text-nordic-dark font-sans antialiased">
      {/* Sticky Header Navigation */}
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full flex-grow">
        {/* Search and Main Filters Hero */}
        <SearchFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />

        {/* Featured Collections Section */}
        <section className="mb-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-light text-nordic-dark">
                Featured Collections
              </h2>
              <p className="text-nordic-muted text-sm mt-1">
                Curated properties for the discerning eye.
              </p>
            </div>
            <a
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-mosque hover:opacity-70 transition-opacity"
              href="#"
            >
              View all <span className="material-icons text-sm">arrow_forward</span>
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredProperties.map((property) => (
              <FeaturedCard
                key={property.id}
                property={property}
                isFavorite={favorites.includes(property.id)}
                onToggleFavorite={() => toggleFavorite(property.id)}
              />
            ))}
          </div>
        </section>

        {/* New in Market Section */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-light text-nordic-dark">
                New in Market
              </h2>
              <p className="text-nordic-muted mt-1 text-sm">
                Fresh opportunities added this week.
              </p>
            </div>

            {/* Buy / Rent Selector */}
            <div className="flex bg-white p-1 rounded-lg self-start sm:self-auto border border-nordic-dark/5">
              <button
                onClick={() => setMarketStatus("all")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  marketStatus === "all"
                    ? "bg-nordic-dark text-white shadow-sm"
                    : "text-nordic-muted hover:text-nordic-dark"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setMarketStatus("buy")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  marketStatus === "buy"
                    ? "bg-nordic-dark text-white shadow-sm"
                    : "text-nordic-muted hover:text-nordic-dark"
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setMarketStatus("rent")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  marketStatus === "rent"
                    ? "bg-nordic-dark text-white shadow-sm"
                    : "text-nordic-muted hover:text-nordic-dark"
                }`}
              >
                Rent
              </button>
            </div>
          </div>

          {/* Listings Grid */}
          {filteredMarketProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMarketProperties.slice(0, visibleCount).map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isFavorite={favorites.includes(property.id)}
                  onToggleFavorite={() => toggleFavorite(property.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-nordic-dark/10">
              <span className="material-symbols-outlined text-5xl text-nordic-muted opacity-65 mb-3">
                domain_disabled
              </span>
              <p className="text-nordic-muted text-lg font-light">
                No properties match your current search criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("all");
                  setMarketStatus("all");
                }}
                className="mt-4 px-5 py-2 bg-mosque text-white rounded-lg text-sm font-medium hover:bg-mosque/90 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Load More Button */}
          {hasMoreProperties && (
            <div className="mt-12 text-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 4)}
                className="px-8 py-3 bg-white border border-nordic-dark/10 hover:border-mosque hover:text-mosque text-nordic-dark font-medium rounded-lg transition-all hover:shadow-md cursor-pointer"
              >
                Load more properties
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
