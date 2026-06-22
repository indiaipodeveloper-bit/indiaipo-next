import type { Metadata } from "next";
import AnnualReportRequestsClient from "./AnnualReportRequestsClient";

export const metadata: Metadata = {
  title: "Annual Report Requests | Admin Dashboard",
  description: "Track and manage requests for the Annual Report PDF.",
};

export default function AnnualReportRequestsPage() {
  return <AnnualReportRequestsClient />;
}
