import type { Metadata } from "next";
import MainboardBankersClient from "./MainboardBankersClient";

export const metadata: Metadata = {
  title: "Manage Mainboard Bankers | Admin Dashboard",
  description: "Admin panel to list, filter, create, edit, and delete top tier Mainboard lead manager banker records.",
};

export default function MainboardBankersPage() {
  return <MainboardBankersClient />;
}
