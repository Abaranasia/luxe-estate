"use client";

import { useState } from "react";
import UserCard from "./UserCard";
import type { Profile, UserRole } from "@/lib/admin";

interface UserDirectoryProps {
  profiles: Profile[];
}

type TabFilter = "all" | "agent" | "broker" | "admin";

const TABS: { value: TabFilter; label: string }[] = [
  { value: "all", label: "All Users" },
  { value: "agent", label: "Agents" },
  { value: "broker", label: "Brokers" },
  { value: "admin", label: "Admins" },
];

export default function UserDirectory({ profiles }: UserDirectoryProps) {
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [search, setSearch] = useState("");

  const filtered = profiles.filter((p) => {
    const matchesTab =
      activeTab === "all" || (p.role as string) === activeTab;
    const term = search.toLowerCase().trim();
    const matchesSearch =
      !term ||
      (p.full_name?.toLowerCase().includes(term) ?? false) ||
      (p.email?.toLowerCase().includes(term) ?? false);
    return matchesTab && matchesSearch;
  });

  return (
    <>
      {/* Search bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative group w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-icons text-nordic-dark/40 group-focus-within:text-mosque text-xl">
              search
            </span>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email..."
            className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-white text-nordic-dark shadow-sm placeholder-nordic-dark/30 focus:ring-2 focus:ring-mosque focus:outline-none transition-all text-sm"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-nordic-dark/10 overflow-x-auto mb-6">
        {TABS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setActiveTab(value)}
            className={`pb-3 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === value
                ? "text-mosque border-b-2 border-mosque font-semibold"
                : "text-nordic-dark/60 hover:text-nordic-dark"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Column headers — desktop only */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-5 mb-3 text-xs font-semibold uppercase tracking-wider text-nordic-dark/50">
        <div className="col-span-4">User Details</div>
        <div className="col-span-3">Role &amp; Status</div>
        <div className="col-span-3">Performance</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>

      {/* User cards */}
      <div className="space-y-3 pb-12">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-nordic-dark/40">
            <span className="material-icons text-4xl block mb-2">
              person_off
            </span>
            No users match your search.
          </div>
        ) : (
          filtered.map((profile) => (
            <UserCard key={profile.id} profile={profile} />
          ))
        )}
      </div>

      {/* Pagination hint */}
      {filtered.length > 0 && (
        <div className="border-t border-nordic-dark/5 py-5">
          <p className="text-sm text-nordic-dark/60">
            Showing{" "}
            <span className="font-medium text-nordic-dark">
              {filtered.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-nordic-dark">
              {profiles.length}
            </span>{" "}
            users
          </p>
        </div>
      )}
    </>
  );
}
