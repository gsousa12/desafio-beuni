import { useMobileDetect } from "@/_shared/hooks/useMobileDetect";
import { HeaderAvatar } from "../header-avatar/HeaderAvatar";
import { cn } from "@/lib/utils";
import { MOCK_USERNAME } from "../Header";

export const HeaderUserArea = () => {
  const isMobile = useMobileDetect();
  return (
    <div className="flex items-center gap-3">
      <HeaderAvatar />
      {!isMobile && (
        <div className="flex flex-col leading-tight">
          <span className={cn("text-xs text-stone-500")}>Bem-vindo(a)</span>
          <div className={cn("text-sm font-medium text-stone-700")}>{MOCK_USERNAME}</div>
        </div>
      )}
    </div>
  );
};
