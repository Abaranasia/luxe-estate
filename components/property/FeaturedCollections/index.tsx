"use client";

import { useState, useEffect } from "react";
import FeaturedCard from "@/components/property/FeaturedCard";
import { getFeaturedProperties } from "@/lib/properties";
import { Property } from "@/types/property";

export default function FeaturedCollections() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    getFeaturedProperties().then((data) => {
      setProperties(data);
      setIsLoading(false);
    });
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  if (isLoading) {
    return (
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
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {Array.from({ length: 2 }).map((_, i) => (
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
      </section>
    );
  }

  return (
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
        {properties.map((property) => (
          <FeaturedCard
            key={property.id}
            property={property}
            isFavorite={favorites.includes(property.id)}
            onToggleFavorite={() => toggleFavorite(property.id)}
          />
        ))}
      </div>
    </section>
  );
}