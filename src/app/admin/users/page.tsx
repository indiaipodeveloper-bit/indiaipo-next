import type { Metadata } from "next";
import UsersClient from "./UsersClient";

export const metadata: Metadata = {
  title: "Manage Users | Admin Dashboard",
  description: "View and manage registered users and their permission roles.",
};

export default function UsersPage() {
  return <UsersClient />;
}
