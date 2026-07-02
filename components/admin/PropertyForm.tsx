"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { createProperty, updateProperty } from "@/app/admin/properties/actions";
import type { Property } from "@/types/property";

const AMENITY_OPTIONS = [
  "Swimming Pool",
  "Garden",
  "Air Conditioning",
  "Smart Home",
  "Gym",
  "Parking",
  "Wi-Fi",
  "Deck",
];

const PROPERTY_TYPES = [
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "villa", label: "Villa" },
  { value: "penthouse", label: "Penthouse" },
] as const;

interface Props {
  property?: Property;
}

function Counter({
  name,
  label,
  icon,
  initial,
}: {
  name: string;
  label: string;
  icon: string;
  initial: number;
}) {
  const [value, setValue] = useState(initial);
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium text-nordic-dark flex items-center gap-2">
        <span className="material-icons text-gray-400 text-sm">{icon}</span>
        {label}
      </label>
      <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
        <button
          type="button"
          onClick={() => setValue(Math.max(0, value - 1))}
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100"
        >
          -
        </button>
        <input type="hidden" name={name} value={value} />
        <span className="w-10 text-center text-sm font-medium text-nordic-dark">
          {value}
        </span>
        <button
          type="button"
          onClick={() => setValue(value + 1)}
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100"
        >
          +
        </button>
      </div>
    </div>
  );
}

function SectionCard({
  icon,
  title,
  badge,
  children,
  padding = "p-8",
}: {
  icon: string;
  title: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  padding?: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-8 py-6 border-b border-hint-of-green/30 flex items-center justify-between bg-gradient-to-r from-hint-of-green/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-hint-of-green flex items-center justify-center text-nordic-dark">
            <span className="material-icons text-lg">{icon}</span>
          </div>
          <h2 className="text-xl font-bold text-nordic-dark">{title}</h2>
        </div>
        {badge}
      </div>
      <div className={padding}>{children}</div>
    </div>
  );
}

