import type { Metadata } from "next";
import NewsClient from "./NewsClient";

export const metadata: Metadata = {
  title: "Manage News & Updates | Admin Dashboard",
  description: "Admin panel to compose, publish, edit, filter, and delete news articles and market updates.",
};

export default function NewsPage() {
  return <NewsClient />;
}
