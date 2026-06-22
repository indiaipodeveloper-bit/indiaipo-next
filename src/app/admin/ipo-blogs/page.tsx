import type { Metadata } from "next";
import IPOBlogsClient from "./IPOBlogsClient";

export const metadata: Metadata = {
  title: "Manage IPO Blogs | Admin Dashboard",
  description: "Manage database of IPO updates, blogs, and daily report campaigns.",
};

export default function IPOBlogsPage() {
  return <IPOBlogsClient />;
}
