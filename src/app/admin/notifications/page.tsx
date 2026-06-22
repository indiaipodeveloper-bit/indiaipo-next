import type { Metadata } from "next";
import NotificationsClient from "./NotificationsClient";

export const metadata: Metadata = {
  title: "Manage Notifications & Circulars | Admin Dashboard",
  description: "Admin panel to list, view, upload PDFs, and update notifications and circulars.",
};

export default function NotificationsPage() {
  return <NotificationsClient />;
}
