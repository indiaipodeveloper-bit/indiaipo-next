import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SSESidebar from "../SSESidebar";
import Link from "next/link";
import { ChevronRight, Home, List, ShieldCheck, Globe, Building2, Calendar } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Listed & Registered NPOs | India IPO",
  description: "Directory of Registered and Listed NPOs on BSE SSE and NSE SSE.",
};

export default function ListedNPOsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header />

      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-10 flex-wrap font-medium">
            <Link href="/" className="hover:text-[#f59e08] flex items-center gap-1 transition-colors">
              <Home className="h-4 w-4" /> Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-[#001529] font-bold">Social Stock Exchange</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-400">Listed NPOs</span>
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
                      Registered and Listed NPOs
                    </h1>
                    <div className="flex items-center gap-4 text-slate-500 text-sm font-semibold">
                      <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                        <Building2 className="h-4 w-4 text-[#f59e08]" />
                        BSE & NSE SSE
                      </span>
                      <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                        <List className="h-4 w-4 text-[#f59e08]" />
                        Directory
                      </span>
                    </div>
                  </div>
                </div>

                <div className="service-content">
                  <p className="text-lg text-slate-600 leading-relaxed font-medium mb-12">
                    Comprehensive directory of Non-Profit Organizations (NPOs) that have successfully registered or listed their instruments on the Social Stock Exchange platforms of BSE and NSE.
                  </p>

                  <div className="mt-12">
                    <h2 className="flex items-center gap-3 mb-8 text-2xl font-black text-[#001529]">
                      <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                        <ShieldCheck className="h-6 w-6 text-[#f59e08]" />
                      </div>
                      NPOs Listed on NSE & BSE SSE
                    </h2>
                    
                    <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
                      <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-[#001529]">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider border-r border-slate-700">Name of NPO</th>
                            <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider border-r border-slate-700">Listed Year</th>
                            <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider border-r border-slate-700">City</th>
                            <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider border-r border-slate-700">Symbol / ISIN</th>
                            <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider">Focus Area</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-bold text-[#001529] border-r border-slate-100">SGBS Unnati Foundation</td>
                            <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100">2023</td>
                            <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100">Bengaluru</td>
                            <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100">
                              <span className="block font-bold text-[#001529]">UNNATI-SE</span>
                              <span className="text-xs text-slate-500">INE0O4Y01018</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">Youth skilling & employment</td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-bold text-[#001529] border-r border-slate-100">Mukti</td>
                            <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100">2024</td>
                            <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100">Kolkata</td>
                            <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100">
                              <span className="block font-bold text-[#001529]">MUKTI-SE</span>
                              <span className="text-xs text-slate-500">INE0TMY01010</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">Economic empowerment, health</td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-bold text-[#001529] border-r border-slate-100">Missing Link Trust</td>
                            <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100">2024</td>
                            <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100">Kolkata</td>
                            <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100">
                              <span className="block font-bold text-[#001529]">MISSING-SE</span>
                              <span className="text-xs text-slate-500">INE0GU4I01014</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">Education for marginalized children</td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-bold text-[#001529] border-r border-slate-100">Ekalavya Foundation</td>
                            <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100">2024</td>
                            <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100">Hyderabad</td>
                            <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100">
                              <span className="block font-bold text-[#001529]">EF-SE</span>
                              <span className="text-xs text-slate-500">INE0OR5I01013</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">Tribal livelihoods, education</td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-bold text-[#001529] border-r border-slate-100">Sarthak Educational Trust</td>
                            <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100">2024</td>
                            <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100">New Delhi</td>
                            <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100">
                              <span className="block font-bold text-[#001529]">SARTHAK-SE</span>
                              <span className="text-xs text-slate-500">INE0O4Y01026</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">Disability inclusion, skilling</td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-bold text-[#001529] border-r border-slate-100">Transforming Rural India Foundation</td>
                            <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100">2024</td>
                            <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100">New Delhi</td>
                            <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100">
                              <span className="block font-bold text-[#001529]">TRIF-SE</span>
                              <span className="text-xs text-slate-500">INE0OR5U01015</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">Rural development, skilling</td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-bold text-[#001529] border-r border-slate-100">Swami Vivekananda Youth Movement</td>
                            <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100">2024</td>
                            <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100">Mysuru</td>
                            <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100">
                              <span className="block font-bold text-[#001529]">SVYM-SE</span>
                              <span className="text-xs text-slate-500">INE0TYRI01015</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">Rural health, tribal education</td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-bold text-[#001529] border-r border-slate-100">Swades Foundation</td>
                            <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100">2024</td>
                            <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100">Mumbai</td>
                            <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100">
                              <span className="block font-bold text-[#001529]">SWADES-SE</span>
                              <span className="text-xs text-slate-500">INE0O4Y01034</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">Rural transformation, water</td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-bold text-[#001529] border-r border-slate-100">Prashanthi Balamandira Trust</td>
                            <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100">2024</td>
                            <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100">Karnataka</td>
                            <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100">
                              <span className="block font-bold text-[#001529]">PBT-SE</span>
                              <span className="text-xs text-slate-500">INE0O4Y01042</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">Rural education, nutrition</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-20">
                    <h2 className="flex items-center gap-3 mb-8 text-2xl font-black text-[#001529]">
                      <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                        <Calendar className="h-6 w-6 text-[#f59e08]" />
                      </div>
                      NPOs Registered on NSE SSE Platform
                    </h2>
                    
                    <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm max-h-[600px]">
                      <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-[#001529] sticky top-0 z-10">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider border-r border-slate-700">Sr.</th>
                            <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider border-r border-slate-700">Name of the NPO</th>
                            <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider border-r border-slate-700">Reg. No.</th>
                            <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider border-r border-slate-700">Valid Up To</th>
                            <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                          {[
                            { id: 1, name: "SGBS Unnati Foundation", reg: "NSESSENPO0002", valid: "2025-12-05", status: "Valid" },
                            { id: 2, name: "Mukti", reg: "NSESSENPO0011", valid: "2024-05-21", status: "Expired" },
                            { id: 3, name: "MISSING LINK TRUST", reg: "NSESSENPO0012", valid: "2024-05-21", status: "Expired" },
                            { id: 4, name: "Ekalavya Foundation", reg: "NSESSENPO0015", valid: "2024-06-08", status: "Expired" },
                            { id: 5, name: "Sarthak Educational Trust", reg: "NSESSENPO0017", valid: "2024-07-16", status: "Expired" },
                            { id: 6, name: "Transforming Rural India Foundation", reg: "NSESSENPO0022", valid: "2024-09-05", status: "Expired" },
                            { id: 7, name: "Keshav Srushti", reg: "NSESSENPO0023", valid: "2025-09-19", status: "Valid" },
                            { id: 8, name: "Avtar Development Foundation", reg: "NSESSENPO0029", valid: "2025-11-07", status: "Valid" },
                            { id: 9, name: "Swami Vivekananda Youth Movement", reg: "NSESSENPO0030", valid: "2024-11-09", status: "Expired" },
                            { id: 10, name: "Udhavum Ullangal Public Charitable Trust", reg: "NSESSENPO0031", valid: "2025-11-15", status: "Valid" },
                            { id: 11, name: "Pushp Kiran Union For Real Enlightenment (Pure)", reg: "NSESSENPO0036", valid: "2025-11-28", status: "Valid" },
                            { id: 12, name: "Blink Foundation", reg: "NSESSENPO0041", valid: "2025-12-20", status: "Valid" },
                            { id: 13, name: "Pinkishe Foundation", reg: "NSESSENPO0042", valid: "2025-12-27", status: "Valid" },
                            { id: 14, name: "Swades Foundation", reg: "NSESSENPO0041", valid: "2025-12-20", status: "Valid" },
                            { id: 15, name: "Future Hope India", reg: "NSESSENPO0046", valid: "2026-01-21", status: "Valid" },
                            { id: 16, name: "Samaritan Help Mission", reg: "NSESSENPO0048", valid: "2026-02-07", status: "Valid" },
                            { id: 17, name: "Prashanthi Balamandira Trust", reg: "NSESSENPO0050", valid: "2026-02-25", status: "Valid" },
                            { id: 18, name: "Nav Jagriti", reg: "NSESSENPO0055", valid: "2026-03-13", status: "Valid" },
                            { id: 19, name: "Jeevan Vikas Samajik Bahuddeshiya Panlot Sanstha", reg: "NSESSENPO0058", valid: "2026-03-20", status: "Valid" },
                            { id: 20, name: "Indian Cancer Society", reg: "NSESSENPO0062", valid: "2026-05-28", status: "Valid" },
                            { id: 21, name: "Swayam Shikshan Prayog", reg: "NSESSENPO0065", valid: "2026-06-02", status: "Valid" },
                            { id: 22, name: "Waste Warriors Society", reg: "NSESSENPO0070", valid: "2025-07-01", status: "Expired" },
                            { id: 23, name: "Savali Charitable Trust", reg: "NSESSENPO0071", valid: "2025-07-07", status: "Expired" },
                            { id: 24, name: "Council For Green Revolution", reg: "NSESSENPO0072", valid: "2025-07-24", status: "Valid" },
                            { id: 25, name: "National Backward Classes Finance And Development Corporation", reg: "NSESSENPO0073", valid: "2025-07-24", status: "Valid" },
                            { id: 26, name: "Nsfdc", reg: "NSESSENPO0074", valid: "2025-08-08", status: "Valid" },
                            { id: 27, name: "Satya Special School", reg: "NSESSENPO0075", valid: "2025-08-12", status: "Valid" },
                            { id: 28, name: "Dantan Manav Kalyan Kendra", reg: "NSESSENPO0076", valid: "2025-08-12", status: "Valid" },
                            { id: 29, name: "Ma Foundation", reg: "NSESSENPO0077", valid: "2025-08-18", status: "Valid" },
                            { id: 30, name: "Ashirwad Shaikshanik & Samajik Sanstha", reg: "NSESSENPO0078", valid: "2025-08-18", status: "Valid" },
                            { id: 31, name: "Matoshri Jayaben Himmatlal Shah Charitable Trust", reg: "NSESSENPO0079", valid: "2025-08-21", status: "Valid" },
                            { id: 32, name: "Hope Ek Asha", reg: "NSESSENPO0080", valid: "2025-08-26", status: "Valid" },
                            { id: 33, name: "Mallarpur Naisuva", reg: "NSESSENPO0081", valid: "2025-08-28", status: "Valid" },
                            { id: 34, name: "Tarun Bharat Sangha", reg: "NSESSENPO0082", valid: "2025-10-13", status: "Valid" },
                            { id: 35, name: "Anudip Foundation For Social Welfare", reg: "NSESSENPO0083", valid: "2025-10-14", status: "Valid" },
                            { id: 36, name: "Adarsh Gram Vikas Sewa Samiti", reg: "NSESSENPO0084", valid: "2025-10-14", status: "Valid" },
                            { id: 37, name: "Asra Samajik Lok Kalyan Samiti Dewas", reg: "NSESSENPO0085", valid: "2025-10-22", status: "Valid" },
                            { id: 38, name: "New Directions Educational Society", reg: "NSESSENPO0086", valid: "2025-11-03", status: "Valid" },
                            { id: 39, name: "Praveenlata Sansthan", reg: "NSESSENPO0087", valid: "2025-11-05", status: "Valid" },
                            { id: 40, name: "Sarva Seva Samity Sanstha", reg: "NSESSENPO0088", valid: "2025-11-06", status: "Valid" },
                            { id: 41, name: "Social Action For Rural Development", reg: "NSESSENPO0089", valid: "2025-11-10", status: "Valid" },
                            { id: 42, name: "Tagore Society For Rural Development", reg: "NSESSENPO0090", valid: "2025-11-10", status: "Valid" },
                            { id: 43, name: "Sistry Foundation", reg: "NSESSENPO0091", valid: "2025-11-12", status: "Valid" },
                            { id: 44, name: "Network For Enterprise Enhancement And Development Support Needs", reg: "NSESSENPO0092", valid: "2025-11-12", status: "Valid" },
                            { id: 45, name: "Kalyanam Karoti", reg: "NSESSENPO0093", valid: "2025-11-13", status: "Valid" },
                            { id: 46, name: "Akshaya Trust", reg: "NSESSENPO0094", valid: "2025-11-13", status: "Valid" },
                            { id: 47, name: "Attakkalari Public Charitable Trust", reg: "NSESSENPO0095", valid: "2025-12-02", status: "Valid" },
                            { id: 48, name: "School For Potential Advancement", reg: "NSESSENPO0096", valid: "2025-12-03", status: "Valid" },
                            { id: 49, name: "Shree Ranchhoddasji Hospital", reg: "NSESSENPO0097", valid: "2025-12-04", status: "Valid" },
                            { id: 50, name: "Narayan Seva Sansthan", reg: "NSESSENPO0098", valid: "2025-12-04", status: "Valid" },
                            { id: 51, name: "Shakti Social Cultural Organization", reg: "NSESSENPO0099", valid: "2025-12-05", status: "Valid" },
                            { id: 52, name: "Sabuj Sangha", reg: "NSESSENPO00100", valid: "2025-12-05", status: "Valid" },
                            { id: 53, name: "Aas", reg: "NSESSENPO00101", valid: "2026-01-01", status: "Valid" },
                            { id: 54, name: "Vaagdhara", reg: "NSESSENPO00102", valid: "2026-01-01", status: "Valid" },
                            { id: 55, name: "Srujna Charitable Trust", reg: "NSESSENPO00103", valid: "2026-01-07", status: "Valid" },
                            { id: 56, name: "The Asha Kiran Mahila Vikas", reg: "NSESSENPO00104", valid: "2026-01-09", status: "Valid" },
                            { id: 57, name: "Aroh Foundation", reg: "NSESSENPO00105", valid: "2026-01-09", status: "Valid" },
                            { id: 58, name: "Atma Foundation", reg: "NSESSENPO00106", valid: "2026-01-09", status: "Valid" },
                            { id: 59, name: "Tns India Foundation", reg: "NSESSENPO00107", valid: "2026-01-09", status: "Valid" },
                            { id: 60, name: "National Skill Development (NSDC)", reg: "NSESSENPO00108", valid: "2026-01-12", status: "Valid" },
                            { id: 61, name: "Institute Of Rural Development", reg: "NSESSENPO00109", valid: "2026-01-26", status: "Valid" },
                            { id: 62, name: "Ipe Global Centre", reg: "NSESSENPO00110", valid: "2026-02-11", status: "Valid" },
                            { id: 63, name: "Global Vikas Trust", reg: "NSESSENPO00111", valid: "2026-02-13", status: "Valid" },
                            { id: 64, name: "Centre For Tribals", reg: "NSESSENPO00112", valid: "2026-02-13", status: "Valid" },
                            { id: 65, name: "Foundation For Msme Clusters", reg: "NSESSENPO00113", valid: "2026-02-27", status: "Valid" },
                            { id: 66, name: "Adhyayan Quality Education", reg: "NSESSENPO00114", valid: "2026-02-27", status: "Valid" },
                            { id: 67, name: "Rushabh Foundation", reg: "NSESSENPO00115", valid: "2026-02-27", status: "Valid" },
                            { id: 68, name: "Lok Sewa Evam Grameen", reg: "NSESSENPO00116", valid: "2026-03-20", status: "Valid" },
                            { id: 69, name: "Vasudha Vikas Sansthan", reg: "NSESSENPO00117", valid: "2026-03-20", status: "Valid" },
                            { id: 70, name: "Saraswati Sevabhavi Sanstha", reg: "NSESSENPO00118", valid: "2026-03-26", status: "Valid" },
                            { id: 71, name: "Jan Jagran Kendra", reg: "NSESSENPO00119", valid: "2026-03-26", status: "Valid" },
                            { id: 72, name: "Bhaktivedanta Research Center", reg: "NSESSENPO00120", valid: "2026-03-31", status: "Valid" },
                            { id: 73, name: "Manav Mandir Mission Trust", reg: "NSESSENPO00121", valid: "2026-04-03", status: "Valid" },
                            { id: 74, name: "Pradan (Professional Assistance)", reg: "NSESSENPO00122", valid: "2026-04-03", status: "Valid" },
                            { id: 75, name: "Bhojpur Mahila Kala Kendra", reg: "NSESSENPO00123", valid: "2026-04-03", status: "Valid" },
                            { id: 76, name: "Give Me Trees Trust", reg: "NSESSENPO00124", valid: "2026-04-03", status: "Valid" },
                            { id: 77, name: "Association Of People With Disability", reg: "NSESSENPO00125", valid: "2026-04-24", status: "Valid" },
                            { id: 78, name: "Sustainable Environment (SEEDS)", reg: "NSESSENPO00126", valid: "2026-04-24", status: "Valid" },
                            { id: 79, name: "National Scheduled Tribes Corp", reg: "NSESSENPO00127", valid: "2026-05-12", status: "Valid" },
                            { id: 80, name: "Operation Eyesight India", reg: "NSESSENPO00128", valid: "2026-05-12", status: "Valid" },
                            { id: 81, name: "Amar Seva Sangam", reg: "NSESSENPO00129", valid: "2026-05-12", status: "Valid" },
                            { id: 82, name: "Shree Guru Jambeshwar Sewa", reg: "NSESSENPO00130", valid: "2026-05-15", status: "Valid" },
                            { id: 83, name: "Logistics Sector Skill Council", reg: "NSESSENPO00131", valid: "2026-05-22", status: "Valid" },
                            { id: 84, name: "Amba", reg: "NSESSENPO00132", valid: "2026-05-22", status: "Valid" },
                            { id: 85, name: "Mahita", reg: "NSESSENPO00133", valid: "2026-05-22", status: "Valid" },
                            { id: 86, name: "National Safai Karamcharis Corp", reg: "NSESSENPO00134", valid: "2026-05-22", status: "Valid" },
                            { id: 87, name: "Prayatn Sanstha", reg: "NSESSENPO00135", valid: "2026-05-22", status: "Valid" },
                            { id: 88, name: "Empower Foundation", reg: "NSESSENPO00136", valid: "2026-06-08", status: "Valid" },
                            { id: 89, name: "Outreach Association", reg: "NSESSENPO00136", valid: "2026-06-08", status: "Valid" },
                            { id: 90, name: "Utkal Sevak Samaj", reg: "NSESSENPO00138", valid: "2026-06-08", status: "Valid" },
                            { id: 91, name: "Butterflies", reg: "NSESSENPO00139", valid: "2026-06-25", status: "Valid" },
                            { id: 92, name: "Gram Bartori Vikas Shikshan", reg: "NSESSENPO00140", valid: "2026-06-25", status: "Valid" },
                          ].map((npo) => (
                            <tr key={npo.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 text-sm font-bold text-slate-400 border-r border-slate-100">{npo.id}</td>
                              <td className="px-6 py-4 text-sm font-bold text-[#001529] border-r border-slate-100">{npo.name}</td>
                              <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100">{npo.reg}</td>
                              <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100">{npo.valid}</td>
                              <td className="px-6 py-4 text-sm">
                                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                                  npo.status === "Valid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                }`}>
                                  {npo.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-20">
                    <h2 className="flex items-center gap-3 mb-8 text-2xl font-black text-[#001529]">
                      <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                        <Globe className="h-6 w-6 text-[#f59e08]" />
                      </div>
                      NPOs Registered on BSE SSE Platform
                    </h2>
                    
                    <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm max-h-[600px]">
                      <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-[#001529] sticky top-0 z-10">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider border-r border-slate-700">Sr.</th>
                            <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider border-r border-slate-700">Name of the NPO</th>
                            <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider border-r border-slate-700">Reg. No.</th>
                            <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider border-r border-slate-700">Valid Up To</th>
                            <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                          {[
                            { id: 1, name: "Lok Kalyan Samiti", reg: "BSESSENPO0095", valid: "2026-11-06", status: "Valid" },
                            { id: 2, name: "National Divyangjan Corp", reg: "BSESSENPO0094", valid: "2026-05-06", status: "Valid" },
                            { id: 3, name: "Vatsalya Society", reg: "BSESSENPO0041", valid: "2026-05-27", status: "Valid" },
                            { id: 4, name: "Saath Charitable Trust", reg: "BSESSENPO0048", valid: "2026-05-25", status: "Valid" },
                            { id: 5, name: "Child Empowerment Foundation", reg: "BSESSENPO0039", valid: "2026-04-29", status: "Valid" },
                            { id: 6, name: "Sarthak Foundation", reg: "BSESSENPO0090", valid: "2026-04-24", status: "Valid" },
                            { id: 7, name: "Native Medicare Charitable Trust", reg: "BSESSENPO0091", valid: "2026-04-24", status: "Valid" },
                            { id: 8, name: "Unnati Organisation", reg: "BSESSENPO0092", valid: "2026-04-22", status: "Valid" },
                            { id: 9, name: "Goutami Eye Institute", reg: "BSESSENPO0093", valid: "2026-04-22", status: "Valid" },
                            { id: 10, name: "Samadhan Samiti", reg: "BSESSENPO0088", valid: "2026-04-16", status: "Valid" },
                            { id: 11, name: "Association of Lady Entrepreneurs", reg: "BSESSENPO0089", valid: "2026-04-15", status: "Valid" },
                            { id: 12, name: "UNITED WAY OF BENGALURU", reg: "BSESSENPO0036", valid: "2026-04-03", status: "Valid" },
                            { id: 13, name: "Apnalaya", reg: "BSESSENPO0087", valid: "2026-03-31", status: "Valid" },
                            { id: 14, name: "SEEDS Society", reg: "BSESSENPO0086", valid: "2026-03-20", status: "Valid" },
                            { id: 15, name: "Front For Rapid Economic Advancement", reg: "BSESSENPO0085", valid: "2026-03-19", status: "Valid" },
                            { id: 16, name: "Opportunity Foundation Trust", reg: "BSESSENPO0001", valid: "2026-03-18", status: "Valid" },
                            { id: 17, name: "SAAD FOUNDATION", reg: "BSESSENPO0015", valid: "2026-03-18", status: "Valid" },
                            { id: 18, name: "Udhyam Learning Foundation", reg: "BSESSENPO0027", valid: "2026-03-16", status: "Valid" },
                            { id: 19, name: "Artificial Limbs Mfg Corp", reg: "BSESSENPO0083", valid: "2026-03-12", status: "Valid" },
                            { id: 20, name: "Dor Education Foundation", reg: "BSESSENPO0084", valid: "2026-03-12", status: "Valid" },
                            { id: 21, name: "Adhyayan Quality Education", reg: "BSESSENPO0082", valid: "2026-02-18", status: "Valid" },
                            { id: 22, name: "PRADAN", reg: "BSESSENPO0081", valid: "2026-02-13", status: "Valid" },
                            { id: 23, name: "Citizens Association for Child Rights", reg: "BSESSENPO0023", valid: "2026-02-05", status: "Valid" },
                            { id: 24, name: "Breakthrough Trust", reg: "BSESSENPO0080", valid: "2026-01-28", status: "Valid" },
                            { id: 25, name: "Indo-Swiss Centre of Excellence", reg: "BSESSENPO0078", valid: "2026-01-26", status: "Valid" },
                            { id: 26, name: "Sanjeevani Vikas Evam Jan Kalyan", reg: "BSESSENPO0079", valid: "2026-01-26", status: "Valid" },
                            { id: 27, name: "AkhandJyoti Foundation", reg: "BSESSENPO0018", valid: "2026-01-26", status: "Valid" },
                            { id: 28, name: "Dignity Foundation", reg: "BSESSENPO0077", valid: "2026-01-16", status: "Valid" },
                            { id: 29, name: "Nightingales Medical Trust", reg: "BSESSENPO0076", valid: "2026-01-14", status: "Valid" },
                            { id: 30, name: "Apne Aap Womens Collective", reg: "BSESSENPO0074", valid: "2026-01-08", status: "Valid" },
                            { id: 31, name: "Friends of Tribal Society", reg: "BSESSENPO0075", valid: "2026-01-06", status: "Valid" },
                            { id: 32, name: "SGBS Unnati Foundation", reg: "BSESSENPO0005", valid: "2026-01-05", status: "Valid" },
                            { id: 33, name: "Skills for Progress", reg: "BSESSENPO0026", valid: "2026-01-02", status: "Valid" },
                            { id: 34, name: "Aga Khan Agency for Habitat", reg: "BSESSENPO0030", valid: "2025-12-31", status: "Valid" },
                            { id: 35, name: "Acil Navasarjan Rural Development", reg: "BSESSENPO0072", valid: "2025-12-10", status: "Valid" },
                            { id: 36, name: "TAGORE SOCIETY", reg: "BSESSENPO0022", valid: "2025-12-08", status: "Valid" },
                            { id: 37, name: "Sree Jayendra Saraswathi Trust", reg: "BSESSENPO0071", valid: "2025-12-05", status: "Valid" },
                            { id: 38, name: "Foundation for IDEA", reg: "BSESSENPO0070", valid: "2025-12-01", status: "Valid" },
                            { id: 39, name: "Khushii Kinship", reg: "BSESSENPO0069", valid: "2025-11-28", status: "Valid" },
                            { id: 40, name: "GLOBAL TRUST", reg: "BSESSENPO0067", valid: "2025-11-25", status: "Valid" },
                            { id: 41, name: "WOMEN'S INITIATIVES", reg: "BSESSENPO0068", valid: "2025-11-25", status: "Valid" },
                            { id: 42, name: "Pahal Nurturing Lives", reg: "BSESSENPO0066", valid: "2025-11-18", status: "Valid" },
                            { id: 43, name: "National Backward Classes Corp", reg: "BSESSENPO0065", valid: "2025-11-18", status: "Valid" },
                            { id: 44, name: "Social Activities for Rural Development", reg: "BSESSENPO0064", valid: "2025-10-29", status: "Valid" },
                            { id: 45, name: "Lotus Petal Charitable Foundation", reg: "BSESSENPO0062", valid: "2025-10-28", status: "Valid" },
                            { id: 46, name: "RAINTREE FOUNDATION", reg: "BSESSENPO0013", valid: "2025-10-24", status: "Valid" },
                            { id: 47, name: "Maa Tara Foundation", reg: "BSESSENPO0060", valid: "2025-10-24", status: "Valid" },
                            { id: 48, name: "ANGARGARIA SRIJONI SIKSHA", reg: "BSESSENPO0059", valid: "2025-10-22", status: "Valid" },
                            { id: 49, name: "Siru thuli", reg: "BSESSENPO0058", valid: "2025-09-24", status: "Valid" },
                            { id: 50, name: "Buzz India Trust", reg: "BSESSENPO0057", valid: "2025-09-23", status: "Valid" },
                            { id: 51, name: "SRIPUR SWAMI VIVEKANANDA", reg: "BSESSENPO0056", valid: "2025-09-09", status: "Valid" },
                            { id: 52, name: "Enviro Creators Foundation", reg: "BSESSENPO0055", valid: "2025-07-23", status: "Valid" },
                          ].map((npo) => (
                            <tr key={npo.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 text-sm font-bold text-slate-400 border-r border-slate-100">{npo.id}</td>
                              <td className="px-6 py-4 text-sm font-bold text-[#001529] border-r border-slate-100">{npo.name}</td>
                              <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100">{npo.reg}</td>
                              <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100">{npo.valid}</td>
                              <td className="px-6 py-4 text-sm">
                                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                                  npo.status === "Valid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                }`}>
                                  {npo.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
