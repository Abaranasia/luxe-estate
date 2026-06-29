"use client";

import { Property } from "@/types/property";
import { useTranslation } from "@/lib/i18n";
import { PropertyGallery } from "./PropertyGallery";
import PropertyMap from "@/components/property/PropertyMap";

interface PropertyDetailClientProps {
  property: Property;
  formattedPrice: string;
  monthlyPayment: number;
}

export default function PropertyDetailClient({
  property,
  formattedPrice,
  monthlyPayment,
}: PropertyDetailClientProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
      <div className="lg:col-span-8 space-y-4">
        <PropertyGallery
          images={property.images}
          title={property.title}
          badges={property.isExclusive ? [t("propertyDetail.premium")] : property.isNewArrival ? [t("propertyDetail.new")] : []}
        />

        <section className="bg-white p-8 rounded-xl shadow-sm border border-nordic-dark/5">
          <h2 className="text-lg font-semibold mb-6 text-nordic-dark">{t("propertyDetail.features")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
              <span className="material-icons text-mosque text-2xl mb-2">square_foot</span>
              <span className="text-xl font-bold text-nordic-dark">{property.area}</span>
              <span className="text-xs uppercase tracking-wider text-nordic-muted">{t("propertyDetail.squareMeters")}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
              <span className="material-icons text-mosque text-2xl mb-2">bed</span>
              <span className="text-xl font-bold text-nordic-dark">{property.beds}</span>
              <span className="text-xs uppercase tracking-wider text-nordic-muted">{t("propertyDetail.bedrooms")}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
              <span className="material-icons text-mosque text-2xl mb-2">shower</span>
              <span className="text-xl font-bold text-nordic-dark">{property.baths}</span>
              <span className="text-xs uppercase tracking-wider text-nordic-muted">{t("propertyDetail.bathrooms")}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
              <span className="material-icons text-mosque text-2xl mb-2">directions_car</span>
              <span className="text-xl font-bold text-nordic-dark">2</span>
              <span className="text-xs uppercase tracking-wider text-nordic-muted">{t("propertyDetail.garage")}</span>
            </div>
          </div>
        </section>

        <section className="bg-white p-8 rounded-xl shadow-sm border border-nordic-dark/5">
          <h2 className="text-lg font-semibold mb-4 text-nordic-dark">{t("propertyDetail.about")}</h2>
          <div className="text-nordic-muted leading-relaxed">
            <p className="mb-4">
              {t("propertyDetail.description", { type: t(`search.propertyTypes.${property.type}`), location: property.location })}
            </p>
            <p>
              {t("propertyDetail.description2", { beds: property.beds, baths: property.baths, area: property.area })}
            </p>
          </div>
        </section>

        <section className="bg-white p-8 rounded-xl shadow-sm border border-nordic-dark/5">
          <h2 className="text-lg font-semibold mb-6 text-nordic-dark">{t("propertyDetail.amenitiesTitle")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
            <div className="flex items-center gap-3 text-nordic-muted">
              <span className="material-icons text-mosque/60 text-sm">check_circle</span>
              <span>{t("propertyDetail.amenitiesSmartHome")}</span>
            </div>
            <div className="flex items-center gap-3 text-nordic-muted">
              <span className="material-icons text-mosque/60 text-sm">check_circle</span>
              <span>{t("propertyDetail.amenitiesPool")}</span>
            </div>
            <div className="flex items-center gap-3 text-nordic-muted">
              <span className="material-icons text-mosque/60 text-sm">check_circle</span>
              <span>{t("propertyDetail.amenitiesHVAC")}</span>
            </div>
            <div className="flex items-center gap-3 text-nordic-muted">
              <span className="material-icons text-mosque/60 text-sm">check_circle</span>
              <span>{t("propertyDetail.amenitiesEV")}</span>
            </div>
            <div className="flex items-center gap-3 text-nordic-muted">
              <span className="material-icons text-mosque/60 text-sm">check_circle</span>
              <span>{t("propertyDetail.amenitiesGym")}</span>
            </div>
            <div className="flex items-center gap-3 text-nordic-muted">
              <span className="material-icons text-mosque/60 text-sm">check_circle</span>
              <span>{t("propertyDetail.amenitiesWineCellar")}</span>
            </div>
          </div>
        </section>

        <section className="bg-mosque/5 p-6 rounded-xl border border-mosque/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-full text-mosque shadow-sm">
              <span className="material-icons">calculate</span>
            </div>
            <div>
              <h3 className="font-semibold text-nordic-dark">{t("propertyDetail.estimatedPayment")}</h3>
              <p className="text-sm text-nordic-muted">
                {t("propertyDetail.monthlyFrom")} <strong className="text-mosque">${monthlyPayment.toLocaleString()}/mo</strong> {t("propertyDetail.withDown")}
              </p>
            </div>
          </div>
          <button className="whitespace-nowrap px-4 py-2 bg-white border border-nordic-dark/10 rounded-lg text-sm font-semibold hover:border-mosque transition-colors text-nordic-dark">
            {t("propertyDetail.calculateMortgage")}
          </button>
        </section>
      </div>

      <aside className="lg:col-span-4 relative">
        <div className="sticky top-28 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-nordic-dark/5">
            <div className="mb-4">
              <h1 className="text-4xl font-display font-light text-nordic-dark mb-2">{formattedPrice}</h1>
              <p className="text-nordic-muted font-medium flex items-center gap-1">
                <span className="material-icons text-mosque text-sm">location_on</span>
                {property.location}
              </p>
            </div>

            <div className="h-px bg-slate-100 my-6"></div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-mosque/10 overflow-hidden border-2 border-white shadow-sm">
                <img
                  alt="Sarah Jenkins"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4TxUmdQRb2VMjuaNxLEwLorv_dgHzoET2_wL5toSvew6nhtziaR3DX-U69DBN7J74yO6oKokpw8tqEFutJf13MeXghCy7FwZuAxnoJel6FYcKeCRUVinpZtrNnkZvXd-MY5_2MAtRD7JP5BieHixfCaeAPW04jm-y-nvF3HIrwcZ_HRDk_MrNP5WiPV3u9zNrEgM-SQoWGh4xLVSV444aZAbVl03mjjsW5WBpIeodCyqJxprTDp6Q157D06VxcdUSCf-l9UKQT-w"
                />
              </div>
              <div>
                <h3 className="font-semibold text-nordic-dark">Sarah Jenkins</h3>
                <div className="flex items-center gap-1 text-xs text-mosque font-medium">
                  <span className="material-icons text-[14px]">star</span>
                  <span>{t("propertyDetail.topRatedAgent")}</span>
                </div>
              </div>
              <div className="ml-auto flex gap-2">
                <button className="p-2 rounded-full bg-mosque/10 text-mosque hover:bg-mosque hover:text-white transition-colors" aria-label="Chat with agent">
                  <span className="material-icons text-sm">chat</span>
                </button>
                <button className="p-2 rounded-full bg-mosque/10 text-mosque hover:bg-mosque hover:text-white transition-colors" aria-label="Call agent">
                  <span className="material-icons text-sm">call</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href="#"
                className="w-full bg-mosque hover:bg-[#005544] text-white py-4 px-6 rounded-lg font-medium transition-all shadow-lg shadow-mosque/20 flex items-center justify-center gap-2 group"
              >
                <span className="material-icons text-xl group-hover:scale-110 transition-transform">calendar_today</span>
                {t("propertyDetail.scheduleVisit")}
              </a>
              <a
                href="#"
                className="w-full bg-transparent border border-nordic-dark/10 hover:border-mosque text-nordic-muted hover:text-mosque py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
              >
                <span className="material-icons text-xl">mail_outline</span>
                {t("propertyDetail.contactAgent")}
              </a>
            </div>
          </div>

          {property.lat !== undefined && property.lng !== undefined ? (
            <PropertyMap
              lat={property.lat}
              lng={property.lng}
              title={property.title}
              location={property.location}
            />
          ) : (
            <div className="bg-white p-2 rounded-xl shadow-sm border border-nordic-dark/5">
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                <p className="text-nordic-muted text-sm">{t("propertyDetail.mapUnavailable")}</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}