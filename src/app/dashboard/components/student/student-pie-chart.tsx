"use client";

import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartSkillLevelData = [
  { level: "Basic", visitors: 10, fill: "var(--color-Basic)" },
  { level: "Intermediate", visitors: 11, fill: "var(--color-Intermediate)" },
  { level: "Advance", visitors: 9, fill: "var(--color-Advance)" },
  { level: "Professional", visitors: 4, fill: "var(--color-Professional)" },
];

const chartSkillTypeData = [
  { type: "Soft", visitors: 10, fill: "var(--color-Soft)" },
  { type: "Hard", visitors: 11, fill: "var(--color-Hard)" },
  { type: "Programming", visitors: 9, fill: "var(--color-Programming)" },
];

const skillLevelChartConfig = {
  level: {
    label: "level",
  },
  Basic: {
    label: "Basic",
    color: "hsl(var(--chart-1))",
  },
  Intermediate: {
    label: "Intermediate",
    color: "hsl(var(--chart-2))",
  },
  Advance: {
    label: "Advance",
    color: "hsl(var(--chart-3))",
  },
  Professional: {
    label: "Professional",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

const skillTypeChartConfig = {
  type: {
    label: "type",
  },
  Soft: {
    label: "Soft",
    color: "hsl(var(--chart-1))",
  },
  Hard: {
    label: "hard",
    color: "hsl(var(--chart-2))",
  },
  Programming: {
    label: "Programming",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function StudentPieChart() {
  return (
    <Card className="flex items-center bg-slate-200">
      <CardContent className="flex flex-1 pb-0">
        <div className="flex-1 justify-items-center">
          <CardTitle>Skill Level</CardTitle>
          <ChartContainer
            config={skillLevelChartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartSkillLevelData}
                dataKey="visitors"
                nameKey="level"
              />
              {/* <ChartLegend
                content={<ChartLegendContent nameKey="level" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              /> */}
            </PieChart>
          </ChartContainer>
        </div>
        <div className="flex-1 justify-items-center">
          <CardTitle>SKill Type</CardTitle>
          <ChartContainer
            config={skillTypeChartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartSkillTypeData}
                dataKey="visitors"
                nameKey="type"
              />
              {/* <ChartLegend
                content={<ChartLegendContent nameKey="type" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              /> */}
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
