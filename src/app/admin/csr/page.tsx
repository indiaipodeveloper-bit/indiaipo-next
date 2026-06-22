import type { Metadata } from "next";
import CSRClient from "./CSRClient";

export const metadata: Metadata = {
  title: "Manage CSR Initiatives | Admin Dashboard",
  description: "Configure and update Corporate Social Responsibility projects.",
};

export default function CSRPage() {
  return <CSRClient />;
}
