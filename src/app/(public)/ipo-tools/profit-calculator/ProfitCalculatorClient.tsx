"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { API_URL } from "@/lib/constants";

export default function ProfitCalculatorClient({ id }: { id?: string }) {
  const searchParams = useSearchParams();

  // Dynamic state for selected IPO details (defaulted to RCL Retail IPO values)
  const [ipoName, setIpoName] = useState<string>("RCL Retail IPO");
  const [lotSize, setLotSize] = useState<number>(10000);
  const [issuePrice, setIssuePrice] = useState<number>(10);

  const [category, setCategory] = useState<string>("sHNI");
  const [amountText, setAmountText] = useState<string>("500,000");
  const [validationError, setValidationError] = useState<string | null>(null);

  // Output states
  const [lotsToApply, setLotsToApply] = useState<number>(5);
  const [sharesToApply, setSharesToApply] = useState<number>(50000);
  const [totalAmount, setTotalAmount] = useState<number>(500000);

  // Read URL search params or fetch by id
  useEffect(() => {
    if (id) {
      const fetchIpoDetails = async () => {
        try {
          const res = await fetch(`${API_URL}/api/ipo-lists/${id}`);
          if (res.ok) {
            const data = await res.json();
            if (data) {
              if (data.issuer_company) {
                setIpoName(data.issuer_company);
              }
              if (data.lot_size) {
                const parsedLot = typeof data.lot_size === 'string'
                  ? parseInt(data.lot_size.replace(/[^0-9]/g, ""), 10)
                  : Number(data.lot_size);
                if (!isNaN(parsedLot) && parsedLot > 0) {
                  setLotSize(parsedLot);
                }
              }
              const price = data.issue_highest_price || data.issue_lowest_price;
              if (price) {
                const parsedPrice = typeof price === 'string'
                  ? parseFloat(price)
                  : Number(price);
                if (!isNaN(parsedPrice) && parsedPrice > 0) {
                  setIssuePrice(parsedPrice);
                }
              }
            }
          }
        } catch (err) {
          console.error("Error fetching IPO details in calculator:", err);
        }
      };
      fetchIpoDetails();
    } else {
      const nameParam = searchParams.get("name");
      const lotSizeParam = searchParams.get("lotSize");
      const priceParam = searchParams.get("price");

      if (nameParam) {
        setIpoName(nameParam);
      }
      if (lotSizeParam) {
        const parsedLot = parseInt(lotSizeParam.replace(/[^0-9]/g, ""), 10);
        if (!isNaN(parsedLot) && parsedLot > 0) {
          setLotSize(parsedLot);
        }
      }
      if (priceParam) {
        const parsedPrice = parseFloat(priceParam);
        if (!isNaN(parsedPrice) && parsedPrice > 0) {
          setIssuePrice(parsedPrice);
        }
      }
    }
  }, [id, searchParams]);

  const calculateShares = () => {
    const rawAmount = parseFloat(amountText.replace(/,/g, "")) || 0;
    
    // Validate range limits for each group
    let errorMsg: string | null = null;
    if (category === "Retail") {
      if (rawAmount > 200000) {
        errorMsg = "Retail investment amount cannot exceed ₹2,00,000. Please change category to sHNI or bHNI.";
      }
    } else if (category === "sHNI") {
      if (rawAmount < 200000 || rawAmount > 1000000) {
        errorMsg = "sHNI investment amount must be between ₹2,00,000 and ₹10,00,000.";
      }
    } else if (category === "bHNI") {
      if (rawAmount <= 1000000) {
        errorMsg = "bHNI investment amount must be more than ₹10,00,000.";
      }
    }

    setValidationError(errorMsg);

    if (errorMsg) {
      setLotsToApply(0);
      setSharesToApply(0);
      setTotalAmount(0);
      return;
    }

    const lotAmount = lotSize * issuePrice;
    const lots = Math.floor(rawAmount / lotAmount);
    const shares = lots * lotSize;
    const computedTotal = shares * issuePrice;

    setLotsToApply(lots);
    setSharesToApply(shares);
    setTotalAmount(computedTotal);
  };

  // Perform calculation automatically when category, amount, lot size, or issue price changes
  useEffect(() => {
    calculateShares();
  }, [amountText, category, lotSize, issuePrice]);

  const handleAmountChange = (text: string) => {
    const cleanDigits = text.replace(/[^0-9]/g, "");
    if (cleanDigits === "") {
      setAmountText("");
      return;
    }
    const parsed = parseInt(cleanDigits, 10);
    setAmountText(new Intl.NumberFormat("en-IN").format(parsed));
  };

  const formatRupee = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatNum = (val: number) => {
    return new Intl.NumberFormat("en-IN").format(val);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-slate-900 flex flex-col text-slate-700 dark:text-slate-200">
      
      <main className="flex-grow pt-16 md:pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Main Title Heading */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
              {ipoName} Calculator
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Shares and Lots Allocation Budget Calculator for {ipoName}.
            </p>
          </div>

          {/* Calculator Card Container */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg shadow-sm">
            <div className="p-5 border-b border-slate-100 dark:border-slate-850">
              <h2 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-150">
                IPO Shares to Apply By Amount Calculator
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Enter the amount you would like to invest in {ipoName} and find how many shares you should apply. In an IPO, shares are applied in lots. This calculator helps you to find an exact number of shares to apply for the given amount.
              </p>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
                For SME IPOs, Individual investors have to apply for 2 lots: Individual investors (Retail)
              </p>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Form Input Table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded overflow-hidden">
                <table className="w-full text-sm border-collapse bg-slate-50/50 dark:bg-slate-900/10">
                  <tbody>
                    {/* Category Row */}
                    <tr className="border-b border-slate-150 dark:border-slate-800">
                      <td className="py-3.5 px-4 font-semibold text-slate-500 w-1/2">
                        Investor category
                      </td>
                      <td className="py-3.5 px-4 w-1/2">
                        <select
                          value={category}
                          onChange={(e) => {
                            setCategory(e.target.value);
                            // Auto-adjust default amounts based on category selection
                            if (e.target.value === "Retail") {
                              setAmountText("100,000");
                            } else if (e.target.value === "sHNI") {
                              setAmountText("500,000");
                            } else if (e.target.value === "bHNI") {
                              setAmountText("1,100,000");
                            }
                          }}
                          className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-sm font-semibold text-slate-750 dark:text-slate-150 outline-none focus:border-indigo-500"
                        >
                          <option value="Retail">Retail</option>
                          <option value="sHNI">sHNI</option>
                          <option value="bHNI">bHNI</option>
                        </select>
                      </td>
                    </tr>

                    {/* Amount Input Row */}
                    <tr className="border-b border-slate-150 dark:border-slate-800">
                      <td className="py-3.5 px-4 font-semibold text-slate-500">
                        Amount to Invest (Rs)
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-slate-400 font-semibold text-xs">₹</span>
                          <input
                            type="text"
                            value={amountText}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            placeholder="0"
                            className="w-full pl-6 bg-[#fffeea] dark:bg-yellow-950/20 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-sm font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500"
                          />
                        </div>
                      </td>
                    </tr>

                    {/* Lot Size Row */}
                    <tr className="border-b border-slate-150 dark:border-slate-800">
                      <td className="py-3.5 px-4 font-semibold text-slate-500">
                        Lot Size (Shares)
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                        {formatNum(lotSize)}
                      </td>
                    </tr>

                    {/* Shares Issue Price Row */}
                    <tr>
                      <td className="py-3.5 px-4 font-semibold text-slate-500">
                        Shares Issue Price (Rs)
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                        {issuePrice.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Validation Warning Alert */}
              {validationError && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-650 dark:text-red-400 p-3.5 rounded text-xs font-bold flex gap-2">
                  <span className="shrink-0 font-extrabold">⚠️ Alert:</span>
                  <span>{validationError}</span>
                </div>
              )}

              {/* Action Button */}
              <div className="flex justify-center">
                <button
                  onClick={calculateShares}
                  className="bg-[#2463eb] hover:bg-blue-700 text-white text-xs font-bold uppercase py-2.5 px-8 rounded shadow-sm hover:shadow transition-all"
                >
                  Find No. of Shares to Apply
                </button>
              </div>

              {/* Calculation Output Table */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Calculation Results</h3>
                
                <div className="border border-slate-200 dark:border-slate-800 rounded overflow-hidden">
                  <table className="w-full text-sm border-collapse bg-slate-50/20 dark:bg-slate-900/10">
                    <tbody>
                      {/* Lots to Apply */}
                      <tr className="border-b border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-950">
                        <td className="py-3.5 px-4 font-semibold text-slate-500 w-1/2">Lots to Apply</td>
                        <td className="py-3.5 px-4 font-black text-slate-800 dark:text-slate-100 text-lg w-1/2">
                          {lotsToApply}
                        </td>
                      </tr>

                      {/* Shares to Apply */}
                      <tr className="border-b border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-950">
                        <td className="py-3.5 px-4 font-semibold text-slate-500">Shares to Apply</td>
                        <td className="py-3.5 px-4 font-black text-slate-800 dark:text-slate-100 text-lg">
                          {formatNum(sharesToApply)}
                        </td>
                      </tr>

                      {/* Total Amount applied */}
                      <tr className="bg-white dark:bg-slate-950">
                        <td className="py-3.5 px-4 font-semibold text-slate-500">Total Amount (Rs)</td>
                        <td className="py-3.5 px-4 font-black text-slate-800 dark:text-slate-100 text-lg">
                          {formatRupee(totalAmount)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
      
    </div>
  );
}
