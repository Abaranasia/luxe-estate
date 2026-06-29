"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/lib/i18n";

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: {
    location: string;
    minPrice: number | undefined;
    maxPrice: number | undefined;
    beds: number | undefined;
    baths: number | undefined;
    selectedAmenities: string[];
  }) => void;
  onClearAllFilters?: () => void;
}

const AMENITY_OPTIONS = [
  { value: "swimming_pool", label: "filters.amenitiesSwimmingPool", icon: "pool" },
  { value: "gym", label: "filters.amenitiesGym", icon: "fitness_center" },
  { value: "parking", label: "filters.amenitiesParking", icon: "local_parking" },
  { value: "air_conditioning", label: "filters.amenitiesAirConditioning", icon: "ac_unit" },
  { value: "wifi", label: "filters.amenitiesWifi", icon: "wifi" },
  { value: "deck", label: "filters.amenitiesDeck", icon: "deck" },
];

export default function FiltersModal({
  isOpen,
  onClose,
  onApplyFilters,
  onClearAllFilters,
}: FiltersModalProps) {
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [beds, setBeds] = useState(0);
  const [baths, setBaths] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const { t } = useTranslation();

  // Reset state when modal opens (using ref to detect open transition)
  const prevIsOpenRef = useRef<boolean>(false);
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      setLocation("");
      setMinPrice("");
      setMaxPrice("");
      setBeds(0);
      setBaths(0);
      setSelectedAmenities([]);
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAmenityToggle = (value: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(value)
        ? prev.filter((a) => a !== value)
        : [...prev, value]
    );
  };

  const handleClearAll = () => {
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setBeds(0);
    setBaths(0);
    setSelectedAmenities([]);
    onClearAllFilters?.();
    onClose();
  };

  const handleShowHomes = () => {
    onApplyFilters({
      location,
      minPrice: minPrice ? Number(minPrice.replace(/,/g, "")) : undefined,
      maxPrice: maxPrice ? Number(maxPrice.replace(/,/g, "")) : undefined,
      beds: beds > 0 ? beds : undefined,
      baths: baths > 0 ? baths : undefined,
      selectedAmenities,
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
<header className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-30">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{t("filters.amenities")}</h1>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          >
            <span className="material-icons">close</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-10">
          <section>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {t("filters.location")}
            </label>
            <div className="relative group">
              <span className="material-icons absolute left-4 top-3.5 text-gray-400 group-focus-within:text-mosque transition-colors">
                location_on
              </span>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-clear-day border-0 rounded-lg text-nordic-dark placeholder-gray-400 focus:ring-2 focus:ring-mosque outline-none transition-all shadow-sm"
                placeholder={t("filters.locationPlaceholder")}
              />
            </div>
          </section>

          <section>
            <div className="flex justify-between items-end mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t("filters.priceRange")}
              </label>
              <span className="text-sm font-medium text-mosque">
                {minPrice || maxPrice ? `$${minPrice || "0"} – $${maxPrice || "∞"}` : "$0 – $∞"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-clear-day p-3 rounded-lg border border-transparent focus-within:border-mosque/30 transition-colors">
                <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">
                  {t("filters.minPrice")}
                </label>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-1">$</span>
                  <input
                    type="text"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full bg-transparent border-0 p-0 text-nordic-dark font-medium focus:ring-0 text-sm"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="bg-clear-day p-3 rounded-lg border border-transparent focus-within:border-mosque/30 transition-colors">
                <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">
                  {t("filters.maxPrice")}
                </label>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-1">$</span>
                  <input
                    type="text"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-transparent border-0 p-0 text-nordic-dark font-medium focus:ring-0 text-sm"
                    placeholder={t("filters.noLimit")}
                  />
                </div>
              </div>
            </div>
          </section>

          <section>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              {t("filters.propertyType")}
            </label>
            <p className="text-xs text-gray-500 mb-3">
              {t("filters.propertyTypeHint")}
            </p>
          </section>

          <section>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              {t("filters.bedroomsBathrooms")}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">{t("filters.bedrooms")}</span>
                  <div className="flex items-center space-x-3 bg-clear-day rounded-full p-1">
                    <button
                      onClick={() => setBeds(Math.max(0, beds - 1))}
                      disabled={beds === 0}
                      className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-mosque disabled:opacity-50 transition-colors"
                    >
                      <span className="material-icons text-base">remove</span>
                    </button>
                    <span className="text-sm font-semibold w-4 text-center">
                      {beds > 0 ? `${beds}+` : t("filters.any")}
                    </span>
                    <button
                      onClick={() => setBeds(beds + 1)}
                      className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors"
                    >
                      <span className="material-icons text-base">add</span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">{t("filters.bathrooms")}</span>
                  <div className="flex items-center space-x-3 bg-clear-day rounded-full p-1">
                    <button
                      onClick={() => setBaths(Math.max(0, baths - 1))}
                      disabled={baths === 0}
                      className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-mosque disabled:opacity-50 transition-colors"
                    >
                      <span className="material-icons text-base">remove</span>
                    </button>
                    <span className="text-sm font-semibold w-4 text-center">
                      {baths > 0 ? `${baths}+` : t("filters.any")}
                    </span>
                    <button
                      onClick={() => setBaths(baths + 1)}
                      className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors"
                    >
                      <span className="material-icons text-base">add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              {t("filters.amenities")}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {AMENITY_OPTIONS.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity.value);
                return (
                  <label key={amenity.value} className="cursor-pointer group relative">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleAmenityToggle(amenity.value)}
                      className="sr-only"
                    />
                    <div
                      className={`h-full px-4 py-3 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all ${
                        isSelected
                          ? "border-mosque bg-mosque/5 text-mosque"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <span className={`material-icons text-lg ${isSelected ? "text-mosque" : "text-gray-400"}`}>
                        {amenity.icon}
                      </span>
                      {t(amenity.label)}
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-mosque rounded-full transition-opacity"></div>
                    )}
                  </label>
                );
              })}
            </div>
          </section>
        </div>

        <footer className="bg-white border-t border-gray-100 px-8 py-6 sticky bottom-0 z-30 flex items-center justify-between">
          <button
            onClick={handleClearAll}
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors underline decoration-gray-300 underline-offset-4"
          >
            {t("filters.clearAll")}
          </button>
          <button
            onClick={handleShowHomes}
            className="bg-mosque hover:bg-mosque/90 text-white px-8 py-3 rounded-lg font-medium shadow-lg shadow-mosque/20 transition-all hover:shadow-mosque/30 flex items-center gap-2 transform active:scale-95"
          >
            {t("filters.apply")}
            <span className="material-icons text-sm">arrow_forward</span>
          </button>
        </footer>
      </div>
    </div>
  );
}