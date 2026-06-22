import { Metadata } from "next";
import TermsConditionsClient from "./TermsConditionsClient";

export const metadata: Metadata = {
  title: "Terms & Conditions - India IPO",
  description: "Terms and Conditions for indiaipo.in. Read our usage rules and policies.",
};

export default function TermsConditionsPage() {
  return <TermsConditionsClient />;
}
