import { ReactNode } from "react";

interface RoutesWrapperProps {
  children: ReactNode;
}

export const RoutesWrapper = ({ children }: RoutesWrapperProps) => {
  return <div className="flex-1 min-h-0 flex flex-col overflow-y-auto">{children}</div>;
};
