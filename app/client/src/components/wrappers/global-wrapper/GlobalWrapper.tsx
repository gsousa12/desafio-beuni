import { ReactNode } from "react";

interface GlobalWrapperProps {
  children: ReactNode;
}

export const GlobalWrapper = ({ children }: GlobalWrapperProps) => {
  return <div className="min-h-[100svh] flex flex-col">{children}</div>;
};
