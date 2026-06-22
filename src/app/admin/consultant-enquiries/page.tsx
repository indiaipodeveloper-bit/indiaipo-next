import type { Metadata } from "next";
import ConsultantEnquiriesClient from "./ConsultantEnquiriesClient";

export const metadata: Metadata = {
  title: "Consultant Enquiries | Admin Dashboard",
  description: "View and manage enquiries submitted for consultants.",
};

export default function ConsultantEnquiriesPage() {
  return <ConsultantEnquiriesClient />;
}
