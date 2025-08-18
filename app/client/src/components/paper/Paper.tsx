interface PaperProps {
  children: React.ReactNode;
}

export const Paper = ({ children }: PaperProps) => {
  return (
    <div className="flex-1 min-h-0 bg-white shadow-md rounded-lg p-6 sm:p-8 lg:p-10 m-4">
      {children}
    </div>
  );
};
