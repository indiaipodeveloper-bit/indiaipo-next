import type { Metadata } from "next";
import InvestorsClient from "./InvestorsClient";

export const metadata: Metadata = {
  title: "Investor Enquiries | Admin Dashboard",
  description: "View and manage enquiries submitted for investment.",
};

export default function InvestorsPage() {
  return <InvestorsClient />;
}
