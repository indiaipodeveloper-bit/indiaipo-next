import type { Metadata } from "next";
import SEOClient from "./SEOClient";

export const metadata: Metadata = {
  title: "SEO Manager | Admin Dashboard",
  description: "Configure meta keywords, descriptions, titles, canonical tags, and schema JSON configurations.",
};

export default function SEOPage() {
  return <SEOClient />;
}
