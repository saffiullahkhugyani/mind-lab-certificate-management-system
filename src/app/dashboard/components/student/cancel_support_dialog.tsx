import React, { Dispatch, SetStateAction } from "react";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Profiles } from "@/types/customs";

interface CancelSupportDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  selectedStudent: Profiles | null;
  onConfirmCancel: () => Promise<void>;
  isProcessing: boolean;
}

export default function CancelSupportDialog({
  isOpen,
  setIsOpen,
  selectedStudent,
  onConfirmCancel,
  isProcessing,
}: CancelSupportDialogProps) {
  return (
    <ResponsiveDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Cancel Support"
      description="Are you sure you want to cancel support for this student?"
    >
      <div className="mt-6 space-y-4">
        <p>
          This action will remove {selectedStudent?.name} from your supported
          students list.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setIsOpen(false);
            }}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirmCancel}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Confirm Cancel Support"}
          </Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
}
