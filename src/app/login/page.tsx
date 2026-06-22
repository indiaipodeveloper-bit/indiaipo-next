import type { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Login – India IPO",
  description: "Sign in to your India IPO account to access real-time IPO tracking, GMP alerts, and expert market insights.",
  alternates: {
    canonical: "https://www.indiaipo.in/login",
  },
  openGraph: {
    title: "Login – India IPO",
    description: "Sign in to your India IPO account to access real-time IPO tracking, GMP alerts, and expert market insights.",
    url: "https://www.indiaipo.in/login",
    type: "website",
  }
};

export default function LoginPage() {
  return <LoginClient />;
}
