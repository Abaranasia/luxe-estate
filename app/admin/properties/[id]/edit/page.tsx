import { notFound } from "next/navigation";
import { getPropertyById } from "@/lib/admin";
import PropertyForm from "@/components/admin/PropertyForm";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getPropertyById(id);
  if (!property) notFound();

  return <PropertyForm property={property} />;
}
