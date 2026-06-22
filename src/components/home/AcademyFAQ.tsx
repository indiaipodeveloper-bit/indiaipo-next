"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { academyItems, faqItems } from "@/data/academyFaqData";

const AcademyFAQ = () => {
    const [open, setOpen] = useState<number | null>(0);
    const [showAll, setShowAll] = useState(false);

    const visibleFaqs = showAll ? faqItems : faqItems.slice(0, 4);

    return (
        <section className="py-24 px-6 bg-slate-50 border-t border-slate-200">
            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20">
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tight mb-12 text-slate-900">
                        <strong style={{ color: "#f99810" }}>IPO</strong> Academy
                    </h2>
                    <div className="space-y-6">
                        {academyItems.map((item, i) => (
                            <div
                                key={i}
                                className="p-6 bg-white rounded-2xl flex items-start gap-6 shadow-2xl border border-slate-100 transition-shadow"
                            >
                                <div
                                    className={`w-14 h-14 rounded-full ${item.color} flex-shrink-0 flex items-center justify-center font-bold text-xl`}
                                >
                                    {item.n}
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-2 text-slate-900">
                                        {item.title}
                                    </h4>
                                    <p className="text-slate-500 text-sm leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tight mb-12 text-slate-900">
                        Frequently Asked
                    </h2>
                    <div className="space-y-4">
                        {visibleFaqs.map((item, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100"
                            >
                                <button
                                    onClick={() => setOpen(open === i ? null : i)}
                                    className="w-full flex justify-between items-center font-bold p-4 cursor-pointer text-left text-slate-900 hover:bg-slate-50 transition-colors"
                                >
                                    {item.q}
                                    <ChevronDown
                                        className={`h-5 w-5 text-slate-400 transition-transform flex-shrink-0 ${open === i ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {open === i && (
                                    <div className="overflow-hidden">
                                        <p className="px-4 pb-4 text-slate-500 text-sm border-t border-slate-100 pt-4 leading-relaxed whitespace-pre-line">
                                            {item.a}
                                        </p>
                                    </div>
                                )}

                            </div>
                        ))}

                        {faqItems.length > 4 && (
                            <div
                                className="pt-4 flex justify-center lg:justify-start"
                            >
                                <button
                                    onClick={() => setShowAll(!showAll)}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-xl text-sm font-bold hover:bg-blue-800 transition-all shadow-md active:scale-95 cursor-pointer"
                                >
                                    {showAll ? (
                                        <>
                                            Show less FAQ <ChevronUp className="h-4 w-4" />
                                        </>
                                    ) : (
                                        <>
                                            Show more FAQ <ChevronDown className="h-4 w-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default React.memo(AcademyFAQ);
