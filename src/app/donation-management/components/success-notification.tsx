import React, { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessNotificationProps {
  id: number;
  programName: string;
  amount: number;
  onDismiss: () => void;
}

const SuccessNotification: React.FC<SuccessNotificationProps> = ({
  id,
  programName,
  amount,
  onDismiss,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onDismiss();
    }, 60000); // Hide the notification after 60 seconds

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return isVisible ? (
    <div className="max-w-md mx-auto">
      <Alert variant="default" className="bg-green-50">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <AlertTitle className="text-green-800">
          Donation Allocated Successfully
        </AlertTitle>
        <AlertDescription className="text-green-700">
          You have allocated ${amount.toLocaleString()} to the {programName}{" "}
          program. Allocation ID: {id}
        </AlertDescription>
        <div className="mt-4">
          <Button
            onClick={onDismiss}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Make Another Allocation
          </Button>
        </div>
      </Alert>
    </div>
  ) : null;
};

export default SuccessNotification;
