import { useMemo } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { JwtPayloadType } from "@packages/types";

interface HeaderUserAreaProps {
  user: JwtPayloadType | null;
}

export const HeaderAvatar = ({ user }: HeaderUserAreaProps) => {
  const initial = useMemo(() => user?.full_name?.[0]?.toUpperCase() ?? "U", []);
  return (
    <div
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-stone-200 text-stone-700"
      aria-label={`Avatar de ${user?.full_name}`}
    >
      <span className="text-sm font-semibold">{initial}</span>
    </div>
  );
};
