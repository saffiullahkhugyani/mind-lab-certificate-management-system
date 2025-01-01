import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

const FilterBar: React.FC = () => {
  return (
    <div className="flex bg-white shadow-md p-4 rounded-md space-x-2">
      {/* Section 1 */}
      <div className=" grid space-y-2 p-2 ">
        <div>
          <Input placeholder="Search for programs" />
        </div>
        <div className="flex items-center space-x-2">
          <Label className="text-md font-bold">Your Contributions</Label>
          <p>Programs Supported: 15</p>
        </div>
      </div>
      {/* Section 2 */}
      <div className="grid p-2 ">
        <div className="flex space-x-4 items-center">
          <Label className="font-bold">Filter by club</Label>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a club" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="item 1">Item 1</SelectItem>
              <SelectItem value="item 2">Item 2</SelectItem>
              <SelectItem value="item 3">Item 3</SelectItem>
              <SelectItem value="item 4">Item 4</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-4 items-center">
          <Label className="font-bold">Filter</Label>
          <RadioGroup defaultValue="comfortable" className="flex space-x-3">
            <div className="flex items-center justify-center space-x-2">
              <RadioGroupItem value="default" id="r1" />
              <Label htmlFor="r1">Enrolled</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="comfortable" id="r2" />
              <Label htmlFor="r2">Request to sponsor</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
