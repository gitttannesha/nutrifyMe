import { redirect } from "next/navigation";
import Link from "next/link";

export default function Home() {
  redirect("/landing");
  return null;
}
