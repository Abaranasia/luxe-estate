"use client";

import { useState, useEffect } from "react";

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
  { value: "swimming_pool", label: "Swimming Pool", icon: "pool" },
  { value: "gym", label: "Gym", icon: "fitness_center" },
  { value: "parking", label: "Parking", icon: "local_parking" },
  { value: "air_conditioning", label: "Air Conditioning", icon: "ac_unit" },
  { value: "wifi", label: "High-speed Wifi", icon: "wifi" },
  { value: "deck", label: "Patio / Terrace", icon: "deck" },
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

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocation("");
      setMinPrice("");
      setMaxPrice("");
      setBeds(0);
      setBaths(0);
      setSelectedAmenities([]);
    }
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
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Filters</h1>
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
              Location
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
                placeholder="City, neighborhood, or address"
              />
            </div>
          </section>

          <section>
            <div className="flex justify-between items-end mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Price Range
              </label>
              <span className="text-sm font-medium text-mosque">
                {minPrice || maxPrice ? `$${minPrice || "0"} – $${maxPrice || "∞"}` : "$0 – $∞"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-clear-day p-3 rounded-lg border border-transparent focus-within:border-mosque/30 transition-colors">
                <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">
                  Min Price
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
                  Max Price
                </label>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-1">$</span>
                  <input
                    type="text"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-transparent border-0 p-0 text-nordic-dark font-medium focus:ring-0 text-sm"
                    placeholder="No limit"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Property Type
              </label>
              <div className="relative">
                <select className="w-full bg-clear-day border-0 rounded-lg py-3 pl-4 pr-10 text-nordic-dark appearance-none focus:ring-2 focus:ring-mosque cursor-pointer">
                  <option>Any Type</option>
                  <option>House</option>
                  <option>Apartment</option>
                  <option>Villa</option>
                  <option>Penthouse</option>
                </select>
                <span className="material-icons absolute right-3 top-3 text-gray-400 pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">Bedrooms</span>
                <div className="flex items-center space-x-3 bg-clear-day rounded-full p-1">
                  <button
                    onClick={() => setBeds(Math.max(0, beds - 1))}
                    disabled={beds === 0}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-mosque disabled:opacity-50 transition-colors"
                  >
                    <span className="material-icons text-base">remove</span>
                  </button>
                  <span className="text-sm font-semibold w-4 text-center">
                    {beds > 0 ? `${beds}+` : "Any"}
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
                <span className="text-sm font-medium text-gray-900">Bathrooms</span>
                <div className="flex items-center space-x-3 bg-clear-day rounded-full p-1">
                  <button
                    onClick={() => setBaths(Math.max(0, baths - 1))}
                    disabled={baths === 0}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-mosque disabled:opacity-50 transition-colors"
                  >
                    <span className="material-icons text-base">remove</span>
                  </button>
                  <span className="text-sm font-semibold w-4 text-center">
                    {baths > 0 ? `${baths}+` : "Any"}
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
          </section>

          <section>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Amenities & Features
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {AMENITY_OPTIONS.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity.value);
                return (
                  <label key={amenity.value} className="cursor-pointer group">
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
                      {amenity.label}
                    </div>
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
            Clear all filters
          </button>
          <button
            onClick={handleShowHomes}
            className="bg-mosque hover:bg-mosque/90 text-white px-8 py-3 rounded-lg font-medium shadow-lg shadow-mosque/20 transition-all hover:shadow-mosque/30 flex items-center gap-2 transform active:scale-95"
          >
            Apply Filters
            <span className="material-icons text-sm">arrow_forward</span>
          </button>
        </footer>
      </div>
    </div>
  );
}