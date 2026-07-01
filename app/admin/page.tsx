import { getAdminStats } from "@/lib/admin";
import type { UserRole } from "@/lib/admin";

const ROLE_ICONS: Record<UserRole, string> = {
  admin: "shield",
  broker: "business_center",
  agent: "support_agent",
  viewer: "visibility",
};

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admins",
  broker: "Brokers",
  agent: "Agents",
  viewer: "Viewers",
};

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-nordic-dark">
          Dashboard
        </h1>
        <p className="text-nordic-dark/60 mt-1 text-sm">
          Overview of your LuxeEstate platform.
        </p>
      </div>

      {/* Top stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-mosque/10 flex items-center justify-center flex-shrink-0">
            <span className="material-icons text-mosque text-2xl">apartment</span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-nordic-dark/50">
              Total Properties
            </p>
            <p className="text-3xl font-bold text-nordic-dark mt-0.5">
              {stats.totalProperties}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-mosque/10 flex items-center justify-center flex-shrink-0">
            <span className="material-icons text-mosque text-2xl">group</span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-nordic-dark/50">
              Total Users
            </p>
            <p className="text-3xl font-bold text-nordic-dark mt-0.5">
              {stats.totalUsers}
            </p>
          </div>
        </div>
      </div>

      {/* Users by role */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-nordic-dark/50 mb-5">
          Users by Role
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(["admin", "broker", "agent", "viewer"] as UserRole[]).map(
            (role) => (
              <div
                key={role}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-background-light"
              >
                <span className="material-icons text-mosque text-2xl">
                  {ROLE_ICONS[role]}
                </span>
                <p className="text-2xl font-bold text-nordic-dark">
                  {stats.usersByRole[role]}
                </p>
                <p className="text-xs font-medium text-nordic-dark/60">
                  {ROLE_LABELS[role]}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
