"use client";

import Image from "next/image";
import { useState } from "react";
import UserRoleDropdown from "./UserRoleDropdown";
import type { Profile, UserRole } from "@/lib/admin";

interface UserCardProps {
  profile: Profile;
}

const ROLE_BADGE: Record<UserRole, string> = {
  admin: "bg-nordic-dark text-white",
  broker: "bg-gray-100 text-gray-600",
  agent: "bg-gray-100 text-gray-600",
  viewer: "bg-gray-100 text-gray-500",
};

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrator",
  broker: "Broker",
  agent: "Agent",
  viewer: "Viewer",
};

export default function UserCard({ profile }: UserCardProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [optimisticRole, setOptimisticRole] = useState<UserRole>(profile.role);
  const [optimisticSuspended, setOptimisticSuspended] = useState(
    profile.is_suspended
  );

  const handleOptimisticUpdate = (role: UserRole, suspended: boolean) => {
    setOptimisticRole(role);
    setOptimisticSuspended(suspended);
  };

  const shortId = profile.id.slice(0, 8).toUpperCase();
  const displayName = profile.full_name ?? profile.email ?? "Unknown User";
  const isActive = !optimisticSuspended;
  const isAdmin = optimisticRole === "admin";

  return (
    <div
      className={`group relative rounded-xl p-5 shadow-sm border transition-all duration-200 flex flex-col md:grid md:grid-cols-12 gap-4 items-center ${
        isAdmin && isActive
          ? "bg-hint-of-green border-transparent"
          : optimisticSuspended
          ? "bg-white border-gray-100 opacity-75"
          : "bg-white border-gray-100 hover:bg-hint-of-green hover:border-transparent"
      }`}
    >
      {/* Col 4: User Details */}
      <div className="col-span-12 md:col-span-4 flex items-center w-full">
        <div className="relative flex-shrink-0">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={displayName}
              width={48}
              height={48}
              className={`h-12 w-12 rounded-full object-cover ${
                optimisticSuspended ? "grayscale" : ""
              } ${isAdmin && isActive ? "border-2 border-white" : ""}`}
            />
          ) : (
            <div
              className={`h-12 w-12 rounded-full flex items-center justify-center bg-gray-200 ${
                optimisticSuspended ? "grayscale" : ""
              }`}
            >
              <span className="material-icons text-gray-400 text-2xl">
                person
              </span>
            </div>
          )}
          {/* Status dot */}
          {!optimisticSuspended && (
            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white" />
          )}
        </div>

        <div className="ml-4 overflow-hidden">
          <p
            className={`text-sm font-bold truncate ${
              optimisticSuspended ? "text-nordic-dark/60" : "text-nordic-dark"
            }`}
          >
            {displayName}
          </p>
          <p
            className={`text-xs truncate ${
              optimisticSuspended ? "text-nordic-dark/40" : "text-nordic-dark/70"
            }`}
          >
            {profile.email}
          </p>
          <span
            className={`mt-1 text-[10px] px-2 py-0.5 inline-block rounded transition-colors ${
              isAdmin && isActive
                ? "bg-white/50 text-nordic-dark/60"
                : "bg-gray-50 text-nordic-dark/50 group-hover:bg-white/50"
            }`}
          >
            ID: #{shortId}
          </span>
        </div>
      </div>

      {/* Col 3: Role & Status */}
      <div className="col-span-12 md:col-span-3 w-full flex items-center justify-between md:justify-start gap-4">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${ROLE_BADGE[optimisticRole]}`}
        >
          {ROLE_LABELS[optimisticRole]}
        </span>
        <div
          className={`flex items-center text-xs ${
            optimisticSuspended ? "text-nordic-dark/40" : "text-nordic-dark/60"
          }`}
        >
          {optimisticSuspended ? (
            <>
              <span className="material-icons text-[14px] mr-1">
                remove_circle_outline
              </span>
              Suspended
            </>
          ) : (
            <>
              <span className="material-icons text-[14px] mr-1 text-mosque">
                check_circle
              </span>
              Active
            </>
          )}
        </div>
      </div>

      {/* Col 3: Performance placeholder */}
      <div className="col-span-12 md:col-span-3 w-full grid grid-cols-2 gap-4">
        <div>
          <p
            className={`text-[10px] uppercase tracking-wider ${
              optimisticSuspended ? "text-nordic-dark/30" : "text-nordic-dark/50"
            }`}
          >
            Properties
          </p>
          <p
            className={`text-sm font-semibold ${
              optimisticSuspended ? "text-nordic-dark/60" : "text-nordic-dark"
            }`}
          >
            {isAdmin ? "—" : "0"}
          </p>
        </div>
        <div>
          <p
            className={`text-[10px] uppercase tracking-wider ${
              optimisticSuspended ? "text-nordic-dark/30" : "text-nordic-dark/50"
            }`}
          >
            {isAdmin ? "Access Level" : "Joined"}
          </p>
          <p
            className={`text-sm font-semibold ${
              optimisticSuspended ? "text-nordic-dark/60" : "text-nordic-dark"
            }`}
          >
            {isAdmin
              ? "Full"
              : new Date(profile.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
          </p>
        </div>
      </div>

      {/* Col 2: Change Role button + dropdown */}
      <div className="col-span-12 md:col-span-2 w-full flex justify-end relative">
        <button
          onClick={() => setIsDropdownOpen((v) => !v)}
          className={`inline-flex items-center px-4 py-2 text-xs font-medium rounded-lg focus:outline-none transition-colors w-full md:w-auto justify-center ${
            isAdmin && isActive
              ? "bg-mosque text-white shadow-md hover:bg-nordic-dark"
              : "border border-gray-200 bg-transparent text-nordic-dark/70 hover:border-nordic-dark hover:text-nordic-dark group-hover:bg-white group-hover:shadow-sm"
          }`}
        >
          Change Role
          <span className="material-icons text-[16px] ml-2">
            {isDropdownOpen ? "expand_less" : "expand_more"}
          </span>
        </button>

        <UserRoleDropdown
          userId={profile.id}
          currentRole={optimisticRole}
          isSuspended={optimisticSuspended}
          isOpen={isDropdownOpen}
          onClose={() => setIsDropdownOpen(false)}
          onOptimisticUpdate={handleOptimisticUpdate}
        />
      </div>
    </div>
  );
}
