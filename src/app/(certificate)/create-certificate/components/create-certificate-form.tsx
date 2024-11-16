"use client";
import React, { useEffect, useRef, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import "../create-certificate-module.css";
// import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import {
  Certificate,
  CustomUploadedCertificate,
  FormattedSkillTags,
} from "@/types/types";
import { LoadingButton } from "@/components/ui/loading-button";
import { SkillTags, SkillType } from "@/types/customs";
import { MultiSelect, Options } from "@/components/ui/multi-select";
import {
  addCertificate,
  addCertificateMapping,
  certificateAsserted,
  updateCertificate,
} from "../actions";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

// const optionSchema = z.object({
//   label: z.string(),
//   value: z.string(),
//   disable: z.boolean().optional(),
// });

// schema for form validation
const FormSchema = z.object({
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
  skill_type: z.string().min(2, { message: "Please select a skill type" }),
  tags: z.array(z.string()).min(1, { message: "At least select one tag" }),
});

//  type from schema
type FormFields = z.infer<typeof FormSchema>;

interface CreateCertificateProps {
  certificate?: Certificate | null;
  v1Certificate?: CustomUploadedCertificate | null;
  skillType: Array<SkillType>;
  skillTags: Array<FormattedSkillTags>;
  disabled: boolean;
  isEdit: boolean;
  buttonLabel: string;
}

const CreateCertificate = ({
  certificate,
  v1Certificate,
  skillType,
  skillTags,
  disabled,
  isEdit,
  buttonLabel,
}: CreateCertificateProps) => {
  const skillLevel = ["Basic", "Intermediate", "Advanced", "Professional"];
  const [isPending, startTransition] = useTransition();
  const [formValues, setFormValues] = useState<Certificate>();
  const [filteredTags, setFilteredTags] = useState<Options[]>([]);
  const [disableCertificate, setDisableCertificate] = useState<boolean>(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setFormValues(certificate!);
  }, [certificate]);

  // use effect hook for disabling the form
  useEffect(() => {
    setDisableCertificate(disabled || isPending);
  }, [disabled, isPending]);

  // Default values for "add certificate" mode
  const addCertificateDefaults = {
    issue_year: "",
    issue_authority: certificate?.issue_authority || "", // Example of pre-filling some fields
    certificate_name_english: certificate?.certificate_name_english || "",
    certificate_name_arabic: certificate?.certificate_name_arabic || "",
    certificate_country: certificate?.certificate_country || "",
    number_of_hours: "",
    skill_level: "",
    skill_type: "",
    tags: [],
  };

  // Default values for "edit certificate" mode (when certificate is available)
  const editCertificateDefaults = {
    issue_year: certificate?.issue_year || "",
    issue_authority: certificate?.issue_authority || "",
    certificate_name_arabic: certificate?.certificate_name_arabic || "",
    certificate_name_english: certificate?.certificate_name_english || "",
    certificate_country: certificate?.certificate_country || "",
    number_of_hours: certificate?.number_of_hours || "",
    skill_level: certificate?.skill_level || "",
    skill_type: certificate?.skill_type || "",
    tags: certificate?.tags || [],
  };

  // Decide which set of default values to use based on whether we are editing or adding
  const defaultValues = isEdit
    ? editCertificateDefaults
    : addCertificateDefaults;

  const form = useForm<FormFields>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const { reset, watch } = form;

  useEffect(() => {
    reset(defaultValues);
  }, [certificate, reset]);

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

  // watching skill type drop down to filtter tags
  const selectedSkillType = watch("skill_type");

  // initializing form reference from HTML FORM ELEMENT
  const formRef = useRef<HTMLFormElement>(null);

  /*
  using state hook to store form data,
  so when the page is refreshed so we can
  acces the form's previous values to 
  refill the form again.
  */
  useEffect(() => {
    localStorage.removeItem("formData");
    if (!isEdit) {
      const subscription = watch((value) => {
        localStorage.setItem("formData", JSON.stringify(value));
      });

      return () => subscription.unsubscribe();
    }
  }, [watch, isEdit]);

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

  // use effect hook for filtering tags
  useEffect(() => {
    // filtered tags based on the selected skill type
    const updatedTags = skillTags
      .filter((tag) => tag.skill_types === selectedSkillType)
      .map((tag) => ({ label: tag.tag!, value: tag.tag! }));

    setFilteredTags(updatedTags);
  }, [selectedSkillType, skillTags]);

  // submitting the form
  const onSubmit: SubmitHandler<FormFields> = (data) => {
    startTransition(async () => {
      const certificateData = {
        id: isEdit ? certificate?.id! : null,
        issue_year: data.issue_year,
        issue_authority: data.issue_authority,
        certificate_name_arabic: data.certificate_name_arabic,
        certificate_name_english: data.certificate_name_english,
        certificate_country: data.certificate_country,
        number_of_hours: data.number_of_hours,
        skill_level: data.skill_level,
        skill_type: data.skill_type,
        tags: data.tags,
        certificate_status: null,
      };

      if (isEdit) {
        const response = await updateCertificate(certificateData);

        if (response != null) {
          toast({
            description: "Certificate has been updated successfully",
            variant: "success",
          });

          router.back();
        }
      } else {
        const res = await addCertificate(certificateData);
        const v2Id = res?.at(0)?.id;
        const resCertificateMapping = await addCertificateMapping({
          userId: v1Certificate?.profiles?.id!,
          certificateV1Id: v1Certificate?.id!,
          certificateV2Id: v2Id!,
        });

        if (resCertificateMapping != null) {
          const certificateAssertion = await certificateAsserted({
            certificateV1Id: v1Certificate?.id!,
          });

          if (certificateAssertion != null)
            toast({
              description: "Certificate has been added successfully",
              variant: "success",
            });
        }

        reset({
          issue_year: "",
          issue_authority: "",
          certificate_name_arabic: "",
          certificate_name_english: "",
          certificate_country: "",
          number_of_hours: "",
          skill_level: "",
          skill_type: "",
          tags: [],
        });
        localStorage.removeItem("formData");
      }
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
                {isEdit ? "Update Certificate" : "Certificate Details"}
              </FormLabel>
            </div>
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
                    <FormLabel>Number of hours</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Number of hours"
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
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                    disabled={disableCertificate}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a skill type"></SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {skillType.map((type, index) => {
                        return (
                          <SelectItem
                            value={type.skill_type_name!}
                            key={type.id}
                          >
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
                      onValueChange={field.onChange}
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
          </div>
          <div className="flex  justify-center m-2 ">
            <LoadingButton loading={isPending} className="w-auto gap-4 m-2">
              {buttonLabel}
            </LoadingButton>
          </div>
        </fieldset>
      </form>
    </Form>
  );
};

export default CreateCertificate;
