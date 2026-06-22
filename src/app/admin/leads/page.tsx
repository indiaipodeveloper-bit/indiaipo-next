import type { Metadata } from "next";
import LeadsClient from "./LeadsClient";

export const metadata: Metadata = {
  title: "Leads Management | Admin Dashboard",
  description: "Manage official contact submissions and general leads.",
};

export default function LeadsPage() {
  return <LeadsClient />;
}
