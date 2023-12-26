import { redirect } from "next/navigation";

export default function Home() {
  redirect("the-survey-app/start");
  return <></>;
}
