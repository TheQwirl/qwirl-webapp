import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmationDialogProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  trigger?: React.ReactNode;
  destructive?: boolean;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  isSubmitting = false,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. This will permanently delete the item and remove it from our servers.",
  confirmText = "Delete",
  cancelText = "Cancel",
  trigger,
  destructive = true,
}) => {
  const handleConfirm = () => {
    if (!isSubmitting) {
      onConfirm();
    }
  };

  const DialogContent = (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle className="text-red-600">{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isSubmitting}>
          {cancelText}
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={handleConfirm}
          disabled={isSubmitting}
          className={`${
            destructive ? "bg-red-600 hover:bg-red-700 focus:ring-red-600" : ""
          } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Deleting...
            </div>
          ) : (
            confirmText
          )}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );

  // Controlled mode - when isOpen and onOpenChange are provided
  if (isOpen !== undefined && onOpenChange) {
    return (
      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
        {DialogContent}
      </AlertDialog>
    );
  }

  // Uncontrolled mode - when trigger is provided
  if (trigger) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
        {DialogContent}
      </AlertDialog>
    );
  }

  // Default fallback
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
          Delete
        </button>
      </AlertDialogTrigger>
      {DialogContent}
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;
