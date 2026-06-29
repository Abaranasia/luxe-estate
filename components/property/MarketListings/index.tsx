"use client";

import { useState, useEffect, useCallback } from "react";
import SearchFilters from "@/components/property/SearchFilters";
import FeaturedCard from "@/components/property/FeaturedCard";
import PropertyCard from "@/components/property/PropertyCard";
import FiltersModal from "@/components/property/FiltersModal";
import { getMarketProperties, getFeaturedProperties } from "@/lib/properties";
import { Property } from "@/types/property";
import { useTranslation } from "@/lib/i18n";

const PAGE_SIZE = 6;

interface FilterState {
  searchQuery: string;
  selectedType: string;
  marketStatus: string;
  locationFilter: string;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  bedsFilter: number | undefined;
  bathsFilter: number | undefined;
  amenitiesFilter: string[];
}

export default function MarketListings() {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    selectedType: "all",
    marketStatus: "all",
    locationFilter: "",
    minPrice: undefined,
    maxPrice: undefined,
    bedsFilter: undefined,
    bathsFilter: undefined,
    amenitiesFilter: [],
  });

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const [marketProperties, setMarketProperties] = useState<Property[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { t } = useTranslation();

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  // Fetch properties — resets on filter change, appends on "load more"
  const fetchProperties = useCallback(async (pageNum: number, append: boolean) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
      setPage(0);
    }

    // Fetch both featured and market properties with same filters
    const [marketResult, featuredResult] = await Promise.all([
      getMarketProperties({
        page: pageNum,
        pageSize: PAGE_SIZE,
        type: filters.selectedType,
        status: filters.marketStatus,
        search: filters.searchQuery,
        location: filters.locationFilter,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        beds: filters.bedsFilter,
        baths: filters.bathsFilter,
        amenities: filters.amenitiesFilter,
      }),
      getFeaturedProperties(),
    ]);

    setMarketProperties((prev) => (append ? [...prev, ...marketResult.data] : marketResult.data));
    setTotalCount(marketResult.count);
    setFeaturedProperties(featuredResult);

    if (append) {
      setIsLoadingMore(false);
    } else {
      setIsLoading(false);
    }
  }, [filters]);

  // Apply client-side filtering to properties
  const filterProperty = (property: Property): boolean => {
    // Filter by search query (title or location)
    if (filters.searchQuery.trim()) {
      const term = filters.searchQuery.toLowerCase();
      if (!property.title.toLowerCase().includes(term) &&
          !property.location.toLowerCase().includes(term)) {
        return false;
      }
    }

    // Filter by type
    if (filters.selectedType !== "all" && property.type !== filters.selectedType) {
      return false;
    }

    // Filter by status
    if (filters.marketStatus !== "all") {
      const dbStatus = filters.marketStatus === "buy" ? "sale" : filters.marketStatus;
      if (property.status !== dbStatus) {
        return false;
      }
    }

    // Filter by location
    if (filters.locationFilter.trim()) {
      const loc = filters.locationFilter.toLowerCase();
      if (!property.location.toLowerCase().includes(loc)) {
        return false;
      }
    }

    // Filter by price range
    if (filters.minPrice !== undefined && property.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== undefined && property.price > filters.maxPrice) {
      return false;
    }

    // Filter by minimum bedrooms
    if (filters.bedsFilter !== undefined && property.beds < filters.bedsFilter) {
      return false;
    }

    // Filter by minimum bathrooms
    if (filters.bathsFilter !== undefined && property.baths < filters.bathsFilter) {
      return false;
    }

    // Filter by amenities (all selected amenities must be present)
    if (filters.amenitiesFilter.length > 0 && property.amenities) {
      const hasAllAmenities = filters.amenitiesFilter.every(amenity =>
        property.amenities!.includes(amenity)
      );
      if (!hasAllAmenities) {
        return false;
      }
    }

    return true;
  };

  const filteredMarketProperties = marketProperties.filter(filterProperty);
  const filteredFeaturedProperties = featuredProperties.filter(filterProperty);
  const allFilteredProperties = [...filteredFeaturedProperties, ...filteredMarketProperties];

  // Check if any filters are active
  const isAnyFilterActive = filters.searchQuery.trim() !== "" ||
    filters.selectedType !== "all" ||
    filters.marketStatus !== "all" ||
    filters.locationFilter.trim() !== "" ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.bedsFilter !== undefined ||
    filters.bathsFilter !== undefined ||
    filters.amenitiesFilter.length > 0;

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

  const hasMore = marketProperties.length < totalCount;

  const handleResetFilters = () => {
    setFilters({
      searchQuery: "",
      selectedType: "all",
      marketStatus: "all",
      locationFilter: "",
      minPrice: undefined,
      maxPrice: undefined,
      bedsFilter: undefined,
      bathsFilter: undefined,
      amenitiesFilter: [],
    });
  };

  const handleApplyFilters = (newFilters: {
    location: string;
    minPrice: number | undefined;
    maxPrice: number | undefined;
    beds: number | undefined;
    baths: number | undefined;
    selectedAmenities: string[];
  }) => {
    setFilters((prev) => ({
      ...prev,
      locationFilter: newFilters.location,
      minPrice: newFilters.minPrice,
      maxPrice: newFilters.maxPrice,
      bedsFilter: newFilters.beds,
      bathsFilter: newFilters.baths,
      amenitiesFilter: newFilters.selectedAmenities,
    }));
  };

  // Close on escape key
  useEffect(() => {
    if (!isFilterModalOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFilterModalOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isFilterModalOpen]);

  return (
    <>
      {/* Search and Main Filters Hero */}
      <SearchFilters
        searchQuery={filters.searchQuery}
        setSearchQuery={(q) => setFilters((prev) => ({ ...prev, searchQuery: q }))}
        selectedType={filters.selectedType}
        setSelectedType={(t) => setFilters((prev) => ({ ...prev, selectedType: t }))}
        onOpenFilters={() => setIsFilterModalOpen(true)}
      />

      {/* Filters Modal */}
      <FiltersModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        onClearAllFilters={handleResetFilters}
      />

      {/* Featured Properties - shown before market properties when no filters active, or included in filtered results */}
      {!isAnyFilterActive && filteredFeaturedProperties.length > 0 && (
        <section className="mb-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-light text-nordic-dark">
                {t("market.featured")}
              </h2>
              <p className="text-nordic-muted text-sm mt-1">
                {t("market.featuredSubtitle")}
              </p>
            </div>
            <a
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-mosque hover:opacity-70 transition-opacity"
              href="#"
            >
              {t("market.viewAll")} <span className="material-icons text-sm">arrow_forward</span>
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredFeaturedProperties.map((property, index) => (
              <FeaturedCard
                key={`${property.id}-${index}`}
                property={property}
                isFavorite={favorites.includes(property.id)}
                onToggleFavorite={() => toggleFavorite(property.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* New in Market Section */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-light text-nordic-dark">
              {isAnyFilterActive ? t("market.searchResults") : t("market.newInMarket")}
            </h2>
            <p className="text-nordic-muted mt-1 text-sm">
              {isAnyFilterActive
                ? t("market.propertiesFound", { count: allFilteredProperties.length })
                : t("market.freshOpportunities")}
            </p>
          </div>

          {/* Buy / Rent Selector - hide when filtering */}
          {!isAnyFilterActive && (
            <div className="flex bg-white p-1 rounded-lg self-start sm:self-auto border border-nordic-dark/5">
              <button
                onClick={() => setFilters((prev) => ({ ...prev, marketStatus: "all" }))}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  filters.marketStatus === "all"
                    ? "bg-nordic-dark text-white shadow-sm"
                    : "text-nordic-muted hover:text-nordic-dark"
                }`}
              >
                {t("market.all")}
              </button>
              <button
                onClick={() => setFilters((prev) => ({ ...prev, marketStatus: "buy" }))}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  filters.marketStatus === "buy"
                    ? "bg-nordic-dark text-white shadow-sm"
                    : "text-nordic-muted hover:text-nordic-dark"
                }`}
              >
                {t("navbar.buy")}
              </button>
              <button
                onClick={() => setFilters((prev) => ({ ...prev, marketStatus: "rent" }))}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  filters.marketStatus === "rent"
                    ? "bg-nordic-dark text-white shadow-sm"
                    : "text-nordic-muted hover:text-nordic-dark"
                }`}
              >
                {t("navbar.rent")}
              </button>
            </div>
          )}
        </div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
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
        ) : isAnyFilterActive ? (
          // When filtering, show both featured and market properties together
          allFilteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allFilteredProperties.map((property, index) => (
                property.featured ? (
                  <FeaturedCard
                    key={`${property.id}-${index}`}
                    property={property}
                    isFavorite={favorites.includes(property.id)}
                    onToggleFavorite={() => toggleFavorite(property.id)}
                  />
                ) : (
                  <PropertyCard
                    key={`${property.id}-${index}`}
                    property={property}
                    isFavorite={favorites.includes(property.id)}
                    onToggleFavorite={() => toggleFavorite(property.id)}
                  />
                )
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-nordic-dark/10">
              <span className="material-symbols-outlined text-5xl text-nordic-muted opacity-65 mb-3">
                domain_disabled
              </span>
              <p className="text-nordic-muted text-lg font-light">
                {t("market.noProperties")}
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 px-5 py-2 bg-mosque text-white rounded-lg text-sm font-medium hover:bg-mosque/90 transition-colors"
              >
                {t("filters.clearAll")}
              </button>
            </div>
          )
        ) : filteredMarketProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMarketProperties.map((property, index) => (
              <PropertyCard
                key={`${property.id}-${index}`}
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
              {t("market.noProperties")}
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-5 py-2 bg-mosque text-white rounded-lg text-sm font-medium hover:bg-mosque/90 transition-colors"
            >
              {t("filters.clearAll")}
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
                  <span className="animate-spin material-icons text-sm">refresh</span>
                  {t("market.loading")}
                </span>
              ) : (
                t("market.loadMore")
              )}
            </button>
          </div>
        )}
      </section>
    </>
  );
}