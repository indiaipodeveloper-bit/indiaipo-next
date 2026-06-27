"use client";

import React from "react";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function PrivacyPolicyClient() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div {...fadeUp} className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-sm">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">Privacy Policy</h1>

            <div className="space-y-8 text-muted-foreground leading-relaxed text-sm md:text-base">
              <p>
                This Privacy Policy governs the manner in which Indiaipo.in collects, uses, maintains and discloses information collected from users (each, a “User”) of the https://www.indiaipo.in website (“Site”). This privacy policy applies to the Site and all products and services offered by IndiaIPO.
              </p>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">1. Personal Identification Information</h2>
                <p>
                  We may gather personal identification information from users in several ways, including but not limited to when they visit our site, register, place an order, or engage with other features, services, or resources we offer. Users might be asked for details such as name, email address, mailing address, phone number, and company information. However, users can also browse our site anonymously. We only collect personal identification information if users voluntarily provide it. Refusing to share such information may limit their ability to participate in certain site-related activities.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">2. Non-Personal Identification Information</h2>
                <p>
                  We may collect non-personal information about users when they interact with our site. This may include details such as the browser type, device information, operating system, Internet service provider, and other technical data related to the user’s method of accessing our site. This information is collected to improve user experience and site functionality, in compliance with applicable privacy policies.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">3. How We Collected Information</h2>
                <p className="mb-3">Indiaipo.in may collect and use Users personal information for the following purposes:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>To improve customer service</strong> – Information you provide helps us respond to your customer service requests and support needs more efficiently.</li>
                  <li><strong>To personalize user experience</strong> – We may use information in the aggregate to understand how our Users as a group use the services and resources provided on our Site.</li>
                  <li><strong>To improve our Site</strong> – We may use feedback you provide to improve our products and services.</li>
                  <li><strong>To process payments</strong> – We may use the information Users provide about themselves when placing an order only to provide service to that order. We do not share this information with outside parties except to the extent necessary to provide the service.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">4. How We Protect Your Information</h2>
                <p>
                  We implement proper data collection, storage, and processing practices, along with security measures to safeguard your personal information, username, password, transaction details, and data stored on our site from unauthorized access, alteration, disclosure, or destruction. Sensitive and private data exchanged between our site and users is transmitted via an SSL-secured communication channel, encrypted, and protected with digital signatures. Additionally, our site complies with PCI vulnerability standards to provide users with the most secure environment possible.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">5. Sharing Your Personal Information</h2>
                <p>
                  We may engage third-party service providers to assist in running our business and website, or to manage specific activities on our behalf, such as distributing newsletters or conducting surveys. We may share your information with these providers solely for these purposes, and only with your consent.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">6. Changes To This Privacy Policy</h2>
                <p>
                  Indiaipo.in reserves the right to update this privacy policy at any time. When changes are made, we will notify you via email. We encourage users to regularly review this page to stay informed about how we protect the personal information we collect. By using our site, you acknowledge and agree that it is your responsibility to periodically review this privacy policy and stay aware of any modifications.
                </p>
              </section>

              <section className="pt-6 border-t border-border">
                <h2 className="text-xl font-bold text-foreground mb-3">Contact Us</h2>
                <p className="mb-2">If you have any questions regarding this Privacy Policy, the practices of our site, or your interactions with us, please feel free to contact us at:</p>
                <div className="bg-secondary/30 p-4 rounded-xl">
                  <p className="font-bold text-foreground">India IPO</p>
                  <p>808, 8th Floor, D-Mall, Netaji Subhash Place, Pitampura, Delhi-110034</p>
                  <p>Phone: 011-47008280</p>
                  <p>Mobile: +91-74283-37280 , +91-96506-37280</p>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
