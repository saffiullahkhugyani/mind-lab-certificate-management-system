import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { Certificate } from "@/types/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { switchCertificateState } from "../actions";

interface DataTableRowActionsProps {
  row: Row<Certificate>;
}

export const DataTableRowActions: React.FC<DataTableRowActionsProps> = ({
  row,
}) => {
  const [isToggled, setIsToggled] = useState<boolean>(false);
  const router = useRouter();

  const handleEdit = () => {
    console.log("Edit:", row.original);

    // Construct the URL with search params
    const params = new URLSearchParams({
      isEdit: JSON.stringify(true),
      certificateData: encodeURIComponent(JSON.stringify(row.original)),
    });

    router.push(`/create-certificate?${params.toString()}`);
  };

  const handleToggle = async () => {
    setIsToggled((prev) => !prev);
    console.log(row.original.id);
    console.log(!isToggled);
    const response = await switchCertificateState(
      row.original.id!,
      !isToggled!
    );
    console.log(response);
  };

  useEffect(() => {
    // filtered tags based on the selected skill type
    if (row.original.certificate_status) {
      setIsToggled(true);
    } else {
      setIsToggled(false);
    }
  }, [row]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
        <DropdownMenuItem className={isToggled ? "bg-green-500" : "bg-acent"}>
          <label className="flex items-center justify-between w-full cursor-pointer">
            <span className="text-sm">Active</span>
            <input
              type="checkbox"
              checked={isToggled}
              onChange={handleToggle}
              className="toggle-checkbox"
            />
          </label>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={!isToggled ? "bg-red-500" : "bg-acent"}
          onClick={handleToggle}
        >
          Inactive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
