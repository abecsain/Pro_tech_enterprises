import { redirect } from "next/navigation";

export default function IndividualProductPage({ params }: { params: { token: string; id: string } }) {
  redirect(`/catalogue/${params.token}/products`);
}
