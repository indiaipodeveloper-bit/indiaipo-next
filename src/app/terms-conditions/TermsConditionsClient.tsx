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

export default function TermsConditionsClient() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div {...fadeUp} className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-sm">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center border-b pb-4">Terms & Conditions</h1>

            <div className="space-y-8 text-muted-foreground leading-relaxed text-sm md:text-base">
              <section className="space-y-4">
                <p>Welcome to www.indiaipo.in, owned and managed by India IPO, 808, 8th Floor, D-Mall, New Delhi – 110034. By visiting and using our website, resources, or services, you agree to follow these Terms & Conditions along with our Privacy Policy.</p>
                <p>We may update or change these Terms anytime without prior notice. It is your responsibility to check this page from time to time. By continuing to use the website after changes, you agree to the updated Terms.</p>
                <p>The website and its content are provided only for general information. It is not legal, financial, or professional advice. You should not make business or investment decisions only based on the content here.</p>
                <p>India IPO, its directors, consultants, or employees will not be responsible for any loss or damage caused by use of this website or reliance on its content. The information is provided “as is” and may change without notice. Some images or visuals may be of models or staff and may not directly represent current team members.</p>
                <p>India IPO (“we,” “our,” or “us”) provides its website, products, services and content under the following Terms & Conditions (“Terms”). By using India IPO’s website or services, you confirm that you have read, understood and agreed to these Terms. If you do not agree, please do not use our website or services.</p>
              </section>

              <div className="space-y-6">
                {[
                  {
                    id: 1,
                    title: "License & Use",
                    content: (
                      <ul className="list-disc pl-5 space-y-2 text-sm text-slate-500">
                        <li><strong>Limited License:</strong> India IPO gives you a limited, non-exclusive, non-transferable right to use its website and services only for your personal, non-commercial use.</li>
                        <li><strong>No Resale or Redistribution:</strong> You are not allowed to resell, share, copy, or distribute our content, data, or services unless you have written permission from India IPO.</li>
                      </ul>
                    )
                  },
                  {
                    id: 2,
                    title: "User Responsibilities",
                    content: (
                      <ul className="list-disc pl-5 space-y-2 text-sm text-slate-500">
                        <li><strong>Equipment & Internet:</strong> You are responsible for arranging and maintaining your own devices, internet and any related costs (internet/data charges, phone charges, or taxes) to use our services.</li>
                        <li>India IPO makes no warranties/representations that the website uses will be error-free/virus-free, or uninterrupted. You remain responsible for taking necessary precautions to ensure that neither of the content obtained via the website is virus-free nor free of other harmful codes.</li>
                        <li><strong>Lawful Use:</strong> You agree not to access the website by means apart from a standard Web Browser on a Computer or Mobile Device. You further agree that you would not Damage, Disable, Alter, Overburden, or impair the Website or by any means interfere with the use and enjoyment made by any other party of it.</li>
                        <li>You must not use India IPO’s website or services for any illegal purpose.</li>
                        <li>You should not share your login details with others. If we find that you have shared your paid subscription or access with someone else, we can cancel your subscription without a refund.</li>
                      </ul>
                    )
                  },
                  {
                    id: 3,
                    title: "Indemnity",
                    content: <p className="text-sm text-slate-500">You agree to defend/indemnify and hold India IPO and its respective members/agents/officers/partners/associates/directors/consultants/employees harmless from any liability/loss/claim/demand, including the reasonable fees of the attorney, due to/or arising out of your website use and or agreement’s breach.</p>
                  },
                  {
                    id: 4,
                    title: "Delays & Service Activation",
                    content: (
                      <ul className="list-disc pl-5 space-y-2 text-sm text-slate-500">
                        <li><strong>Delays:</strong> India IPO is not responsible for any delay in services caused by factors beyond our control (like internet failure, natural disasters, strikes, or war).</li>
                        <li><strong>Activation:</strong>
                          <ul className="list-[circle] pl-5 mt-2 space-y-1">
                            <li><strong>Print Magazine:</strong> Delivery is through post. Please allow 7–10 weeks after payment.</li>
                            <li><strong>Other Services:</strong> Activation may take 7–10 working days after payment.</li>
                          </ul>
                        </li>
                      </ul>
                    )
                  },
                  {
                    id: 5,
                    title: "Payments & Refunds",
                    content: (
                      <ul className="list-disc pl-5 space-y-2 text-sm text-slate-500">
                        <li>All subscriptions must be paid in full, in advance.</li>
                        <li>Subscription period starts only after payment is received.</li>
                        <li><strong>No Refund Policy:</strong> Payments are non-refundable unless required by law or otherwise stated in writing.</li>
                        <li>Online Payments: We process payment securely but are not responsible for misuse during online transmission.</li>
                        <li><strong>Lifetime Membership:</strong>
                          <ul className="list-[circle] pl-5 mt-2 space-y-1">
                            <li>Transferable to one legal heir only.</li>
                            <li>Valid for 25 years or until the service stops.</li>
                            <li>India IPO may add, change, or remove features anytime without notice.</li>
                          </ul>
                        </li>
                      </ul>
                    )
                  },
                  {
                    id: 6,
                    title: "Liability & Disclaimers",
                    content: (
                      <ul className="list-disc pl-5 space-y-2 text-sm text-slate-500">
                        <li>You use India IPO’s website and services at your own risk.</li>
                        <li>All services are provided “as is” and “as available.”</li>
                        <li><strong>Investment Risk:</strong> Any investment or trading decision based on our content is your responsibility. No guarantee of profits.</li>
                        <li><strong>Limitation of Liability:</strong> India IPO is not responsible for direct, indirect, incidental, or consequential damages. If dissatisfied, your only remedy is to stop using our services.</li>
                      </ul>
                    )
                  }
                ].map((section) => (
                  <section key={section.id}>
                    <h2 className="text-xl font-bold text-foreground mb-3">{section.id}. {section.title}</h2>
                    {section.content}
                  </section>
                ))}

                {[
                  { id: 7, title: "Modification of Terms", content: "We may update or change these Terms anytime without notice. Please check this page regularly to stay updated." },
                  { id: 8, title: "Third-Party Links", content: "Our website may include links to third-party websites. We are not responsible for their content or services. Links are only for convenience and do not mean endorsement." },
                  {
                    id: 9, title: "Communication Services", content: (
                      <div className="space-y-2">
                        <p>India IPO’s website or app may have chat, forums, or bulletin boards (“Communication Services”). By using them, you agree not to:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Post illegal, abusive, or offensive content.</li>
                          <li>Share files with viruses or copyrighted material without permission.</li>
                          <li>Advertise or spam.</li>
                        </ul>
                        <p>We may monitor and remove content if necessary.</p>
                      </div>
                    )
                  },
                  { id: 10, title: "Materials Provided to India IPO", content: "Any feedback, suggestions, or content you share with us can be used by India IPO for business purposes (such as display, copy, or distribution). You will still own your intellectual property rights." },
                  { id: 11, title: "Termination / Access Restriction", content: "India IPO can suspend or terminate your access without notice if you break these Terms or use our services incorrectly. Some rules (like disclaimers, liabilities and legal terms) will continue even after termination." },
                  { id: 12, title: "Consent to Communication", content: "By subscribing to our services, you agree to be contacted by our team via email, phone, or SMS, even if your number is under DND (Do Not Disturb). You can request to opt out anytime by writing to us." },
                  { id: 13, title: "Governing Law & Jurisdiction", content: "These Terms are governed by Indian law. Disputes will be handled in the courts of New Delhi, India." },
                  {
                    id: 14, title: "General Provisions", content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>No Partnership:</strong> These Terms do not create any partnership or joint venture between you and India IPO.</li>
                        <li><strong>Entire Agreement:</strong> These Terms are the complete agreement, replacing all previous understandings.</li>
                        <li><strong>Severability:</strong> If any part is found invalid, the rest will remain valid.</li>
                        <li><strong>Notice:</strong> Any official notice to the India IPO should be sent to our registered address or email.</li>
                      </ul>
                    )
                  },
                  {
                    id: 15, title: "Copyright & Trademarks", content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li>All website design, text, graphics and content belong to India IPO or its partners. All rights reserved.</li>
                        <li>Names, logos and trademarks of India IPO cannot be used without written consent.</li>
                      </ul>
                    )
                  }
                ].map((section) => (
                  <section key={section.id}>
                    <h2 className="text-xl font-bold text-foreground mb-3">{section.id}. {section.title}</h2>
                    <div className="text-muted-foreground">{section.content}</div>
                  </section>
                ))}

                <section className="pt-6 border-t border-border">
                  <h2 className="text-xl font-bold text-foreground mb-3">16. Contact Information</h2>
                  <p className="mb-2">If you have any questions or need help with India IPO’s services, please contact us:</p>
                  <div className="bg-secondary/30 p-4 rounded-xl">
                    <p>Email: <a href="mailto:info@indiaipo.in" className="text-primary hover:underline">info@indiaipo.in</a></p>
                    <p>Phone: 011-47008280</p>
                  </div>
                  <p className="mt-6 font-semibold text-foreground italic">By using India IPO’s website or services, you confirm that you have read, understood and agreed to these Terms & Conditions.</p>
                </section>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
