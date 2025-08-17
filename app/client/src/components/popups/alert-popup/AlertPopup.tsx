import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"; // ajuste o path se precisar
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";

interface AlertPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  status?: "success" | "error" | "warning" | "info";
}

const statusConfig = {
  success: {
    icon: CheckCircle2,
    color: "text-green-600",
  },
  error: {
    icon: XCircle,
    color: "text-red-600",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-orange-500",
  },
  info: {
    icon: Info,
    color: "text-blue-600",
  },
};

export const AlertPopup = ({
  isOpen,
  onClose,
  title,
  message,
  status = "info",
}: AlertPopupProps) => {
  const { icon: Icon, color } = statusConfig[status];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center justify-center gap-4 py-4">
            <Icon className={`h-16 w-16 ${color}`} />
            <DialogTitle className="text-2xl font-bold text-gray-800 text-center">
              {title}
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="text-base text-gray-700 text-center py-2">{message}</div>
        <DialogFooter className="pt-4">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-md bg-orange-500 
            hover:bg-orange-600 text-white font-semibold 
            transition-colors duration-200 hover:cursor-pointer"
          >
            Entendi
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
