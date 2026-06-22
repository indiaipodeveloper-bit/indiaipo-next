import type { Metadata } from "next";
import CareerRolesClient from "./CareerRolesClient";

export const metadata: Metadata = {
  title: "Manage Career Roles | Admin Dashboard",
  description: "Add, activate, or deactivate positions available for job applicants.",
};

export default function CareerRolesPage() {
  return <CareerRolesClient />;
}
