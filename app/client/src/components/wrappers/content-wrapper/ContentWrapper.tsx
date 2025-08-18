import { ReactNode } from "react";

interface ContentWrapperProps {
  children: ReactNode;
}

export const ContentWrapper = ({ children }: ContentWrapperProps) => {
  return (
    <div className="flex-1 min-h-0 bg-gray-100 px-4 sm:px-8 lg:px-20 py-6 lg:py-8">{children}</div>
  );
};
