"use client";

import { useState, useEffect, useCallback } from "react";
import SearchFilters from "@/components/property/SearchFilters";
import PropertyCard from "@/components/property/PropertyCard";
import { getMarketProperties } from "@/lib/properties";
import { Property } from "@/types/property";

const PAGE_SIZE = 6;

export default function MarketListings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [marketStatus, setMarketStatus] = useState("all");
  const [favorites, setFavorites] = useState<string[]>([]);

  const [properties, setProperties] = useState<Property[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  // Fetch properties — resets on filter change, appends on "load more"
  const fetchProperties = useCallback(
    async (pageNum: number, append: boolean) => {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
        setPage(0);
      }

      const result = await getMarketProperties({
        page: pageNum,
        pageSize: PAGE_SIZE,
        type: selectedType,
        status: marketStatus,
        search: searchQuery,
      });

      setProperties((prev) => (append ? [...prev, ...result.data] : result.data));
      setTotalCount(result.count);

      if (append) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
    },
    [selectedType, marketStatus, searchQuery]
  );

  // Reset to page 0 when filters change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProperties(0, false);
  }, [fetchProperties]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProperties(nextPage, true);
  };

  const hasMore = properties.length < totalCount;

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setMarketStatus("all");
  };

  return (
    <>
      {/* Search and Main Filters Hero */}
      <SearchFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />

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

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-nordic-dark/5 overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-nordic-dark/5" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-nordic-dark/5 rounded w-3/4" />
                  <div className="h-3 bg-nordic-dark/5 rounded w-1/2" />
                  <div className="h-5 bg-nordic-dark/5 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property) => (
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
              onClick={handleResetFilters}
              className="mt-4 px-5 py-2 bg-mosque text-white rounded-lg text-sm font-medium hover:bg-mosque/90 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && !isLoading && (
          <div className="mt-12 text-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="px-8 py-3 bg-white border border-nordic-dark/10 hover:border-mosque hover:text-mosque text-nordic-dark font-medium rounded-lg transition-all hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingMore ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Loading...
                </span>
              ) : (
                "Load more properties"
              )}
            </button>
          </div>
        )}
      </section>
    </>
  );
}
