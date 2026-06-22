import type { Metadata } from "next";
import BannersClient from "./BannersClient";

export const metadata: Metadata = {
  title: "Manage Hero Banners | Admin Dashboard",
  description: "Add, reorder, and manage homepage and inner page hero banners.",
};

export default function BannersPage() {
  return <BannersClient />;
}
