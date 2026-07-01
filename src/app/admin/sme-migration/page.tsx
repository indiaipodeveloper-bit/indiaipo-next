import type { Metadata } from "next";
import SMEMigrationClient from "./SMEMigrationClient";

export const metadata: Metadata = {
  title: "Manage SME Migration Lists | Admin Dashboard",
  description: "Admin panel to upload and manage SME NSE/BSE Migration Lists.",
};

export default function SMEMigrationPage() {
  return <SMEMigrationClient />;
}
