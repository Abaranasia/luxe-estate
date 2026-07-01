import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/admin";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  if (!profile) redirect("/login");
  if (profile.role !== "admin") redirect("/");

  const displayName = profile.full_name ?? profile.email ?? undefined;

  return (
    <div className="min-h-screen bg-background-light flex flex-col">
      <AdminNav
        avatarUrl={profile.avatar_url}
        displayName={displayName}
      />
      <main className="flex-grow">{children}</main>
    </div>
  );
}
