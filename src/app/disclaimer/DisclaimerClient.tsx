"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function DisclaimerClient() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div {...fadeUp} className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-sm">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">Disclaimer</h1>

            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                India IPO.in is an online portal that provides information related to the launching of Initial Public Offerings (IPOs) companies in India. The information provided on the website is for general informational purposes only and does not constitute investment advice or a recommendation to invest in any security.
              </p>

              <p>
                Please note that the information provided on India IPO.in is not intended to be, and should not be considered, a comprehensive source of information on any company or security. The information is obtained from sources believed to be reliable, but its accuracy and completeness cannot be guaranteed.
              </p>

              <p>
                By accessing India IPO.in, you acknowledge that you have read, understood, and agree to be bound by this disclaimer. India IPO.in reserves the right to modify this disclaimer at any time without prior notice. Your continued use of the website following any changes to this disclaimer constitutes your acceptance of those changes.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
