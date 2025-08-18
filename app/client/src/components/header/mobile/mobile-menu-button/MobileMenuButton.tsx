import { Menu, X } from "lucide-react";

export const MobileMenuButton: React.FC<{ open: boolean; onToggle: () => void }> = ({
  open,
  onToggle,
}) => {
  return (
    <button
      type="button"
      aria-label={open ? "Fechar menu" : "Abrir menu"}
      onClick={onToggle}
      className="inline-flex items-center justify-center rounded-md p-2 
      text-stone-700 hover:bg-stone-200/60 focus:outline-none 
      focus-visible:ring-2 focus-visible:ring-orange-300 md:hidden"
    >
      {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </button>
  );
};
