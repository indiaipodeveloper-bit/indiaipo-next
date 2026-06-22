import type { Metadata } from "next";
import MerchantEnquiriesClient from "./MerchantEnquiriesClient";

export const metadata: Metadata = {
  title: "Merchant Enquiries | Admin Dashboard",
  description: "View and manage merchant banker enquiries.",
};

export default function MerchantEnquiriesPage() {
  return <MerchantEnquiriesClient />;
}
