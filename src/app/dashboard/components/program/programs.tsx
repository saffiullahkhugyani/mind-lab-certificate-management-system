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
import FilterBar from "./filter-programs";
import ProgramCard from "./program-card";
import aeronautic from "../../../../assets/aeronautic-program.png";

const programs = [
  {
    image: "/robotics-program.png",
    title: "Robotics Program",
    description:
      "Our Robotics Club sparks innovation through hands-on learning.",
    donatedAmount: "$50,000",
    enrolled: true,
    detailsLink: "https://example.com/robotics",
  },
  {
    image: "/aeronautic-program.png",
    title: "Aeronautic Program",
    description:
      "Soar into STEM with our Flying Club! Members explore aerodynamics.",
    donatedAmount: "$20,000",
    enrolled: true,
    detailsLink: "https://example.com/aeronautics",
  },
  {
    image: "/gravity-race-program.png",
    title: "Gravite Race Program",
    description:
      "Experience the thrill of physics in motion with our Gravity Race!",
    donatedAmount: "$50,000",
    enrolled: true,
    detailsLink: "https://example.com/gravity",
  },
  {
    image: "/little-inventors-program.png",
    title: "Little Inventors Program",
    description:
      "Nurture big ideas in little minds with our Small Inventors program.",
    donatedAmount: "$20,000",
    enrolled: true,
    detailsLink: "https://example.com/inventors",
  },
];

export default function Programs() {
  return (
    <div className="grid space-y-2">
      <FilterBar />
      <div className="grid grid-cols-4 justify-items-center p-4 rounded-md shadow-md bg-slate-100 ">
        {programs.map((program) => {
          return (
            <ProgramCard
              image={program.image}
              title={program.title}
              description={program.description}
              donatedAmount={program.donatedAmount}
              enrolled={program.enrolled}
              detailsLink={program.detailsLink}
            />
          );
        })}
      </div>
    </div>
  );
}
