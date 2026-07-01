import { createSupabaseServer } from "./supabase-server";
import { PropertyRow, toProperty } from "@/types/property";
import type { Property } from "@/types/property";

export type UserRole = "admin" | "broker" | "agent" | "viewer";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_suspended: boolean;
  created_at: string;
}

export interface AdminStats {
  totalProperties: number;
  totalUsers: number;
  usersByRole: Record<UserRole, number>;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (data as Profile) ?? null;
}

export async function getAllProfiles(): Promise<Profile[]> {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Profile[];
}

export async function getAllProperties(): Promise<Property[]> {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as PropertyRow[]).map(toProperty);
}

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createSupabaseServer();

  const [propertiesResult, profilesResult] = await Promise.all([
    supabase
      .from("properties")
      .select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("role"),
  ]);

  const totalProperties = propertiesResult.count ?? 0;
  const profiles = (profilesResult.data ?? []) as { role: UserRole }[];

  const usersByRole: Record<UserRole, number> = {
    admin: 0,
    broker: 0,
    agent: 0,
    viewer: 0,
  };
  for (const p of profiles) {
    if (p.role in usersByRole) usersByRole[p.role]++;
  }

  return {
    totalProperties,
    totalUsers: profiles.length,
    usersByRole,
  };
}
