import type { Metadata } from "next";
import MerchantBankersClient from "./MerchantBankersClient";

export const metadata: Metadata = {
  title: "Manage Merchant Bankers (SME) | Admin Dashboard",
  description: "Admin panel to list, filter, create, edit, and delete merchant banker records and detailed analytics profiles.",
};

export default function MerchantBankersPage() {
  return <MerchantBankersClient />;
}
