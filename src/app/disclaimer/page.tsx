import { Metadata } from "next";
import DisclaimerClient from "./DisclaimerClient";

export const metadata: Metadata = {
  title: "Disclaimer - India IPO",
  description: "Disclaimer for India IPO.in. Read our terms regarding the information provided on our portal.",
};

export default function DisclaimerPage() {
  return <DisclaimerClient />;
}
