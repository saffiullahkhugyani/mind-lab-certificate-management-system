"use server";
import { createClient } from "@/lib/supabase/server";
import { Profiles } from "@/types/customs";
import { Json } from "@/types/supabase";
import { ProgramCertificateMapping, Tag } from "@/types/types";
import { format } from "date-fns";
import { revalidatePath } from "next/cache";

export async function getStudents() {
  try {
    const supabase = await createClient();

    const { data: studentList, error: studentListError } = await supabase
      .from("coupon_student_mapping")
      .select("*,coupons!inner(*, programs!inner(program_english_name)), students!inner(*)");

    if (studentListError) throw new Error(studentListError.message);

    // Step 1: Map the coupon and program information
    const couponProgramInfo = studentList.map((item) => {
      return {
        student_id: item.student_id || "", // safe access
        student_name: item.students?.name || "", // safe access
        coupon_id: item.coupon_id,
        program_id: item.coupons?.program_id,
        program_name: item.coupons?.programs?.program_english_name || "",
      };
    });

    // Step 2: Map the inner students only
    const allStudents = studentList.map((item) => item.students);

    // Step 3: Create a Map to store only unique students by `id`
    const uniqueStudentsMap = new Map();

    for (const student of allStudents) {
      if (!uniqueStudentsMap.has(student.id)) {
        uniqueStudentsMap.set(student.id, student);
      }
    }

    // Step 4: Convert Map values back to array
    const uniqueStudents = Array.from(uniqueStudentsMap.values());

    // console.log("Unique Students: ", uniqueStudents);
    console.log("Coupon Program Info: ", couponProgramInfo);

    return { success: true, data: { students: uniqueStudents, couponsData: couponProgramInfo } };

  } catch (error: any) {
    console.log("Fetching student list error: ", error)
    return { success: false, error: error.message };
  }
}

export async function getProgramCertificates() {
  try {
    const supabase = await createClient();

    const { data: programCertificateList, error: programCertificateListError } = await supabase
      .from("program_certificate")
      .select()
      .order("certificate_name_english", { ascending: false });

    if (programCertificateListError) throw new Error(programCertificateListError.message);

    const transformTags = (tags: Json): Tag[] => {
      // Ensure 'tags' is an array before processing
      if (!Array.isArray(tags)) return [];

      return tags.map((tag: any) => ({
        tag_name: tag.tag_name || null,
        hours: typeof tag.hours === "number" ? tag.hours : null,
      }));
    };

    const certificatesWithTransformedTags = programCertificateList!.map((cert) => ({
      ...cert, // Spread the rest of the properties unchanged
      tags: transformTags(cert.tags), // Only transform the tags field
    }));


    return { success: true, data: certificatesWithTransformedTags };

  } catch (error: any) {
    console.log("Fetching student list error: ", error)
    return { success: false, error: error.message };
  }
}

export async function assignStudentCertificate(data: ProgramCertificateMapping) {
  try {
    const supabase = await createClient();

    const { data: existingMapping, error: existingMappingError } = await supabase
      .from("program_certificate_student_mapping")
      .select()
      .eq("student_id", data.student_id!)
      .eq("program_certificate_id", data.program_certificate_id!);

    if (existingMappingError) throw new Error(existingMappingError.message);
    if (existingMapping && existingMapping.length > 0) {
      return { success: false, error: "Certificate already assigned to student" };
    }

    const { data: programCertificateMapping, error: programCertificateMappingError } = await supabase
      .from("program_certificate_student_mapping")
      .insert(data)
      .select();

    if (programCertificateMappingError) throw new Error(programCertificateMappingError.message);

    revalidatePath("/assign-student-certificate");
    return { success: true, data: programCertificateMapping };

  } catch (error: any) {
    console.log("Fetching student list error: ", error)
    return { success: false, error: error.message };
  }
}


export async function getAssignedProgramCertificate() {
  try {
    const supabase = await createClient();

    const { data: assignedCertificateMapping, error: ssignedCertificateMappingError } = await supabase
      .from("program_certificate_student_mapping")
      .select("*, students!inner(*), program_certificate!inner(*, programs!inner(*))");

    if (ssignedCertificateMappingError) throw new Error(ssignedCertificateMappingError.message);

    if (assignedCertificateMapping && assignedCertificateMapping.length > 0) {
      const transformedData = assignedCertificateMapping.map((item) => {
        return {
          student_id: item.students.id,
          student_name: item.students.name,
          program_certificate_id: item.program_certificate.id,
          certificate_name: item.program_certificate.certificate_name_english,
          program_name: item.program_certificate.programs.program_english_name,
          issue_authority: item.program_certificate.issue_authority,
          number_of_hours: item.program_certificate.number_of_hours,
          tags: Array.isArray(item.program_certificate.tags)
            ? (item.program_certificate.tags as Tag[]).map((tag: Tag) => ({
              tag_name: tag.tag_name,
              hours: tag.hours,
            }))
            : [],
          id: item.id,
          rating: item.rating,
          date: format(new Date(item.created_at), "MMM dd yyyy"),

        };
      });
      console.log("Transformed Data: ", transformedData);

      return { success: true, data: transformedData };

    }
  } catch (error: any) {
    console.log("error:", error.message);
    return { success: false, error: error.message };
  }
}



