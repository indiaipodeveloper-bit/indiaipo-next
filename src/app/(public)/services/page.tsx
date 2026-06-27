import { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Services | India IPO Advisory Services",
  description:
    "SME IPO, Mainline IPO, FPO Advisory, and Pre-IPO Funding — comprehensive IPO consultancy services by India IPO.",
  keywords: "SME IPO, Mainline IPO, FPO, Pre-IPO funding, IPO advisory services",
  alternates: {
    canonical: "https://www.indiaipo.in/services",
  },
  openGraph: {
    title: "Services | India IPO Advisory Services",
    description:
      "SME IPO, Mainline IPO, FPO Advisory, and Pre-IPO Funding — comprehensive IPO consultancy services by India IPO.",
    url: "https://www.indiaipo.in/services",
    type: "website",
    images: [
      {
        url: "https://www.indiaipo.in/favicon.png",
        alt: "India IPO",
      },
    ],
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
