import type { Metadata } from "next";
import RegistrarsClient from "./RegistrarsClient";

export const metadata: Metadata = {
  title: "Manage IPO Registrars | Admin Dashboard",
  description: "Admin panel to manage official IPO Registrars, statistics, and FAQs.",
};

export default function RegistrarsPage() {
  return <RegistrarsClient />;
}
