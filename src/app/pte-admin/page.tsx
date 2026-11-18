import { redirect } from "next/navigation";

export default function PteAdminRedirect() {
  redirect("/admin/login");
}
