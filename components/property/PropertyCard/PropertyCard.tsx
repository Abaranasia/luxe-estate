"use client";

import { useRouter } from "next/navigation";
import { Property } from "@/types/property";
import { useTranslation } from "@/lib/i18n";

interface PropertyCardProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function PropertyCard({
  property,
  isFavorite,
  onToggleFavorite,
}: PropertyCardProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    title,
    location,
    price,
    beds,
    baths,
    area,
    status,
    images,
    slug,
  } = property;

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

  const primaryImage = images?.[0] || "/placeholder.jpg";

  return (
    <article
      onClick={() => router.push(`/properties/${slug}`)}
      className="bg-white rounded-xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 group cursor-pointer h-full flex flex-col"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={primaryImage}
        />
        
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors flex items-center justify-center ${
            isFavorite
              ? "bg-mosque text-white scale-110 shadow-sm"
              : "bg-white/90 text-nordic-dark hover:bg-mosque hover:text-white"
          }`}
        >
          <span className="material-icons text-lg">
            {isFavorite ? "favorite" : "favorite_border"}
          </span>
        </button>

        {/* Status Tag */}
        <div className={`absolute bottom-3 left-3 text-white text-xs font-bold px-2 py-1 rounded ${
          status === "sale" ? "bg-nordic-dark/90" : "bg-mosque/90"
        }`}>
          {t(`propertyCard.${status === "sale" ? "forSale" : "forRent"}`)}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-baseline mb-2">
          <h3 className="font-bold text-lg text-nordic-dark">
            {formattedPrice}
            {status === "rent" && (
              <span className="text-sm font-normal text-nordic-muted">/mo</span>
            )}
          </h3>
        </div>

        <h4 className="text-nordic-dark font-medium truncate mb-1">
          {title}
        </h4>
        <p className="text-nordic-muted text-xs mb-4">{location}</p>

        {/* Amenities Icons Row */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-nordic-muted text-xs">
            <span className="material-icons text-sm text-mosque/80">king_bed</span> {beds}
          </div>
          <div className="flex items-center gap-1 text-nordic-muted text-xs">
            <span className="material-icons text-sm text-mosque/80">bathtub</span> {baths}
          </div>
          <div className="flex items-center gap-1 text-nordic-muted text-xs">
            <span className="material-icons text-sm text-mosque/80">square_foot</span> {area}m²
          </div>
        </div>
      </div>
    </article>
  );
}