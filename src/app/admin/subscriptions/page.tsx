import type { Metadata } from "next";
import SubscriptionsClient from "./SubscriptionsClient";

export const metadata: Metadata = {
  title: "Newsletter Subscriptions | Admin Dashboard",
  description: "Manage your email subscriber list.",
};

export default function SubscriptionsPage() {
  return <SubscriptionsClient />;
}
