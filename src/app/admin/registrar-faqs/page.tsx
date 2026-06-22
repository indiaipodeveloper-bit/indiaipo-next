import type { Metadata } from "next";
import RegistrarFaqsClient from "./RegistrarFaqsClient";

export const metadata: Metadata = {
  title: "Manage Registrar FAQs | Admin Dashboard",
  description: "Admin panel to list, filter, create, edit, and delete registrar FAQs.",
};

export default function RegistrarFaqsPage() {
  return <RegistrarFaqsClient />;
}
