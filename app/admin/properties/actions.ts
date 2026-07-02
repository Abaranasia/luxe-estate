"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";

async function verifyAdminCaller() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") throw new Error("Forbidden");

  return supabase;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createProperty(formData: FormData): Promise<void> {
  const supabase = await verifyAdminCaller();

  const title = formData.get("title") as string;
  const slug = slugify(title);
  const amenities = formData.getAll("amenities") as string[];
  const images = (formData.get("images") as string)
    .split("\n")
    .map((u) => u.trim())
    .filter(Boolean);

  const { error } = await supabase.from("properties").insert({
    title,
    slug,
    price: Number(formData.get("price")),
    status: formData.get("status") as string,
    type: formData.get("type") as string,
    location: formData.get("location") as string,
    description: formData.get("description") as string || null,
    area: Number(formData.get("area")) || 0,
    year_built: Number(formData.get("year_built")) || null,
    beds: Number(formData.get("beds")),
    baths: Number(formData.get("baths")),
    garage: Number(formData.get("garage")),
    amenities: amenities.length ? amenities : null,
    images,
    is_exclusive: false,
    is_new_arrival: false,
    featured: false,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/properties");
  redirect("/admin/properties");
}

export async function updateProperty(
  id: string,
  formData: FormData
): Promise<void> {
  const supabase = await verifyAdminCaller();

  const title = formData.get("title") as string;
  const amenities = formData.getAll("amenities") as string[];
  const images = (formData.get("images") as string)
    .split("\n")
    .map((u) => u.trim())
    .filter(Boolean);

  const { error } = await supabase
    .from("properties")
    .update({
      title,
      slug: slugify(title),
      price: Number(formData.get("price")),
      status: formData.get("status") as string,
      type: formData.get("type") as string,
      location: formData.get("location") as string,
      description: formData.get("description") as string || null,
      area: Number(formData.get("area")) || 0,
      year_built: Number(formData.get("year_built")) || null,
      beds: Number(formData.get("beds")),
      baths: Number(formData.get("baths")),
      garage: Number(formData.get("garage")),
      amenities: amenities.length ? amenities : null,
      images,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/properties");
  redirect("/admin/properties");
}

export async function deleteProperty(id: string): Promise<void> {
  const supabase = await verifyAdminCaller();
  const { error } = await supabase
    .from("properties")
    .update({ is_deleted: true })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/properties");
}
