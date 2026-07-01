"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface AdminNavProps {
  avatarUrl?: string | null;
  displayName?: string | null;
}

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/properties", label: "Properties" },
  { href: "/admin/users", label: "Users" },
];

export default function AdminNav({ avatarUrl, displayName }: AdminNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <nav className="bg-white border-b border-nordic-dark/5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex-shrink-0 flex items-center gap-2">
            <span className="material-icons text-mosque text-2xl">apartment</span>
            <span className="font-bold text-lg text-nordic-dark tracking-tight">
              LuxeEstate
            </span>
          </Link>

          <div className="hidden md:flex space-x-8">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-1 py-2 text-sm font-medium transition-colors ${
                  isActive(href)
                    ? "text-mosque border-b-2 border-mosque"
                    : "text-nordic-dark/60 hover:text-mosque"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-5">
          <button className="text-nordic-dark/60 hover:text-mosque transition-colors">
            <span className="material-icons text-xl">search</span>
          </button>
          <button className="text-nordic-dark/60 hover:text-mosque transition-colors relative">
            <span className="material-icons text-xl">notifications</span>
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          <div className="h-8 w-8 rounded-full bg-nordic-dark/10 flex items-center justify-center overflow-hidden border border-nordic-dark/10">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={displayName ?? "Admin"}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="material-icons text-nordic-dark/60 text-lg">
                person
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
