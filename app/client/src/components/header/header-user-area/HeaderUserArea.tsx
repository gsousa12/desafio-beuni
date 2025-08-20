import { useMobileDetect } from "@/_shared/hooks/useMobileDetect";
import { HeaderAvatar } from "../header-avatar/HeaderAvatar";
import { JwtPayloadType } from "@packages/types";

interface HeaderUserAreaProps {
  user: JwtPayloadType | null;
}

export const HeaderUserArea = ({ user }: HeaderUserAreaProps) => {
  const isMobile = useMobileDetect();
  return (
    <div className="flex items-center gap-3">
      <HeaderAvatar user={user} />
      {!isMobile && (
        <div className="flex flex-col leading-tight">
          <span className="text-xs text-stone-500">Bem-vindo(a)</span>
          <div className="text-sm font-medium text-stone-700">{user?.full_name}</div>
        </div>
      )}
    </div>
  );
};
