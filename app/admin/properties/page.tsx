import Image from "next/image";
import Link from "next/link";
import { getAllProperties } from "@/lib/admin";
import type { Property } from "@/types/property";
import DeletePropertyButton from "@/components/admin/DeletePropertyButton";

const PAGE_SIZE = 10;

const TYPE_COLORS: Record<Property["type"], string> = {
  house: "bg-blue-100 text-blue-700",
  apartment: "bg-purple-100 text-purple-700",
  villa: "bg-amber-100 text-amber-700",
  penthouse: "bg-pink-100 text-pink-700",
};

export default async function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const { data: properties, total } = await getAllProperties(page, PAGE_SIZE);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-nordic-dark">
            Properties
          </h1>
          <p className="text-nordic-dark/60 mt-1 text-sm">
            {total} properties in the catalogue.
          </p>
        </div>
        <Link
          href="/admin/properties/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-mosque hover:bg-nordic-dark text-white font-medium text-sm shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap"
        >
          <span className="material-icons text-base">add</span>
          Add New Property
        </Link>
      </div>

      {/* Column headers — desktop only */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-5 mb-2 text-xs font-semibold uppercase tracking-wider text-nordic-dark/50">
        <div className="col-span-1" />
        <div className="col-span-3">Title &amp; Location</div>
        <div className="col-span-2">Type</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Price</div>
        <div className="col-span-1">Beds / Baths</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>

      <div className="space-y-3">
        {properties.map((property) => (
          <PropertyRow key={property.id} property={property} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          {page > 1 ? (
            <Link
              href={`?page=${page - 1}`}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-nordic-dark bg-white border border-gray-200 rounded-lg hover:bg-hint-of-green/40 transition-colors"
            >
              <span className="material-icons text-base">chevron_left</span>
              Previous
            </Link>
          ) : (
            <span className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-nordic-dark/30 bg-white border border-gray-100 rounded-lg cursor-not-allowed select-none">
              <span className="material-icons text-base">chevron_left</span>
              Previous
            </span>
          )}

          <span className="text-sm text-nordic-dark/60">
            Page <span className="font-semibold text-nordic-dark">{page}</span> of{" "}
            <span className="font-semibold text-nordic-dark">{totalPages}</span>
          </span>

          {page < totalPages ? (
            <Link
              href={`?page=${page + 1}`}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-nordic-dark bg-white border border-gray-200 rounded-lg hover:bg-hint-of-green/40 transition-colors"
            >
              Next
              <span className="material-icons text-base">chevron_right</span>
            </Link>
          ) : (
            <span className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-nordic-dark/30 bg-white border border-gray-100 rounded-lg cursor-not-allowed select-none">
              Next
              <span className="material-icons text-base">chevron_right</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function PropertyRow({ property }: { property: Property }) {
  const thumb = property.images?.[0];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:bg-hint-of-green/30 transition-colors p-4 flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
      {/* Thumbnail */}
      <div className="col-span-1 flex-shrink-0">
        {thumb ? (
          <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={thumb}
              alt={property.title}
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="h-12 w-12 rounded-lg bg-background-light flex items-center justify-center">
            <span className="material-icons text-nordic-dark/30 text-xl">
              apartment
            </span>
          </div>
        )}
      </div>

      {/* Title + location */}
      <div className="col-span-3 overflow-hidden w-full">
        <p className="text-sm font-bold text-nordic-dark truncate">
          {property.title}
        </p>
        <p className="text-xs text-nordic-dark/60 truncate flex items-center gap-1 mt-0.5">
          <span className="material-icons text-[14px]">location_on</span>
          {property.location}
        </p>
      </div>

      {/* Type badge */}
      <div className="col-span-2 w-full">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium capitalize ${TYPE_COLORS[property.type]}`}
        >
          {property.type}
        </span>
      </div>

      {/* Status badge */}
      <div className="col-span-2 w-full">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
            property.status === "sale"
              ? "bg-mosque/10 text-mosque"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {property.status === "sale" ? "For Sale" : "For Rent"}
        </span>
      </div>

      {/* Price */}
      <div className="col-span-2 w-full">
        <p className="text-sm font-semibold text-nordic-dark">
          ${property.price.toLocaleString()}
        </p>
      </div>

      {/* Beds / Baths */}
      <div className="col-span-1 w-full">
        <p className="text-xs text-nordic-dark/70">
          {property.beds}
          <span className="material-icons text-[11px] mx-0.5 align-middle">
            bed
          </span>{" "}
          / {property.baths}
          <span className="material-icons text-[11px] mx-0.5 align-middle">
            bathroom
          </span>
        </p>
      </div>

      {/* Actions */}
      <div className="col-span-1 flex items-center justify-end gap-1 w-full">
        <Link
          href={`/admin/properties/${property.id}/edit`}
          className="p-1.5 rounded-md text-nordic-dark/50 hover:text-mosque hover:bg-mosque/10 transition-colors"
          title="Edit"
        >
          <span className="material-icons text-base">edit</span>
        </Link>
        <DeletePropertyButton id={property.id} />
      </div>
    </div>
  );
}
