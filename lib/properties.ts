import { supabase } from "./supabase";
import { Property, PropertyRow, toProperty } from "@/types/property";

/**
 * Fetch a single property by its slug.
 */
export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    console.error("Error fetching property by slug:", error);
    return null;
  }

  return toProperty(data as PropertyRow);
}

/**
 * Fetch all featured properties from Supabase.
 */
export async function getFeaturedProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching featured properties:", error);
    return [];
  }

  return (data as PropertyRow[]).map(toProperty);
}

export interface MarketPropertiesOptions {
  page?: number;
  pageSize?: number;
  type?: string;
  status?: string;
  search?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  amenities?: string[];
}

export interface MarketPropertiesResult {
  data: Property[];
  count: number;
}

/**
 * Fetch paginated, filtered market (non-featured) properties from Supabase.
 * Returns both the data for the requested page and the total count.
 */
export async function getMarketProperties(
  options: MarketPropertiesOptions = {}
): Promise<MarketPropertiesResult> {
  const {
    page = 0,
    pageSize = 6,
    type,
    status,
    search,
    location,
    minPrice,
    maxPrice,
    beds,
    baths,
    amenities,
  } = options;

  let query = supabase
    .from("properties")
    .select("*", { count: "exact" })
    .eq("featured", false)
    .order("created_at", { ascending: false });

  // Filter by property type
  if (type && type !== "all") {
    query = query.eq("type", type);
  }

  // Filter by sale/rent status
  if (status && status !== "all") {
    const dbStatus = status === "buy" ? "sale" : status;
    query = query.eq("status", dbStatus);
  }

  // Filter by search query (title or location)
  if (search && search.trim()) {
    const term = search.trim();
    query = query.or(`title.ilike.%${term}%,location.ilike.%${term}%`);
  }

  // Filter by location (specific location search)
  if (location && location.trim()) {
    const loc = location.trim();
    query = query.ilike("location", `%${loc}%`);
  }

  // Filter by price range
  if (minPrice !== undefined) {
    query = query.gte("price", minPrice);
  }
  if (maxPrice !== undefined) {
    query = query.lte("price", maxPrice);
  }

  // Filter by minimum bedrooms
  if (beds !== undefined) {
    query = query.gte("beds", beds);
  }

  // Filter by minimum bathrooms
  if (baths !== undefined) {
    query = query.gte("baths", baths);
  }

  // Filter by amenities (all selected amenities must be present)
  if (amenities && amenities.length > 0) {
    query = query.contains("amenities", amenities);
  }

  // Apply pagination range
  const from = page * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching market properties:", error);
    return { data: [], count: 0 };
  }

  return {
    data: (data as PropertyRow[]).map(toProperty),
    count: count ?? 0,
  };
}
