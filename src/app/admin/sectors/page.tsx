import type { Metadata } from "next";
import SectorsClient from "./SectorsClient";

export const metadata: Metadata = {
  title: "Manage Sectors | Admin Dashboard",
  description: "Admin panel to view, search, create, edit, and delete sectors with their metrics.",
};

export default function SectorsPage() {
  return <SectorsClient />;
}
