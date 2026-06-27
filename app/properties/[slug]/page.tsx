import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import { getPropertyBySlug } from "@/lib/properties";
import { notFound } from "next/navigation";
import { PropertyGallery } from "./PropertyGallery";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return { title: "Property Not Found" };
  }

  return {
    title: `${property.title} — Luxe Estate`,
    description: `${property.title} in ${property.location}. ${property.beds} beds, ${property.baths} baths, ${property.area} m². ${property.status === "sale" ? "For Sale" : "For Rent"}.`,
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(property.price);

  const monthlyPayment = property.price > 0 ? Math.round(property.price * 0.00434) : 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.title,
    image: property.images,
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "USD",
      availability: property.status === "sale" ? "https://schema.org/InStock" : "https://schema.org/InStock",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: property.location,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-8 space-y-4">
            <PropertyGallery
              images={property.images}
              title={property.title}
              badges={property.isExclusive ? ["Premium"] : property.isNewArrival ? ["New"] : []}
            />

            {/* Property Features */}
            <section className="bg-white p-8 rounded-xl shadow-sm border border-nordic-dark/5">
              <h2 className="text-lg font-semibold mb-6 text-nordic-dark">Property Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                  <span className="material-icons text-mosque text-2xl mb-2">square_foot</span>
                  <span className="text-xl font-bold text-nordic-dark">{property.area}</span>
                  <span className="text-xs uppercase tracking-wider text-nordic-muted">Square Meters</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                  <span className="material-icons text-mosque text-2xl mb-2">bed</span>
                  <span className="text-xl font-bold text-nordic-dark">{property.beds}</span>
                  <span className="text-xs uppercase tracking-wider text-nordic-muted">Bedrooms</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                  <span className="material-icons text-mosque text-2xl mb-2">shower</span>
                  <span className="text-xl font-bold text-nordic-dark">{property.baths}</span>
                  <span className="text-xs uppercase tracking-wider text-nordic-muted">Bathrooms</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                  <span className="material-icons text-mosque text-2xl mb-2">directions_car</span>
                  <span className="text-xl font-bold text-nordic-dark">2</span>
                  <span className="text-xs uppercase tracking-wider text-nordic-muted">Garage</span>
                </div>
              </div>
            </section>

            {/* About this home */}
            <section className="bg-white p-8 rounded-xl shadow-sm border border-nordic-dark/5">
              <h2 className="text-lg font-semibold mb-4 text-nordic-dark">About this home</h2>
              <div className="text-nordic-muted leading-relaxed">
                <p className="mb-4">
                  Discover modern luxury living in this exceptional {property.type} located in {property.location}.
                  Designed with meticulous attention to detail, this residence offers an unparalleled blend of comfort,
                  style, and functionality perfect for discerning homeowners.
                </p>
                <p>
                  Featuring {property.beds} spacious bedrooms and {property.baths} elegant bathrooms across {property.area} square meters,
                  this property embodies contemporary design excellence. Every corner has been thoughtfully crafted to create
                  an atmosphere of refined tranquility.
                </p>
              </div>
            </section>

            {/* Amenities */}
            <section className="bg-white p-8 rounded-xl shadow-sm border border-nordic-dark/5">
              <h2 className="text-lg font-semibold mb-6 text-nordic-dark">Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                <div className="flex items-center gap-3 text-nordic-muted">
                  <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                  <span>Smart Home System</span>
                </div>
                <div className="flex items-center gap-3 text-nordic-muted">
                  <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                  <span>Swimming Pool</span>
                </div>
                <div className="flex items-center gap-3 text-nordic-muted">
                  <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                  <span>Central Heating & Cooling</span>
                </div>
                <div className="flex items-center gap-3 text-nordic-muted">
                  <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                  <span>Electric Vehicle Charging</span>
                </div>
                <div className="flex items-center gap-3 text-nordic-muted">
                  <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                  <span>Private Gym</span>
                </div>
                <div className="flex items-center gap-3 text-nordic-muted">
                  <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                  <span>Wine Cellar</span>
                </div>
              </div>
            </section>

            {/* Estimated Payment */}
            <section className="bg-mosque/5 p-6 rounded-xl border border-mosque/10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-full text-mosque shadow-sm">
                  <span className="material-icons">calculate</span>
                </div>
                <div>
                  <h3 className="font-semibold text-nordic-dark">Estimated Payment</h3>
                  <p className="text-sm text-nordic-muted">
                    Starting from <strong className="text-mosque">${monthlyPayment.toLocaleString()}/mo</strong> with 20% down
                  </p>
                </div>
              </div>
              <button className="whitespace-nowrap px-4 py-2 bg-white border border-nordic-dark/10 rounded-lg text-sm font-semibold hover:border-mosque transition-colors text-nordic-dark">
                Calculate Mortgage
              </button>
            </section>
          </div>

          {/* Right Column - Sticky Sidebar */}
          <aside className="lg:col-span-4 relative">
            <div className="sticky top-28 space-y-6">
              {/* Price Card */}
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
                      <span>Top Rated Agent</span>
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
                    Schedule Visit
                  </a>
                  <a
                    href="#"
                    className="w-full bg-transparent border border-nordic-dark/10 hover:border-mosque text-nordic-muted hover:text-mosque py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-icons text-xl">mail_outline</span>
                    Contact Agent
                  </a>
                </div>
              </div>

              {/* Map */}
              <div className="bg-white p-2 rounded-xl shadow-sm border border-nordic-dark/5">
                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-100">
                  <img
                    alt="Map location"
                    className="w-full h-full object-cover opacity-80"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAam7l6Iva-Ueed4N1BxrVb5SqFJUVl9pnGf_zDG5JYhZmJCe3hLYttkVA-Jg46VljNevhZK7LCxoMpRmKjS0pT1uk0x_WAT5FFVpphw6yGYjroXFGybUkSYCymind4Z7fzrdob5j_VR4DfhQL6Lej-gMQZCuLjZrOjYt0KN97oLy0gZVOIyV1o7woH1F8aOvLzpKUPzcof0KmZdYl7I1uq25G31zdQYTwnQCXvWAQ0Snu1uEKYLQZg4uV4OsqzeOtSu_KCt36ytmw"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-8 h-8 bg-mosque rounded-full border-4 border-white shadow-lg animate-bounce flex items-center justify-center">
                      <span className="material-icons text-white text-sm">home</span>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="absolute bottom-2 right-2 bg-white/90 text-xs font-medium px-2 py-1 rounded shadow-sm text-nordic-dark hover:text-mosque"
                  >
                    View on Map
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 mt-12 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-nordic-muted">
            &copy; 2023 LuxeEstate Inc. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a className="text-nordic-muted hover:text-mosque transition-colors" href="#" aria-label="Facebook">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
            <a className="text-nordic-muted hover:text-mosque transition-colors" href="#" aria-label="Twitter">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}