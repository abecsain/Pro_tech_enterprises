import { redirect } from "next/navigation";

export default function BookingPage({ params }: { params: { token: string } }) {
  redirect(`/catalogue/${params.token}/products`);
}