export default function PropertyForm({ property }: Props) {
  const isEdit = !!property;
  const [isPending, startTransition] = useTransition();
  const [images, setImages] = useState<string[]>(property?.images ?? []);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [descLen, setDescLen] = useState((property?.description ?? "").length);

  const addImage = () => {
    const url = newImageUrl.trim();
    if (url) {
      setImages((prev) => [...prev, url]);
      setNewImageUrl("");
    }
  };

  const removeImage = (idx: number) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("images", images.join("\n"));
    startTransition(async () => {
      if (isEdit) {
        await updateProperty(property.id, formData);
      } else {
        await createProperty(formData);
      }
    });
  };

  /* ── Shared button styles ─────────────────────────── */
  const cancelCls =
    "px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-nordic-dark hover:bg-gray-50 transition-colors font-medium text-sm";
  const saveCls =
    "px-5 py-2.5 rounded-lg bg-mosque hover:bg-nordic-dark text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 text-sm disabled:opacity-60";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Header ───────────────────────────────────── */}
      <header className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-gray-200 pb-8">
        <div className="space-y-4">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-500 font-medium">
              <li>
                <Link href="/admin/properties" className="hover:text-mosque transition-colors">
                  Properties
                </Link>
              </li>
              <li>
                <span className="material-icons text-xs text-gray-400">chevron_right</span>
              </li>
              <li className="text-nordic-dark" aria-current="page">
                {isEdit ? "Edit Property" : "Add New"}
              </li>
            </ol>
          </nav>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-nordic-dark tracking-tight mb-2">
              {isEdit ? "Edit Property" : "Add New Property"}
            </h1>
            <p className="text-base text-gray-500 max-w-2xl font-normal">
              {isEdit
                ? "Update the property details below."
                : "Fill in the details below to create a new listing. Fields marked with * are mandatory."}
            </p>
          </div>
        </div>

        {/* Desktop action buttons — hidden on mobile (sticky footer takes over) */}
        <div className="hidden sm:flex gap-3 flex-shrink-0">
          <Link href="/admin/properties" className={cancelCls}>
            Cancel
          </Link>
          <button
            type="submit"
            form="property-form"
            disabled={isPending}
            className={saveCls}
          >
            <span className="material-icons text-sm">save</span>
            {isPending ? "Saving…" : isEdit ? "Save Changes" : "Save Property"}
          </button>
        </div>
      </header>

      {/* ── Two-column form grid ───────────────────── */}
      <form
        id="property-form"
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {/* ── LEFT: Basic info · Description · Gallery ── */}
        <div className="lg:col-span-8 space-y-8">

          {/* Basic Information */}
          <SectionCard icon="info" title="Basic Information">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-nordic-dark mb-1.5" htmlFor="title">
                  Property Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  defaultValue={property?.title}
                  placeholder="e.g. Modern Penthouse with Ocean View"
                  className="w-full text-base px-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic-dark placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-nordic-dark mb-1.5" htmlFor="price">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      required
                      min={0}
                      step="any"
                      defaultValue={property?.price}
                      placeholder="0"
                      className="w-full pl-7 pr-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic-dark placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-nordic-dark mb-1.5" htmlFor="status">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={property?.status ?? "sale"}
                    className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic-dark focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base cursor-pointer"
                  >
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-nordic-dark mb-1.5" htmlFor="type">
                    Property Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    defaultValue={property?.type ?? "apartment"}
                    className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic-dark focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base cursor-pointer"
                  >
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Description */}
          <SectionCard icon="description" title="Description">
            <div className="mb-3 flex gap-2 border-b border-gray-100 pb-2">
              <button type="button" className="p-1.5 text-gray-400 hover:text-nordic-dark hover:bg-gray-50 rounded transition-colors">
                <span className="material-icons text-lg">format_bold</span>
              </button>
              <button type="button" className="p-1.5 text-gray-400 hover:text-nordic-dark hover:bg-gray-50 rounded transition-colors">
                <span className="material-icons text-lg">format_italic</span>
              </button>
              <button type="button" className="p-1.5 text-gray-400 hover:text-nordic-dark hover:bg-gray-50 rounded transition-colors">
                <span className="material-icons text-lg">format_list_bulleted</span>
              </button>
            </div>
            <textarea
              id="description"
              name="description"
              maxLength={2000}
              defaultValue={property?.description}
              onChange={(e) => setDescLen(e.target.value.length)}
              placeholder="Describe the property features, neighborhood, and unique selling points..."
              className="w-full px-4 py-3 rounded-md border border-gray-200 bg-white text-nordic-dark placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base leading-relaxed resize-y min-h-[200px]"
            />
            <div className="mt-2 text-right text-xs text-gray-400">
              {descLen} / 2000 characters
            </div>
          </SectionCard>

          {/* Gallery */}
          <SectionCard
            icon="image"
            title="Gallery"
            badge={
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                JPG, PNG, WEBP
              </span>
            }
          >
            {/* URL input */}
            <div className="flex gap-2 mb-5">
              <input
                id="url-input"
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); addImage(); }
                }}
                placeholder="Paste an image URL and press Enter or click Add"
                className="flex-1 px-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic-dark placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-sm"
              />
              <button
                type="button"
                onClick={addImage}
                className="px-4 py-2.5 rounded-md bg-mosque text-white text-sm font-medium hover:bg-nordic-dark transition-colors flex items-center gap-1.5"
              >
                <span className="material-icons text-base">add</span>
                Add
              </button>
            </div>

            {/* Drop zone */}
            <div className="relative border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 p-10 text-center hover:bg-hint-of-green/10 hover:border-mosque/40 transition-colors cursor-pointer group mb-6">
              <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-mosque group-hover:scale-110 transition-transform duration-300">
                  <span className="material-icons text-2xl">cloud_upload</span>
                </div>
                <div className="space-y-1">
                  <p className="text-base font-medium text-nordic-dark">Click or drag images here</p>
                  <p className="text-xs text-gray-400">Or paste a URL above · Max 5MB per image</p>
                </div>
              </div>
            </div>

            {/* Image grid — 3 columns, taller cards */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {images.map((url, idx) => (
                  <div key={idx} className="relative h-44 rounded-lg overflow-hidden group shadow-sm">
                    <Image
                      src={url}
                      alt={`Property image ${idx + 1}`}
                      fill
                      sizes="(max-width: 640px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-nordic-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="w-8 h-8 rounded-full bg-white text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                      >
                        <span className="material-icons text-sm">delete</span>
                      </button>
                    </div>
                    {idx === 0 && (
                      <span className="absolute top-2 left-2 bg-mosque text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
                        Main
                      </span>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => document.getElementById("url-input")?.focus()}
                  className="h-44 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:text-mosque hover:border-mosque hover:bg-hint-of-green/20 transition-all group"
                >
                  <span className="material-icons group-hover:scale-110 transition-transform">add</span>
                  <span className="text-xs mt-1 font-medium">Add More</span>
                </button>
              </div>
            )}
          </SectionCard>
        </div>

        {/* ── RIGHT: Location · Details · Amenities ──── */}
        <div className="lg:col-span-4 space-y-8">

          {/* Location */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-hint-of-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-of-green/10 to-transparent">
              <div className="w-8 h-8 rounded-full bg-hint-of-green flex items-center justify-center text-nordic-dark">
                <span className="material-icons text-lg">place</span>
              </div>
              <h2 className="text-lg font-bold text-nordic-dark">Location</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-nordic-dark mb-1.5" htmlFor="location">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  defaultValue={property?.location}
                  placeholder="Street Address, City, Zip"
                  className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic-dark placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-nordic-dark mb-1.5" htmlFor="lat">
                    Latitude
                  </label>
                  <input
                    id="lat"
                    name="lat"
                    type="number"
                    step="any"
                    defaultValue={property?.lat}
                    placeholder="0.000000"
                    className="w-full px-3 py-2 rounded border border-gray-200 bg-gray-50 text-nordic-dark focus:bg-white focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-nordic-dark mb-1.5" htmlFor="lng">
                    Longitude
                  </label>
                  <input
                    id="lng"
                    name="lng"
                    type="number"
                    step="any"
                    defaultValue={property?.lng}
                    placeholder="0.000000"
                    className="w-full px-3 py-2 rounded border border-gray-200 bg-gray-50 text-nordic-dark focus:bg-white focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Details + Amenities (sticky on desktop) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            <div className="px-6 py-4 border-b border-hint-of-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-of-green/10 to-transparent">
              <div className="w-8 h-8 rounded-full bg-hint-of-green flex items-center justify-center text-nordic-dark">
                <span className="material-icons text-lg">straighten</span>
              </div>
              <h2 className="text-lg font-bold text-nordic-dark">Details</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block" htmlFor="area">
                    Area (m²)
                  </label>
                  <input
                    id="area"
                    name="area"
                    type="number"
                    min={0}
                    defaultValue={property?.area}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded border border-gray-200 bg-gray-50 text-nordic-dark focus:bg-white focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block" htmlFor="year_built">
                    Year Built
                  </label>
                  <input
                    id="year_built"
                    name="year_built"
                    type="number"
                    min={1800}
                    max={2100}
                    defaultValue={property?.yearBuilt}
                    placeholder="YYYY"
                    className="w-full px-3 py-2 rounded border border-gray-200 bg-gray-50 text-nordic-dark focus:bg-white focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-sm"
                  />
                </div>
              </div>

              <hr className="border-gray-100" />

              <div className="space-y-4">
                <Counter name="beds"   label="Bedrooms"  icon="bed"            initial={property?.beds   ?? 1} />
                <Counter name="baths"  label="Bathrooms" icon="shower"         initial={property?.baths  ?? 1} />
                <Counter name="garage" label="Parking"   icon="directions_car" initial={property?.garage ?? 0} />
              </div>

              <hr className="border-gray-100" />

              <div>
                <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">
                  Amenities
                </h3>
                <div className="space-y-2">
                  {AMENITY_OPTIONS.map((amenity) => (
                    <label key={amenity} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        name="amenities"
                        value={amenity}
                        defaultChecked={property?.amenities?.includes(amenity)}
                        className="w-4 h-4 text-mosque border-gray-300 rounded focus:ring-mosque"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-nordic-dark transition-colors">
                        {amenity}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobile sticky footer ───────────────────── */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-xl sm:hidden z-40 flex gap-3">
          <Link
            href="/admin/properties"
            className="flex-1 py-3 text-center rounded-lg border border-gray-300 bg-white text-nordic-dark font-medium"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 py-3 rounded-lg bg-mosque text-white font-medium flex justify-center items-center gap-2 disabled:opacity-60"
          >
            {isPending ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
