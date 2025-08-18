import { cn } from "@/lib/utils";
import { UserCircle2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MOCK_USERNAME, NAV_ITEMS } from "../../Header";

interface MobileHeaderDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const MobileHeaderDrawer = ({ open, onClose }: MobileHeaderDrawerProps) => {
  const navigate = useNavigate();

  const handleNavigate = (to: string) => {
    navigate(to);
    onClose();
  };

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-50 md:hidden",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/30 transition-opacity",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-72 bg-orange-50 border-r border-orange-100 shadow-lg transition-transform",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <UserCircle2 className={cn("h-6 w-6 text-orange-600")} />
            <div className="flex flex-col leading-tight">
              <span className={cn("text-xs  text-stone-500")}>Bem-vindo(a)</span>
              <span className={cn("text-sm font-medium text-stone-700 ")}>{MOCK_USERNAME}</span>
            </div>
          </div>
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-stone-200/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
          >
            <X className="h-5 w-5 text-stone-700" />
          </button>
        </div>

        <div className="px-2 pt-2">
          {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
            <button
              key={to}
              onClick={() => handleNavigate(to)}
              className="flex w-full items-center gap-3 rounded-md
               px-3 py-3 text-left text-sm font-medium text-stone-700 hover:bg-stone-200/60"
            >
              <Icon className={cn("h-5 w-5 text-stone-700")} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
