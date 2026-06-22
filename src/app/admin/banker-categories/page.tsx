import type { Metadata } from "next";
import BankerCategoriesClient from "./BankerCategoriesClient";

export const metadata: Metadata = {
  title: "Manage Banker Categories | Admin Dashboard",
  description: "Admin panel to create, view, modify, and delete subcategories for SME and Mainboard merchant bankers.",
};

export default function BankerCategoriesPage() {
  return <BankerCategoriesClient />;
}
