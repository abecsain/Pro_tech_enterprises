import { redirect } from "next/navigation";

export default function CatalogRedirect({ params }: { params: { token: string } }) {
  redirect(`/catalogue/${params.token}`);
}
