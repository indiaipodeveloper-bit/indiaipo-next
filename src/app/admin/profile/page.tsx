import type { Metadata } from "next";
import ProfileClient from "./ProfileClient";

export const metadata: Metadata = {
  title: "Admin Profile & Security | Admin Dashboard",
  description: "Manage your personal profile and account credentials.",
};

export default function ProfilePage() {
  return <ProfileClient />;
}
