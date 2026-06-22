import type { Metadata } from "next";
import ManageIPOsClient from "./ManageIPOsClient";

export const metadata: Metadata = {
  title: "Manage IPO Calendar | Admin Dashboard",
  description: "Admin panel to create, update, delete, and configure details of IPO calendars and manage GMP history.",
};

export default function ManageIPOsPage() {
  return <ManageIPOsClient />;
}
