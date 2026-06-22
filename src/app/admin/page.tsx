import type { Metadata } from "next";
import AdminDashboardClient from "./AdminDashboardClient";

export const metadata: Metadata = {
  title: "Admin Dashboard | India IPO",
  description: "Real-time overview of your IPO platform activity",
};

export default function AdminPage() {
  return <AdminDashboardClient />;
}
