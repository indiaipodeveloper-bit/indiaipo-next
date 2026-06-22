import type { Metadata } from "next";
import PopupClient from "./PopupClient";

export const metadata: Metadata = {
  title: "Manage Popup Settings | Admin Dashboard",
  description: "Configure and toggle the announcement popup displayed on page load.",
};

export default function PopupPage() {
  return <PopupClient />;
}
