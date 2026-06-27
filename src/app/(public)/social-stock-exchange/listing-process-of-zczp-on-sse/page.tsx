import React from "react";
import SSESidebar from "../SSESidebar";
import Link from "next/link";
import { ChevronRight, Home, TrendingUp, FileText, CheckCircle2 } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Listing process of ZCZP on SSE | India IPO",
  description: "Learn about the listing process of Zero Coupon Zero Principal (ZCZP) instruments on the Social Stock Exchange.",
};

export default function ListingProcessZCZPPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">

      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-10 flex-wrap font-medium">
            <Link href="/" className="hover:text-[#f59e08] flex items-center gap-1 transition-colors">
              <Home className="h-4 w-4" /> Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/social-stock-exchange/sse-introduction" className="hover:text-[#f59e08] transition-colors">Social Stock Exchange</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-[#001529] font-bold">Listing process of ZCZP on SSE</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* Sidebar */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <SSESidebar />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <div className="service-content-box bg-white">
                <div className="flex justify-between items-start mb-8 flex-wrap gap-4 border-b border-slate-100 pb-8">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-black text-[#001529] mb-4 leading-tight">
                      Listing Process of ZCZP on the Social Stock Exchange (SSE)
                    </h1>
                    <div className="flex items-center gap-4 text-slate-500 text-sm font-semibold">
                      <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                        <FileText className="h-4 w-4 text-[#f59e08]" />
                        Listing Guide
                      </span>
                      <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                        <TrendingUp className="h-4 w-4 text-[#f59e08]" />
                        SSE Segment
                      </span>
                    </div>
                  </div>
                </div>

                <div className="service-content">
                  <div id="listing-process">
                    <p className="text-lg text-slate-600 leading-relaxed font-medium mb-8">
                      Zero Coupon Zero Principal instrument is among the innovative securities that have been introduced by the SSE framework of SEBI in India. ZCZP is a not-for-profit organization (NPO) issued and listed on the SSE segment of the NSE and BSE. The structure of ZCZP makes it different from normal IPOs because it does not pay interest (coupon) or repay principal. This is why it can be used as a pure donation instrument with increased transparency and regulatory control.
                    </p>
                  </div>

                  <div id="key-steps" className="space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl font-black text-[#001529] mt-8 mb-4">
                      <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                        <CheckCircle2 className="h-6 w-6 text-[#f59e08]" />
                      </div>
                      Key Steps in the Listing Process
                    </h2>
                    <p className="text-slate-600 font-medium">The process that all Not-for-profit organizations (NPOs) intending to list their Zero Coupon Zero Principal (ZCZPs) on the SSE segment must follow is as given below:</p>

                    <div className="space-y-6 mt-8">
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h3 className="font-bold text-[#001529] mb-2">1. Execution of Listing Agreement:</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">The NPO should provide a duly signed listing agreement together with its listing application for the ZCZPs on the recognized exchange (NSE or BSE).</p>
                      </div>

                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h3 className="font-bold text-[#001529] mb-2">2. Dematerialization of ZCZPs:</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">The ZCZPs should be dematerialized as per the Depositories Act, 1996 and should be admitted to at least one of the depositories (NSDL or CDSL).</p>
                      </div>

                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h3 className="font-bold text-[#001529] mb-2">3. Appointment of Registrar to the Issue:</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">The NPO must appoint a SEBI-registered Registrar to the Issue to manage allotment and investor servicing.</p>
                      </div>

                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h3 className="font-bold text-[#001529] mb-2">4. Appointment of Advisors/Consultants (Optional):</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">Although the appointment of advisors or consultants is not compulsory, in case they are hired, their information should be provided in the fundraising document.</p>
                      </div>

                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h3 className="font-bold text-[#001529] mb-2">5. Draft Fundraising Document Filing:</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">The NPO must submit a draft fundraising document to the SSE in which it is registered, together with the relevant fees. This draft is valid within six months of filing.</p>
                      </div>

                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h3 className="font-bold text-[#001529] mb-2">6. Public Comment Period:</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">The SSE will post the draft fundraising document on its site at least 21 days to allow comments by the public.</p>
                      </div>

                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h3 className="font-bold text-[#001529] mb-2">7. Clarifications from NPO (If Required):</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">The SSE can request further information or clarification of the NPO at this time.</p>
                      </div>

                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h3 className="font-bold text-[#001529] mb-2">8. Review and Observations by SSE:</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">The SSE will give its official comments on the draft document within 30 days from the date of filing the draft or receipt of clarifications, whichever is earlier.</p>
                      </div>

                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h3 className="font-bold text-[#001529] mb-2">9. Final Fundraising Document and Offer Period:</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">The NPO should include the observations of SSE and submit the final fundraising document. The public issue of ZCZPs should be open for at least 3 working days and not exceed 10 working days.</p>
                      </div>

                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h3 className="font-bold text-[#001529] mb-2">10. Issue Pricing:</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">ZCZPs will be issued at face value as indicated in the fundraising document.</p>
                      </div>

                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h3 className="font-bold text-[#001529] mb-2">11. Private Placement (if applicable):</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">The same procedural framework shall be followed, to the extent applicable, for private placement of ZCZPs.</p>
                      </div>

                      <div className="p-6 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                        <h3 className="font-bold text-[#001529] mb-3">12. Minimum Issue and Application Size:</h3>
                        <div className="orhp m-2 text-sm text-slate-600">
                          <ul className="list-disc pl-5 space-y-1">
                            <li>The ZCZP issue should be at least 1 crore.</li>
                            <li>The minimum amount of each application should be 2 lakh.</li>
                            <li>Investors must be institutional and non-institutional (retail investors are not allowed).</li>
                          </ul>
                        </div>
                      </div>

                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h3 className="font-bold text-[#001529] mb-2">13. Minimum Subscription Requirement:</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">The issue should be subscribed to by at least 75% of the total issue size to be successful.</p>
                      </div>

                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h3 className="font-bold text-[#001529] mb-2">14. Listing Timeline:</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">The ZCZPs should be listed on the SSE segment of the exchange within T+10 trading days, where T is the date of closure of the issue.</p>
                      </div>

                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h3 className="font-bold text-[#001529] mb-2">15. Non-Tradability on Secondary Market:</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">NPOs do not offer ZCZPs that can be traded in the secondary market. However, they can be transferred to legal heirs in exceptional cases.</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12" id="obj-sse">
                    <h2 className="text-2xl font-black text-[#001529] mb-4">NSE SSE Listing Checklist for Instruments</h2>
                    <p className="text-slate-600 font-medium">To list ZCZPIs on the NSE Social Stock Exchange segment, the issuer must ensure compliance with the following:</p>
                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mt-6">
                      <h4 className="mb-4 flex items-center gap-2 font-bold text-[#001529]">
                        <CheckCircle2 className="h-5 w-5 text-[#f59e08]" />
                        Eligibility Requirements
                      </h4>
                      <div className="orhp m-0 p-0 border-none bg-transparent text-sm text-slate-600">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Must be a registered NPO (as per Regulation 292A of SEBI ICDR).</li>
                          <li>Should be engaged in eligible social activities (e.g., education, health, poverty alleviation).</li>
                          <li>Minimum operational history of 3 years.</li>
                          <li>Valid registration under Section 12A/12AA/12AB and 80G of the Income Tax Act.</li>
                          <li>Minimum fund flow thresholds.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12" id="document-checklist">
                    <h3 className="text-xl font-black text-[#001529] mb-4">Documents Checklist</h3>
                    <div className="orhp bg-slate-50 p-6 rounded-2xl border border-slate-100 text-sm text-slate-600">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Registration certificates and constitutional documents (Trust Deed/MoA/AoA).</li>
                        <li>PAN and registration with the NGO Darpan.</li>
                        <li>Financial statements and fund flow for the last 3 years.</li>
                        <li>SSE Registration Agreement and self-declaration.</li>
                        <li>Auditor certification confirming financial and tax eligibility.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-12" id="post-issue">
                    <h3 className="text-xl font-black text-[#001529] mb-4">Post-Issue Listing Compliance</h3>
                    <div className="orhp bg-slate-50 p-6 rounded-2xl border border-slate-100 text-sm text-slate-600">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Maintain a separate bank account for unutilized ZCZPI funds.</li>
                        <li>Quarterly disclosure of fund usage.</li>
                        <li>Annual impact reporting by social auditors.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-12" id="bse-listing">
                    <h2 className="text-2xl font-black text-[#001529] mb-4">BSE SSE Listing Checklist for Instruments</h2>
                    <p className="text-slate-600 font-medium">The BSE Social Stock Exchange (BSE-SSE) requires similar but specifically tailored documentation and procedures.</p>
                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mt-6">
                      <h4 className="mb-4 font-bold text-[#001529]">BSE SSE Listing Pre-requisites</h4>
                      <div className="orhp m-0 p-0 border-none bg-transparent text-sm text-slate-600">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Legal form as a trust, society, or Section 8 company.</li>
                          <li>Active operations in socially beneficial sectors.</li>
                          <li>Valid registrations under 12A and 80G.</li>
                          <li>Three years of operational and financial history.</li>
                          <li>Registration on NGO Darpan portal.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12" id="required-listing-zczpi">
                    <h3 className="text-xl font-black text-[#001529] mb-4">Required Documents for Listing of ZCZPIs</h3>
                    <div className="orhp bg-slate-50 p-6 rounded-2xl border border-slate-100 text-sm text-slate-600">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>SSE Registration application form.</li>
                        <li>Copy of registration certificates under relevant laws.</li>
                        <li>Certified governing documents (Trust Deed, By-laws, MoA).</li>
                        <li>PAN card copy.</li>
                        <li>Income Tax registration (12A and 80G).</li>
                        <li>Audited financials and fund flow statements for the past 3 years.</li>
                        <li>Auditor’s certificate on financial eligibility.</li>
                        <li>Social Audit Report (where applicable).</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-12" id="additional-bse">
                    <h3 className="text-xl font-black text-[#001529] mb-4">Additional BSE Requirements</h3>
                    <div className="orhp bg-slate-50 p-6 rounded-2xl border border-slate-100 text-sm text-slate-600">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Clarity on the end-use of funds.</li>
                        <li>Clear impact metrics and methodology.</li>
                        <li>KYC of trustees/directors.</li>
                        <li>Details of past fundraising and donor base.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-12" id="issuer-allot">
                    <h2 className="text-2xl font-black text-[#001529] mb-4">Documents to Be Provided by Issuer for Basis of Allotment of ZCZP</h2>
                    <p className="text-slate-600 font-medium">The ZCZPIs shall be allotted in a fair, transparent and SEBI-compliant manner. The NPO shall submit the following documents to determine the basis of allotment:</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h3 className="font-bold text-[#001529] mb-3">1. Final Fundraising Document</h3>
                        <div className="orhp m-0 p-0 border-none bg-transparent text-sm text-slate-600">
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Incorporating SSE comments.</li>
                            <li>Publicly disclosed on SSE and the issuer’s website.</li>
                          </ul>
                        </div>
                      </div>

                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h3 className="font-bold text-[#001529] mb-3">2. Board/Governing Body Resolution</h3>
                        <div className="orhp m-0 p-0 border-none bg-transparent text-sm text-slate-600">
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Authorizing the size of the issue, the price and the methodology of allotment.</li>
                          </ul>
                        </div>
                      </div>

                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h3 className="font-bold text-[#001529] mb-3">3. Application Forms and Bids</h3>
                        <div className="orhp m-0 p-0 border-none bg-transparent text-sm text-slate-600">
                          <ul className="list-disc pl-5 space-y-1">
                            <li>List of applications received.</li>
                            <li>Verification of eligibility of investors (non-retail only).</li>
                            <li>Minimum application size: ₹2 lakhs per investor.</li>
                          </ul>
                        </div>
                      </div>

                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h3 className="font-bold text-[#001529] mb-3">4. Subscription Report</h3>
                        <div className="orhp m-0 p-0 border-none bg-transparent text-sm text-slate-600">
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Subscription levels (must meet 75% minimum).</li>
                            <li>Category-wise break-up (institutional, non-institutional).</li>
                          </ul>
                        </div>
                      </div>

                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h3 className="font-bold text-[#001529] mb-3">5. Allotment Finalization Certificate</h3>
                        <div className="orhp m-0 p-0 border-none bg-transparent text-sm text-slate-600">
                          <ul className="list-disc pl-5 space-y-1">
                            <li>List of allottees with amounts authenticated.</li>
                            <li>Oversubscription handling mechanism, if applicable.</li>
                          </ul>
                        </div>
                      </div>

                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h3 className="font-bold text-[#001529] mb-3">6. Escrow Account Details</h3>
                        <div className="orhp m-0 p-0 border-none bg-transparent text-sm text-slate-600">
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Confirmation of funds received in the designated account.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12" id="provid-zcpis">
                    <h2 className="text-2xl font-black text-[#001529] mb-4">Documents to Be Provided for Listing of ZCZPIs</h2>
                    <p className="text-slate-600 font-medium">After the successful allocation of the issue, the listing of ZCZPIs entails the submission of a final package of documents to the SSE.</p>

                    <div className="space-y-6 mt-8">
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h3 className="font-bold text-[#001529] mb-3">1. Final Allotment Document</h3>
                        <div className="orhp m-0 p-0 border-none bg-transparent text-sm text-slate-600">
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Adding a list of allottees and allotment quantum.</li>
                            <li>Signed by an authorized signatory of the NPO.</li>
                          </ul>
                        </div>
                      </div>

                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h3 className="font-bold text-[#001529] mb-3">2. ISIN Activation Confirmation</h3>
                        <div className="orhp m-0 p-0 border-none bg-transparent text-sm text-slate-600">
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Issued by depositories (NSDL/CDSL) for the ZCZPIs.</li>
                            <li>Ensures dematerialization.</li>
                          </ul>
                        </div>
                      </div>

                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h3 className="font-bold text-[#001529] mb-2">3. Listing Application Form</h3>
                        <p className="text-sm text-slate-600">Standard format as prescribed by NSE/BSE.</p>
                      </div>

                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h3 className="font-bold text-[#001529] mb-3">4. Trustee/Director Declaration</h3>
                        <div className="orhp m-0 p-0 border-none bg-transparent text-sm text-slate-600">
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Confirming the non-trading nature of ZCZPIs.</li>
                            <li>Ensuring transfer is only allowed in exceptional situations.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 p-8 bg-blue-50 border border-blue-100 rounded-2xl" id="Post-Listing">
                    <h4 className="text-xl font-black text-[#001529] mb-4">Post-Listing Requirements</h4>
                    <div className="orhp m-0 p-0 border-none bg-transparent text-sm text-slate-600">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Quarterly Fund Utilization Statement.</li>
                        <li>Annual <b>Impact Assessment Report</b> within 90 days of the FY end.</li>
                        <li>Material event disclosures within 7 days of occurrence.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-12">
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-2xl">
                      {/* Background Glow */}
                      <div className="absolute top-0 right-0 w-72 h-72 bg-[#f59e08]/10 rounded-full -mr-36 -mt-36 blur-3xl"></div>

                      {/* Icon */}
                      <div className="absolute top-6 right-6 opacity-10">
                        <TrendingUp className="h-32 w-32 text-[#001529]" />
                      </div>

                      {/* Content */}
                      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                        {/* Left Side */}
                        <div className="max-w-2xl">
                          <h3 className="text-3xl font-black mb-5 text-[#001529]">
                            Raise Funds through SSE
                          </h3>
                          <p className="text-slate-700 text-lg leading-8 font-medium">
                            If you are a registered NGO, Society, or Trust working in the
                            fields of health and education, you can raise funds up to
                            <span className="font-black text-[#f59e08]"> ₹10–20 crore </span>
                            through the Social Stock Exchange.
                          </p>
                        </div>

                        {/* CTA Button */}
                        <Link
                          href="/contact"
                          className="inline-flex items-center gap-2 bg-[#f59e08] hover:bg-[#001529] text-[#001529] hover:text-white px-8 py-4 rounded-2xl font-black transition-all duration-300 transform hover:scale-105 shadow-xl whitespace-nowrap"
                        >
                          Contact IndiaIPO Expert
                          <ChevronRight className="h-5 w-5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
