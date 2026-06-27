"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-light font-sans antialiased px-4">
      <span className="material-symbols-outlined text-6xl text-nordic-muted mb-4">error_outline</span>
      <h2 className="text-2xl font-semibold text-nordic-dark mb-2">Something went wrong</h2>
      <p className="text-nordic-muted mb-6 text-center max-w-md">
        We couldn&apos;t load this property. Please try again or browse our latest listings.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="bg-mosque hover:bg-[#005544] text-white px-6 py-2 rounded-lg transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-6 py-2 border border-nordic-dark/10 rounded-lg text-nordic-dark hover:border-mosque transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}