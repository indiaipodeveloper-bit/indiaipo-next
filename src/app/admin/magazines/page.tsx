import type { Metadata } from "next";
import MagazinesClient from "./MagazinesClient";

export const metadata: Metadata = {
  title: "Manage Magazines | Admin Dashboard",
  description: "Admin panel to list, publish, modify, and delete digital magazine edition archives.",
};

export default function MagazinesPage() {
  return <MagazinesClient />;
}
