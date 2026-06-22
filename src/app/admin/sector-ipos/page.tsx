import type { Metadata } from "next";
import SectorIposClient from "./SectorIposClient";

export const metadata: Metadata = {
  title: "List IPO By Sector | Admin Dashboard",
  description: "Admin panel to list, filter, create, edit, and delete IPO records classified under industry sectors.",
};

export default function SectorIposPage() {
  return <SectorIposClient />;
}
