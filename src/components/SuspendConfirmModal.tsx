import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/lib/toast";

interface SuspendConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "user" | "driver";
  action: "suspend" | "unsuspend";
  name: string;
  onConfirm: () => void;
}

export default function SuspendConfirmModal({
  isOpen,
  onClose,
  type,
  action,
  name,
  onConfirm,
}: SuspendConfirmModalProps) {
  const { success } = useToast();

  const handleConfirm = () => {
    onConfirm();
    success(
      `${type === "user" ? "User" : "Driver"} ${action}ed successfully`,
      `${name} has been ${action}ed from the platform.`
    );
    onClose();
  };

  const isUnsuspend = action === "unsuspend";
  const title = `${isUnsuspend ? "Unsuspend" : "Suspend"} ${type === "user" ? "User" : "Driver"}`;
  const description = isUnsuspend
    ? `Are you sure you want to unsuspend ${name}? They will regain access to the platform and be able to use all services again.`
    : `Are you sure you want to suspend ${name}? They will lose access to the platform and won't be able to use any services until unsuspended.`;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={isUnsuspend ? "" : "bg-destructive text-destructive-foreground hover:bg-destructive/90"}
          >
            {isUnsuspend ? "Unsuspend" : "Suspend"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}