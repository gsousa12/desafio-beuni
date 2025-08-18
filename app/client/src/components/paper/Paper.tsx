interface PaperProps {
  children: React.ReactNode;
}

export const Paper = ({ children }: PaperProps) => {
  return (
    <div className="flex-1 min-h-0 bg-white shadow-md rounded-lg p-4 sm:p-2 lg:p-6 m-4">
      {children}
    </div>
  );
};
