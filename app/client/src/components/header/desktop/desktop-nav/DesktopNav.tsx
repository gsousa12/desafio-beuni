import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "../../Header";

export const DesktopNav = () => {
  return (
    <nav aria-label="Principal" className="flex items-center gap-2">
      {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "group inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive ? "text-orange-600" : "text-stone-700",
              !isActive && "hover:text-orange-600",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
            )
          }
        >
          <Icon className="h-[18px] w-[18px]" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
