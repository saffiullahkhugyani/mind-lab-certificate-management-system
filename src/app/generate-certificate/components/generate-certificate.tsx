"use client";
import React, { useEffect, useRef, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  Form,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import "../generate-certificate-module.css";

import {
  Certificate,
  CustomUploadedCertificate,
  FormattedSkillTags,
  Programs,
  skillCategory,
  SkillTags,
} from "@/types/types";
import { LoadingButton } from "@/components/ui/loading-button";
import { Clubs, SkillType } from "@/types/customs";
import { MultiSelect, Options } from "@/components/ui/multi-select";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { set } from "date-fns";
import { addProgramCertificate } from "../actions";

// schema for form validation
const FormSchema = z.object({
  club_id: z.coerce.number().min(1, { message: "Club is required" }),
  program_id: z.coerce.number().min(1, { message: "Program is required" }),
  issue_year: z.string().min(1, { message: "Issue year is required" }),
  issue_authority: z
    .string()
    .min(2, { message: "Issue authority must be provided" }),
  certificate_name_arabic: z
    .string()
    .min(2, { message: "Certificate Arabic Name is required" })
    .min(2),
  certificate_name_english: z
    .string()
    .min(2, { message: "Certificate English Name is required" }),
  certificate_country: z
    .string()
    .min(2, { message: "Certificate Country is required" }),
  number_of_hours: z.coerce
    .string()
    .min(1, { message: "Number of Hours is required" }),
  skill_level: z.string().min(2, { message: "Skill Level is required" }),
  skill_type: z.string().min(1, { message: "Please select a skill type" }),
  skill_category: z
    .string()
    .min(1, { message: "Please select a skill category" }),
  tags: z.array(z.string()).min(1, { message: "At least select one tag" }),
});

//  type from schema
type FormFields = z.infer<typeof FormSchema>;

interface GenerateCertificateProps {
  skillType: Array<SkillType>;
  skillCategory: skillCategory[];
  skillTags: Array<SkillTags>;
  clubList: Array<Clubs>;
  programList: Array<Programs>;
}

const GenerateCertificate = ({
  skillType,
  skillCategory,
  skillTags,
  clubList,
  programList,
}: GenerateCertificateProps) => {
  const skillLevel = ["Basic", "Intermediate", "Advanced", "Professional"];
  const [isPending, startTransition] = useTransition();
  const [disableCertificate, setDisableCertificate] = useState<boolean>(true);
  const [tags, setTags] = useState<string[] | null>([]);
  const [tagHours, setTagHours] = useState<{ [key: string]: number }>({});
  const [filteredTags, setFilteredTags] = useState<Options[]>([]);
  const [categories, setCategories] = useState<skillCategory[] | null>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Programs[] | null>(
    []
  );

  const { toast } = useToast();
  const router = useRouter();

  // Default values for "edit certificate" mode (when certificate is available)
  // const editCertificateDefaults = {
  //   issue_year: certificate?.issue_year || "",
  //   issue_authority: certificate?.issue_authority || "",
  //   certificate_name_arabic: certificate?.certificate_name_arabic || "",
  //   certificate_name_english: certificate?.certificate_name_english || "",
  //   certificate_country: certificate?.certificate_country || "",
  //   number_of_hours: certificate?.number_of_hours || "",
  //   skill_level: certificate?.skill_level || "",
  //   skill_type:
  //     skillType
  //       .find(
  //         (type) =>
  //           type.skill_type_name!.trim() === certificate?.skill_type?.trim()
  //       )
  //       ?.id.toString() || "",
  //   skill_category:
  //     skillCategory
  //       .find(
  //         (cate) => cate.name?.trim() === certificate?.skill_category?.trim()
  //       )
  //       ?.id?.toString() || "",
  //   tags: certificate?.tags!.map((tag) => tag.tag_name) || [],
  // };

  // Decide which set of default values to use based on whether we are editing or adding
  // const defaultValues = isEdit
  //   ? editCertificateDefaults
  //   : addCertificateDefaults;

  const form = useForm<FormFields>({
    resolver: zodResolver(FormSchema),
    // defaultValues,
  });

  // use effect hook for disabling the form
  useEffect(() => {
    setDisableCertificate(isPending);
  }, [isPending]);

  // setting tags for edit mode
  // useEffect(() => {
  //   if (isEdit) {
  //     const tagList = certificate?.tags!.map((tag) => tag.tag_name);
  //     setTags(tagList!);
  //   }

  //   if (isEdit && certificate?.tags) {
  //     const initialHours = certificate.tags.reduce((acc, tag) => {
  //       acc[tag.tag_name] = tag.hours;
  //       return acc;
  //     }, {} as { [key: string]: number });
  //     setTagHours(initialHours);
  //   }
  // }, [isEdit, certificate]);

  const { reset, watch } = form;

  // useEffect(() => {
  //   reset(defaultValues);
  // }, [certificate, reset]);

  // on focus the layout will change to arabic
  const handleArabicFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.setAttribute("dir", "rtl");
    event.target.setAttribute("lang", "ar");
  };

  // on focus change the layout will return to normal
  const handleArabicBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.removeAttribute("dir");
    event.target.removeAttribute("lang");
  };

  // handle hour change for each tag(s)
  const handleHourChange = (tag: string, hours: number) => {
    setTagHours((prev) => ({
      ...prev,
      [tag]: hours, // Update the hours for the specific tag
    }));
  };

  /*
  using state hook to store form data,
  so when the page is refreshed so we can
  acces the form's previous values to 
  refill the form again.
  */
  // useEffect(() => {
  //   if (!isEdit) {
  //     const subscription = watch((value) => {
  //       localStorage.setItem("formData", JSON.stringify(value));
  //     });

  //     return () => subscription.unsubscribe();
  //   } else {
  //     localStorage.removeItem("formData");
  //   }
  // }, [watch, isEdit]);

  /*
    retriving the form values if the page was refreshed before submitting the form.
  */
  useEffect(() => {
    const savedFormData = localStorage.getItem("formData");
    if (savedFormData) {
      console.log("here", savedFormData);
      setDisableCertificate(false);
      reset(JSON.parse(savedFormData));
    }
  }, [reset]);

  // watching skill type and skill category drop down to filtter tags
  const selectedSkillType = watch("skill_type");
  const selectedSkillCategory = watch("skill_category");

  // initializing form reference from HTML FORM ELEMENT
  const formRef = useRef<HTMLFormElement>(null);

  // use effect hook for filtering tags
  useEffect(() => {
    // filtered tags based on the selected skill type
    const updatedCategories = skillCategory.filter(
      (category) => category.skill_type_id === Number(selectedSkillType)
    );

    setCategories(updatedCategories);
  }, [selectedSkillType, skillCategory]);

  // use effect hook for filtering tags
  useEffect(() => {
    // filtered tags based on the selected skill type
    const updatedTags = skillTags
      .filter((tag) => tag.skill_category_id === Number(selectedSkillCategory))
      .map((tag) => ({ label: tag.name!, value: tag.name! }));

    setFilteredTags(updatedTags);
  }, [selectedSkillCategory, skillTags]);

  // submitting the form
  const onSubmit: SubmitHandler<FormFields> = (data) => {
    // 1. Calculate the total number of hours based on selected tags
    let totalCalculatedHours = 0;
    tags!.forEach((tag) => {
      const hoursForTag = tagHours[tag] || 0; // Default to 0 if not specified
      totalCalculatedHours += hoursForTag;
    });
    // 2. Get the total hours provided for the certificate (assuming you have a form field for this)
    const providedTotalHours = form.getValues("number_of_hours"); // Assuming this is part of your form
    // 3. Compare the total hours with the provided hours
    if (totalCalculatedHours !== Number(providedTotalHours)) {
      alert(
        `The total hours don't match! Calculated: ${totalCalculatedHours}, Provided: ${providedTotalHours}`
      );
      return;
    }
    // if (!isEdit && v1Certificate === null) {
    //   toast({
    //     description: "Please select a certificate to be asserted",
    //     variant: "destructive",
    //   });
    //   return;
    // }
    startTransition(async () => {
      const certificateData = {
        id: null,
        club_id: data.club_id,
        program_id: data.program_id,
        issue_year: data.issue_year,
        issue_authority: data.issue_authority,
        certificate_name_arabic: data.certificate_name_arabic,
        certificate_name_english: data.certificate_name_english,
        certificate_country: data.certificate_country,
        number_of_hours: data.number_of_hours,
        skill_level: data.skill_level,
        skill_type: skillType.find(
          (type) => type.id === Number(data.skill_type)
        )?.skill_type_name!,
        skill_category: skillCategory.find(
          (category) => category.id === Number(data.skill_category)
        )?.name!,
        tags: data.tags.map((tag) => ({
          tag_name: tag,
          hours: tagHours[tag] || 0,
        })),
        certificate_status: true,
      };

      const response = await addProgramCertificate(certificateData);

      if (response.success) {
        toast({
          description: "Program certificate has been added successfully",
          variant: "success",
        });
      }

      if (response.error) {
        toast({
          description: response.error,
          variant: "destructive",
        });
      }
      // if (isEdit) {
      //   const response = await updateCertificate(certificateData);
      //   if (response.success) {
      //     toast({
      //       description: "Certificate has been updated successfully",
      //       variant: "success",
      //     });
      //     router.back();
      //   }
      // } else {
      //   // adding certificate
      //   const response = await addCertificate(certificateData);
      //   // fetching added cetificate id
      //   const v2Id = response?.data?.id!;
      //   // adding mapping for certificates
      //   const certificateMapping = await addCertificateMapping({
      //     userId: v1Certificate?.profiles?.id!,
      //     certificateV1Id: v1Certificate?.id!,
      //     certificateV2Id: v2Id!,
      //   });
      //   if (certificateMapping.success) {
      //     const certificateAssertion = await certificateAsserted({
      //       certificateV1Id: v1Certificate?.id!,
      //     });
      //     if (certificateAssertion.success)
      //       toast({
      //         description: "Certificate has been added successfully",
      //         variant: "success",
      //       });
      //   }
      //   reset({
      //     issue_year: "",
      //     issue_authority: "",
      //     certificate_name_arabic: "",
      //     certificate_name_english: "",
      //     certificate_country: "",
      //     number_of_hours: "",
      //     skill_level: "",
      //     skill_type: "",
      //     skill_category: "",
      //     tags: [],
      //   });
      //   localStorage.removeItem("formData");
      // }
    });
  };
  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className={disableCertificate ? "opacity-50" : ""}
      >
        <fieldset disabled={disableCertificate}>
          <div className="bg-white shadow-md p-4 rounded-md m-2 space-y-4">
            <div>
              <FormLabel className="font-bold text-2xl">
                Generate Certificate
                {/* {isEdit ? "Update Certificate" : "Certificate Details"} */}
              </FormLabel>
            </div>
            {/* Selecting club */}
            <FormField
              control={form.control}
              name="club_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Club </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);

                      // reset program list
                      const programs = programList!.filter(
                        (program) => program.club_id === Number(value)
                      );

                      setFilteredPrograms(programs);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a club">
                          {field.value
                            ? clubList.find(
                                (club) => club.club_id === field.value
                              )?.club_name
                            : "Select a club"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clubList.map((club) => {
                        return (
                          <SelectItem
                            value={club.club_id.toString()!}
                            key={club.club_id!}
                          >
                            {club.club_name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Section : selecting program */}
            <FormField
              control={form.control}
              name="program_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a program">
                          {field.value
                            ? programList!.find(
                                (program) => program.program_id === field.value
                              )?.program_english_name
                            : "Select a program"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredPrograms!.map((program) => {
                        return (
                          <SelectItem
                            value={program.program_id?.toString()!}
                            key={program.program_id!}
                          >
                            {program.program_english_name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="bg-white shadow-md p-4 rounded-md m-2 space-y-4">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="issue_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue year</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Issue year"
                        type="number"
                        onWheel={(e) => (e.target as HTMLElement).blur()}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="issue_authority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue authority</FormLabel>
                    <FormControl>
                      <Input placeholder="Issue authority" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="certificate_name_arabic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certificate arabic name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Certificate arabic name"
                        onFocus={handleArabicFocus}
                        onBlur={handleArabicBlur}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="certificate_name_english"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certificate english name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Certificate english name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="certificate_country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certificate country</FormLabel>
                    <FormControl>
                      <Input placeholder="Certificate country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="number_of_hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certificate Number of hours</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Certificate Number of hours"
                        type="number"
                        onWheel={(e) => (e.target as HTMLElement).blur()}
                        {...field}
                      ></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </div>
          </div>

          {/* Section 3: Level */}
          <div className="gap-2 bg-white shadow-md p-4 rounded-md m-2">
            <FormField
              control={form.control}
              name="skill_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                    disabled={disableCertificate}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a skill level"></SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {skillLevel.map((level, index) => {
                        return (
                          <SelectItem value={level} key={index}>
                            {level}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Section 4: Skills Type */}
          <div className="gap-2 bg-white shadow-md p-4 rounded-md m-2">
            <FormField
              control={form.control}
              name="skill_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill Type</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);

                      console.log(skillCategory);

                      setCategories([]);
                      setFilteredTags([]);
                      setTags([]);
                      setTagHours({});
                    }}
                    value={field.value}
                    defaultValue={field.value}
                    disabled={disableCertificate}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a skill type">
                          {field.value
                            ? skillType.find(
                                (type) => type.id.toString() === field.value
                              )?.skill_type_name
                            : "Select a skill type"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {skillType.map((type, index) => {
                        return (
                          <SelectItem value={type.id.toString()!} key={type.id}>
                            {type.skill_type_name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Section 4: Skills category */}
          <div className="gap-2 bg-white shadow-md p-4 rounded-md m-2">
            <FormField
              control={form.control}
              name="skill_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill Category</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setTags([]);
                      setTagHours({});
                    }}
                    value={field.value}
                    defaultValue={field.value}
                    disabled={disableCertificate}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a skill category">
                          {field.value
                            ? categories!.find(
                                (category) =>
                                  category.id!.toString() === field.value
                              )?.name
                            : "Select a skill type"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories!.map((category, index) => {
                        return (
                          <SelectItem
                            value={category.id?.toString()!}
                            key={category.id}
                          >
                            {category.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Section 5: Tags */}
          <div className="gap-2 bg-white shadow-md p-4 rounded-md m-2">
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <MultiSelect
                      {...field}
                      options={filteredTags}
                      onValueChange={(value) => {
                        // fetching tags
                        field.onChange(value);
                        setTags(value);

                        // reset hours for unselected tags
                        setTagHours((prev) =>
                          Object.keys(prev)
                            .filter((key) => value.includes(key))
                            .reduce((obj, key) => {
                              obj[key] = prev[key];
                              return obj;
                            }, {} as { [key: string]: number })
                        );
                      }}
                      defaultValue={field.value}
                      value={field.value}
                      placeholder="Select a tag"
                      variant={"inverted"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col space-y-2 m-2 mt-4 ">
              {tags!.length > 0 && (
                <p className="text-xl font-bold mt-2">
                  Enter number of hours for selected tag(s)
                </p>
              )}
              <div className="grid grid-cols-3">
                {tags &&
                  tags.map((tag) => (
                    <div
                      key={tag}
                      className="grid grid-cols-2 items-center bg-slate-200 p-2 m-2 border rounded-sm shadow-md hover:cursor-pointer hover:bg-slate-300 "
                    >
                      <p className="font-bold text-lg">{tag}</p>
                      <Input
                        type="number"
                        className="bg-white"
                        placeholder="Number of hours"
                        onWheel={(e) => (e.target as HTMLElement).blur()}
                        value={tagHours[tag] || ""}
                        onChange={(e) =>
                          handleHourChange(
                            tag,
                            parseInt(e.target.value, 10) || 0
                          )
                        }
                      ></Input>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="flex  justify-center m-2 ">
            <LoadingButton loading={isPending} className="w-auto gap-4 m-2">
              Generate certificate
            </LoadingButton>
          </div>
        </fieldset>
      </form>
    </Form>
  );
};

export default GenerateCertificate;
