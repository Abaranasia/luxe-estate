"use client";

import { useState } from "react";
import Image from "next/image";

interface PropertyGalleryProps {
  images: string[];
  title: string;
  badges?: string[];
}

export function PropertyGallery({ images, title, badges = [] }: PropertyGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);

  const currentImage = images[selectedIndex] || "/placeholder.jpg";

  return (
    <>
      {/* Main Image */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-sm group">
        <Image
          alt={title}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          src={currentImage}
          fill
          sizes="(max-width: 1024px) 100vw, 66vw"
          priority
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {badges.map((badge) => (
            <span
              key={badge}
              className={`${
                badge === "Premium" || badge === "Exclusive"
                  ? "bg-mosque text-white"
                  : "bg-white/90 backdrop-blur text-nordic-dark"
              } text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm`}
            >
              {badge}
            </span>
          ))}
        </div>

        {/* View All Photos */}
        {images.length > 1 && (
          <button
            onClick={() => setIsViewAllOpen(true)}
            className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-nordic-dark px-4 py-2 rounded-lg text-sm font-medium shadow-lg backdrop-blur transition-all flex items-center gap-2"
          >
            <span className="material-icons text-sm">grid_view</span>
            View All Photos
          </button>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative flex-none w-48 aspect-[4/3] rounded-lg overflow-hidden cursor-pointer transition-all snap-start ${
                idx === selectedIndex
                  ? "ring-2 ring-mosque ring-offset-2 ring-offset-clear-day"
                  : "opacity-70 hover:opacity-100"
              }`}
              aria-label={`View image ${idx + 1}`}
            >
              <Image
                alt={`${title} ${idx + 1}`}
                className="object-cover"
                src={img}
                fill
                sizes="192px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Simple Lightbox */}
      {isViewAllOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setIsViewAllOpen(false)}
        >
          <button
            onClick={() => setIsViewAllOpen(false)}
            className="absolute top-4 right-4 text-white p-2"
            aria-label="Close gallery"
          >
            <span className="material-icons text-3xl">close</span>
          </button>
          <div className="relative max-w-5xl w-full aspect-video">
            <Image
              alt={title}
              className="object-contain"
              src={images[selectedIndex]}
              fill
              sizes="100vw"
            />
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex(idx);
                }}
                className={`w-3 h-3 rounded-full ${
                  idx === selectedIndex ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}