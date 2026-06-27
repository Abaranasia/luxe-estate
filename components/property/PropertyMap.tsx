"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface PropertyMapProps {
  lat: number;
  lng: number;
  title: string;
  location: string;
}

export default function PropertyMap({ lat, lng, title, location }: PropertyMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20,
    }).addTo(map);

    const icon = L.divIcon({
      className: "custom-map-marker",
      html: `<div style="
        width: 32px;
        height: 32px;
        background: #006655;
        border: 3px solid #fff;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      "><div style="
        width: 10px;
        height: 10px;
        background: #fff;
        border-radius: 50%;
        transform: rotate(45deg);
      "></div></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    L.marker([lat, lng], { icon })
      .addTo(map)
      .bindPopup(`<strong>${title}</strong><br/>${location}`);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [lat, lng, title, location]);

  return (
    <div className="bg-white p-2 rounded-xl shadow-sm border border-nordic-dark/5">
      <div ref={containerRef} className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-100" />
    </div>
  );
}
