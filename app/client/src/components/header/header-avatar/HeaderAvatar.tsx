import { useMemo } from "react";
import { MOCK_USERNAME } from "../Header";

export const HeaderAvatar = () => {
  const initial = useMemo(() => MOCK_USERNAME?.[0]?.toUpperCase() ?? "U", []);
  return (
    <div
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-stone-200 text-stone-700"
      aria-label={`Avatar de ${MOCK_USERNAME}`}
    >
      <span className="text-sm font-semibold">{initial}</span>
    </div>
  );
};
