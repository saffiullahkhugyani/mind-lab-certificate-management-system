"use client";

import { LabelList, Pie, PieChart } from "recharts";
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
import { CertificateDetails, Tag } from "@/types/types";

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
  Advanced: {
    label: "Advanced",
    color: "hsl(var(--chart-3))",
  },
  Professional: {
    label: "Professional",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

const skillTypeChartConfig = {
  skillType: {
    label: "Skill Type",
  },
  "Soft skill": {
    label: "Soft",
    color: "hsl(var(--chart-1))",
  },
  "Hard skill": {
    label: "Hard",
    color: "hsl(var(--chart-2))",
  },
  Programming: {
    label: "Programming",
    color: "hsl(var(--chart-3))",
  },
  "Life skill": {
    label: "Life",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

interface StudentPieChartProps {
  studentCertificate: CertificateDetails[] | null;
}

export default function StudentPieChart({
  studentCertificate,
}: StudentPieChartProps) {
  function countCertificates(certificates: CertificateDetails[]) {
    const skillTypeCounts: Record<string, number> = {
      "Hard skill": 0,
      Programming: 0,
      "Soft skill": 0,
      "Life skill": 0,
    };

    const skillLevelCounts: Record<string, number> = {
      Basic: 0,
      Intermediate: 0,
      Advanced: 0,
      Professional: 0,
    };

    const allTags: Tag[] = [];

    certificates.forEach((certificate) => {
      // Check if skill_type exists and is a valid key in skillTypeCounts
      const skillType = certificate.skill_type?.trim();
      const skillLevel = certificate.skill_level?.trim();

      if (skillType && skillLevel) {
        // Check if the skillType is one of the expected ones
        if (skillTypeCounts.hasOwnProperty(skillType)) {
          skillTypeCounts[skillType]++;
        } else {
          console.log(`Unknown skill_type: ${skillType}`);
        }

        // Check if the skillLevel is one of the expected ones
        if (skillLevelCounts.hasOwnProperty(skillLevel)) {
          skillLevelCounts[skillLevel]++;
        } else {
          console.log(`Unknown skill_level: ${skillLevel}`);
        }
      } else {
        console.log(
          `Missing skill_type or skill_level for certificate ID: ${certificate.id}`
        );
      }
    });

    const top3Certificates = certificates
      .sort((a, b) => Number(b.number_of_hours) - Number(a.number_of_hours))
      .slice(0, 3);

    const FormatedChartSkillLevelData = Object.keys(skillLevelCounts).map(
      (level) => ({
        level,
        count: skillLevelCounts[level],
        fill: `var(--color-${level})`,
      })
    );

    const FormatedChartSkillTypeData = Object.keys(skillTypeCounts)
      .map((skillType) => {
        const config =
          skillTypeChartConfig[skillType as keyof typeof skillTypeChartConfig];

        if (!config) {
          console.warn(`No config found for skillType: ${skillType}`);
          return null;
        }

        return {
          skillType: skillType,
          count: skillTypeCounts[skillType],
          fill: "color" in config ? config.color : "default-color", // Fallback to a default color if `color` is not present.
        };
      })
      .filter(Boolean); // Remove any null entries.

    const FormatedChartCertData = top3Certificates.map((cert) => {
      const config =
        skillTypeChartConfig[
          cert.skill_type as keyof typeof skillTypeChartConfig
        ];

      if (!config) {
        console.warn(`No config found for skillType: ${cert.skill_type}`);
        return null;
      }

      return {
        skillType: cert.skill_type,
        hours: Number(cert.number_of_hours),
        fill: "color" in config ? config.color : "default-color", // Fallback to a default color if `color` is not present.
      };
    });

    console.log(FormatedChartSkillTypeData);
    console.log(FormatedChartCertData);

    return {
      FormatedChartCertData,
      FormatedChartSkillLevelData,
      FormatedChartSkillTypeData,
    };
  }

  const result = countCertificates(studentCertificate!);
  // console.log(result);
  console.log(studentCertificate);

  return (
    <Card className="flex items-center bg-slate-200 h-full">
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
                data={result.FormatedChartSkillLevelData}
                dataKey="count"
                nameKey="level"
              />
              <ChartLegend
                content={<ChartLegendContent nameKey="level" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
            </PieChart>
          </ChartContainer>
        </div>
        <div className="flex-1 justify-items-center">
          <CardTitle>Skill Type</CardTitle>
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
                data={result.FormatedChartSkillTypeData}
                dataKey="count"
                nameKey="skillType"
              />
              <ChartLegend
                content={<ChartLegendContent nameKey="skillType" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
            </PieChart>
          </ChartContainer>
        </div>
        <div className="flex-1 justify-items-center">
          <CardTitle>Accumulated skills by type</CardTitle>
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
                data={result.FormatedChartCertData}
                dataKey="hours"
                nameKey="skillType"
              >
                <LabelList
                  dataKey="skillType"
                  className="fill-background"
                  stroke="none"
                  fontSize={12}
                  formatter={(value: keyof typeof skillTypeChartConfig) =>
                    skillTypeChartConfig[value]?.label
                  }
                />
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="skillType" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                key={"skillType"}
              />
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
