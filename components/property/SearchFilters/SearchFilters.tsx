"use client";

import { useTranslation } from "@/lib/i18n";

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  onOpenFilters?: () => void;
}

const propertyTypes = [
  { value: "all", label: "propertyTypes.all" },
  { value: "house", label: "propertyTypes.house" },
  { value: "apartment", label: "propertyTypes.apartment" },
  { value: "villa", label: "propertyTypes.villa" },
  { value: "penthouse", label: "propertyTypes.penthouse" },
];

export default function SearchFilters({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  onOpenFilters,
}: SearchFiltersProps) {
  const { t } = useTranslation();

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-nordic-dark leading-tight">
          {t("search.hero")}
        </h1>

        {/* Search input */}
        <div className="relative group max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-icons text-nordic-muted text-2xl group-focus-within:text-mosque transition-colors">
              search
            </span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-12 pr-4 py-4 rounded-xl border-none bg-white text-nordic-dark shadow-soft placeholder-nordic-muted/60 focus:ring-2 focus:ring-mosque focus:bg-white outline-none transition-all text-lg"
placeholder={t("search.placeholder")}
           />
           <button className="absolute inset-y-2 right-2 px-6 bg-mosque hover:bg-mosque/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-mosque/20">
             {t("search.button")}
           </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-3 overflow-x-auto hide-scroll py-2 px-4 -mx-4">
          {propertyTypes.map((type) => {
            const isActive = selectedType === type.value;
            return (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? "bg-nordic-dark text-white shadow-lg shadow-nordic-dark/10 -translate-y-0.5"
                    : "bg-white border border-nordic-dark/5 text-nordic-muted hover:text-nordic-dark hover:border-mosque/50 hover:bg-mosque/5"
                }`}
              >
                {t(`search.propertyTypes.${type.label}`)}
              </button>
            );
          })}

          <div className="w-px h-6 bg-nordic-dark/10 mx-2"></div>
          
          <button
            onClick={onOpenFilters}
            className="whitespace-nowrap flex items-center gap-1 px-4 py-2 rounded-full text-nordic-dark font-medium text-sm hover:bg-black/5 transition-colors"
          >
            <span className="material-icons text-base">tune</span> {t("search.filters")}
          </button>
        </div>
      </div>
    </section>
  );
}
