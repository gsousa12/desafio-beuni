import type { ReactNode } from "react";

interface GlobalWrapperProps {
  children: ReactNode;
}

export const GlobalWrapper = ({ children }: GlobalWrapperProps) => {
  return <div className="">{children}</div>;
};
