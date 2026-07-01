import { getAllProfiles } from "@/lib/admin";
import UserDirectory from "@/components/admin/UserDirectory";

export default async function AdminUsersPage() {
  const profiles = await getAllProfiles();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="pt-8 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-nordic-dark">
              User Directory
            </h1>
            <p className="text-nordic-dark/60 mt-1 text-sm">
              Manage user access and roles for your properties.
            </p>
          </div>
        </div>
      </header>

      <UserDirectory profiles={profiles} />
    </div>
  );
}
