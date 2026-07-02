"use client";

import { useTransition } from "react";
import { deleteProperty } from "@/app/admin/properties/actions";

export default function DeletePropertyButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!confirm("Delete this property? This cannot be undone.")) return;
    startTransition(() => deleteProperty(id));
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title="Delete"
      className="p-1.5 rounded-md text-nordic-dark/50 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
    >
      <span className="material-icons text-base">
        {isPending ? "hourglass_empty" : "delete"}
      </span>
    </button>
  );
}
