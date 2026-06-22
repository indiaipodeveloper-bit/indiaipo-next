import type { Metadata } from "next";
import IPOFeasibilityClient from "./IPOFeasibilityClient";

export const metadata: Metadata = {
  title: "IPO Feasibility Check | Admin Dashboard",
  description: "Assess corporate eligibility submissions for IPO listing.",
};

export default function IPOFeasibilityPage() {
  return <IPOFeasibilityClient />;
}
