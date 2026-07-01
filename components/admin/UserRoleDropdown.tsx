"use client";

import { useRef, useEffect, useTransition } from "react";
import { updateUserRole, suspendUser } from "@/app/admin/users/actions";
import type { UserRole } from "@/lib/admin";

interface UserRoleDropdownProps {
  userId: string;
  currentRole: UserRole;
  isSuspended: boolean;
  isOpen: boolean;
  onClose: () => void;
  onOptimisticUpdate: (role: UserRole, suspended: boolean) => void;
}

const ROLE_ITEMS: { role: UserRole; icon: string; label: string }[] = [
  { role: "admin", icon: "shield", label: "Administrator" },
  { role: "broker", icon: "business_center", label: "Broker" },
  { role: "agent", icon: "support_agent", label: "Agent" },
  { role: "viewer", icon: "visibility", label: "Viewer" },
];

export default function UserRoleDropdown({
  userId,
  currentRole,
  isSuspended,
  isOpen,
  onClose,
  onOptimisticUpdate,
}: UserRoleDropdownProps) {
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const handleRoleSelect = (role: UserRole) => {
    if (role === currentRole) return onClose();
    onOptimisticUpdate(role, isSuspended);
    onClose();
    startTransition(async () => {
      await updateUserRole(userId, role);
    });
  };

  const handleSuspend = () => {
    const newSuspended = !isSuspended;
    onOptimisticUpdate(currentRole, newSuspended);
    onClose();
    startTransition(async () => {
      await suspendUser(userId, newSuspended);
    });
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 w-48 rounded-lg shadow-lg bg-nordic-dark ring-1 ring-black/5 overflow-hidden z-50"
      style={{ boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)" }}
    >
      <div className="py-1" role="menu">
        {ROLE_ITEMS.map(({ role, icon, label }) => (
          <button
            key={role}
            onClick={() => handleRoleSelect(role)}
            disabled={isPending}
            className={`group flex items-center w-full px-4 py-3 text-xs transition-colors ${
              role === currentRole
                ? "bg-white/10 text-white font-medium"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
            role="menuitem"
          >
            <span className="material-icons text-sm mr-3 text-white/50 group-hover:text-white">
              {icon}
            </span>
            {label}
          </button>
        ))}

        <div className="border-t border-white/10 my-1" />

        <button
          onClick={handleSuspend}
          disabled={isPending}
          className="group flex items-center w-full px-4 py-3 text-xs text-red-300 hover:bg-red-500/20 hover:text-red-100 transition-colors"
          role="menuitem"
        >
          <span className="material-icons text-sm mr-3 text-red-400 group-hover:text-red-200">
            block
          </span>
          {isSuspended ? "Unsuspend User" : "Suspend User"}
        </button>
      </div>
    </div>
  );
}
