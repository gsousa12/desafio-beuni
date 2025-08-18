import { ReactNode } from "react";

interface RoutesWrapperProps {
  children: ReactNode;
}

export const RoutesWrapper = ({ children }: RoutesWrapperProps) => {
  return (
    <div className="col-start-2 row-start-2 flex flex-col overflow-y-auto">
      {children}
    </div>
  );
};
