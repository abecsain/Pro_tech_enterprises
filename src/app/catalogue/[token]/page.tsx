import { redirect } from "next/navigation";

export default function CatalogueTokenRoot({ params }: { params: { token: string } }) {
  redirect(`/catalogue/${params.token}/login`);
}
