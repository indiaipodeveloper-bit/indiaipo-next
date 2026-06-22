import type { Metadata } from "next";
import ConsultantsClient from "./ConsultantsClient";

export const metadata: Metadata = {
  title: "Manage Consultants | Admin Dashboard",
  description: "Create, update, and sort profiles of IPO advisors and consultants.",
};

export default function ConsultantsPage() {
  return <ConsultantsClient />;
}
