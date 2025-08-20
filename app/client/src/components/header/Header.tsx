import React, { useState } from "react";
import { useMobileDetect } from "@/_shared/hooks/useMobileDetect";
import { cn } from "@/lib/utils";
import { HeaderUserArea } from "./header-user-area/HeaderUserArea";
import { DesktopNav } from "./desktop/desktop-nav/DesktopNav";
import { MobileMenuButton } from "./mobile/mobile-menu-button/MobileMenuButton";
import { MobileHeaderDrawer } from "./mobile/mobile-header-drawer/MobileHeaderDrawer";
import { AlignEndHorizontal, Building2, Gift, LucideProps, Users } from "lucide-react";

export const MOCK_USERNAME = "Tester";

export type LucideIcon = React.ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
>;

type NavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: AlignEndHorizontal },
  { label: "Setores", to: "/sectors", icon: Building2 },
  { label: "Colaboradores", to: "/employees", icon: Users },
  { label: "Brindes", to: "/gifts", icon: Gift },
];

const Logo = () => {
  return (
    <div className="flex items-center">
      <span className="font-semibold italic tracking-tight text-2xl text-orange-600">beuni</span>
    </div>
  );
};

export const Header = () => {
  const isMobile = useMobileDetect();
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 w-full border-b 
      bg-orange-50 border-orange-100 backdrop-blur supports-[backdrop-filter]:bg-orange-50/95"
    >
      <div className="flex h-14 w-full items-center justify-between px-2 sm:px-6">
        <div className="flex items-center gap-3 md:gap-3">
          {isMobile && <MobileMenuButton open={open} onToggle={() => setOpen((v) => !v)} />}
          <Logo />
        </div>
        <HeaderUserArea />
      </div>

      {!isMobile && (
        <div className="flex h-10 items-center px-2 sm:px-3">
          <DesktopNav />
        </div>
      )}

      {isMobile && <MobileHeaderDrawer open={open} onClose={() => setOpen(false)} />}
    </header>
  );
};
