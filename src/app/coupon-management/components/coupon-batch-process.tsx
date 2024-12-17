// import { Form } from "@/components/ui/form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import React from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";

// export default function CouponBatchProcess() {
//   const FormSchema = z.object({
//     club_id: z.coerce.number().min(1, "Please select a club"),
//     program_id: z.coerce.number().min(1, "Please select a program"),
//   });

//   // type form from schema
//   type FormFields = z.infer<typeof FormSchema>;

//   const form = useForm({
//     resolver: zodResolver(FormSchema),
//   });
//   const { reset, watch } = form;
//   return (
//     <div className="gap-2 mb-4">
//       {/* <Form>
//             <form>

//             </form>
//       </Form> */}
//     </div>
//   );
// }
