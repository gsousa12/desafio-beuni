import { useMobileDetect } from "../../../_shared/hooks/useMobileDetect";
import { ReactNode } from "react";

interface GlobalWrapperProps {
  children: ReactNode;
}

export const GlobalWrapper = ({ children }: GlobalWrapperProps) => {
  const isMobile = useMobileDetect();
  return <div>{children}</div>;
};
