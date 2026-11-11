import { redirect } from "next/navigation";

// Inquiries is the only section for now. When there are more, this becomes an overview.
export default function AdminHome() {
  redirect("/admin/inquiries");
}
