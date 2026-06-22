import { Metadata } from "next";
import { Suspense } from "react";
import CSRClient from "./CSRClient";

export const metadata: Metadata = {
  title: "Corporate Social Responsibility (CSR) | India IPO",
  description: "Learn about India IPO's commitment to social good, sustainable development, and community empowerment through our Corporate Social Responsibility (CSR) initiatives.",
  keywords: "Corporate Social Responsibility, CSR India, India IPO CSR, Social Impact, Community Support",
  alternates: {
    canonical: "https://www.indiaipo.in/our-csr",
  },
};

export default function CSRPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <CSRClient />
    </Suspense>
  );
}
