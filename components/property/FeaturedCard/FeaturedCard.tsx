"use client";

import { Property } from "@/types/property";

interface FeaturedCardProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function FeaturedCard({
  property,
  isFavorite,
  onToggleFavorite,
}: FeaturedCardProps) {
  const {
    title,
    location,
    price,
    beds,
    baths,
    area,
    status,
    imageUrl,
    isExclusive,
    isNewArrival,
  } = property;

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

  const formattedArea = new Intl.NumberFormat("en-US").format(area);

  return (
    <div className="group relative rounded-xl overflow-hidden shadow-soft bg-white cursor-pointer flex flex-col h-full">
      <div className="aspect-[4/3] w-full overflow-hidden relative">
        <img
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={imageUrl}
        />
        
        {/* Badges */}
        {isExclusive && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-nordic-dark">
            Exclusive
          </div>
        )}
        {isNewArrival && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-nordic-dark">
            New Arrival
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-all ${
            isFavorite
              ? "bg-mosque text-white scale-110 shadow-md"
              : "bg-white/90 text-nordic-dark hover:bg-mosque hover:text-white"
          }`}
        >
          <span className="material-icons text-xl">
            {isFavorite ? "favorite" : "favorite_border"}
          </span>
        </button>
        <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
      </div>

      {/* Details content */}
      <div className="p-6 relative flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 gap-4">
          <div>
            <h3 className="text-xl font-medium text-nordic-dark group-hover:text-mosque transition-colors">
              {title}
            </h3>
            <p className="text-nordic-muted text-sm flex items-center gap-1 mt-1">
              <span className="material-icons text-sm">place</span> {location}
            </p>
          </div>
          <span className="text-xl font-semibold text-mosque whitespace-nowrap">
            {formattedPrice}
            {status === "rent" && <span className="text-sm font-normal text-nordic-muted">/mo</span>}
          </span>
        </div>

        <div className="flex items-center gap-6 mt-auto pt-6 border-t border-nordic-dark/5">
          <div className="flex items-center gap-2 text-nordic-muted text-sm">
            <span className="material-icons text-lg">king_bed</span> {beds} Beds
          </div>
          <div className="flex items-center gap-2 text-nordic-muted text-sm">
            <span className="material-icons text-lg">bathtub</span> {baths} Baths
          </div>
          <div className="flex items-center gap-2 text-nordic-muted text-sm">
            <span className="material-icons text-lg">square_foot</span> {formattedArea} m²
          </div>
        </div>
      </div>
    </div>
  );
}
