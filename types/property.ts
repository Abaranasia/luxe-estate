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
