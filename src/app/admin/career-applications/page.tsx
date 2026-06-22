import type { Metadata } from "next";
import CareerApplicationsClient from "./CareerApplicationsClient";

export const metadata: Metadata = {
  title: "Career Applications | Admin Dashboard",
  description: "Manage and review candidates who applied for jobs.",
};

export default function CareerApplicationsPage() {
  return <CareerApplicationsClient />;
}
