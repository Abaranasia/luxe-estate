export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  beds: number;
  baths: number;
  area: number; // in square meters (m²)
  type: 'house' | 'apartment' | 'villa' | 'penthouse';
  status: 'sale' | 'rent';
  imageUrl: string;
  isExclusive?: boolean;
  isNewArrival?: boolean;
  featured?: boolean; // True if it should be displayed in the Featured Collections section
}

/** Row shape returned by Supabase (snake_case columns) */
export interface PropertyRow {
  id: string;
  title: string;
  location: string;
  price: number;
  beds: number;
  baths: number;
  area: number;
  type: 'house' | 'apartment' | 'villa' | 'penthouse';
  status: 'sale' | 'rent';
  image_url: string;
  is_exclusive: boolean;
  is_new_arrival: boolean;
  featured: boolean;
  created_at: string;
}

/** Convert a Supabase row to the Property interface used by components */
export function toProperty(row: PropertyRow): Property {
  return {
    id: row.id,
    title: row.title,
    location: row.location,
    price: row.price,
    beds: row.beds,
    baths: row.baths,
    area: row.area,
    type: row.type,
    status: row.status,
    imageUrl: row.image_url,
    isExclusive: row.is_exclusive || undefined,
    isNewArrival: row.is_new_arrival || undefined,
    featured: row.featured || undefined,
  };
}
