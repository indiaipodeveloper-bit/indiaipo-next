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

  // States for Funding Cost Calculator
  const [fundingIpoPrice, setFundingIpoPrice] = useState<number>(10);
  const [fundingNiiQuota, setFundingNiiQuota] = useState<number>(2);
  const [defaultNiiQuota, setDefaultNiiQuota] = useState<number>(2);
  const [startingOversubscription, setStartingOversubscription] = useState<number>(1);
  const [incrementalCollection, setIncrementalCollection] = useState<number>(100);
  const [fundingDays, setFundingDays] = useState<number>(7);
  const [fundingInterestRate, setFundingInterestRate] = useState<number>(12);
  const [hasSubscription, setHasSubscription] = useState<boolean>(false);

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
                  setFundingIpoPrice(parsedPrice);
                }
              }
              // Detect subscription existence and calculate default NII Quota
              let subExists = false;
              let calculatedQuota = 2;

              if (data.ipo_subscription) {
                try {
                  const parsed = typeof data.ipo_subscription === 'string'
                    ? JSON.parse(data.ipo_subscription)
                    : data.ipo_subscription;
                  if (Array.isArray(parsed) && parsed.length > 0) {
                    subExists = true;
                    const latestRow = parsed[parsed.length - 1];
                    if (latestRow) {
                      const getFloatVal = (val: any) => parseFloat(val) || 0;
                      const bniiOffered = getFloatVal(latestRow.bnii_offered);
                      const sniiOffered = getFloatVal(latestRow.snii_offered);
                      const niiOfferedVal = bniiOffered + sniiOffered;
                      const upperPrice = Number(data.issue_highest_price || data.issue_lowest_price || 0);
                      if (niiOfferedVal > 0 && upperPrice > 0) {
                        calculatedQuota = Math.max(1, Math.round((niiOfferedVal * upperPrice) / 10000000));
                      } else if (data.issue_size) {
                        const size = Number(data.issue_size);
                        if (!isNaN(size) && size > 0) {
                          const isSME = data.exchange && (data.exchange.toLowerCase().includes("sme") || data.exchange.toLowerCase().includes("emerge"));
                          const percentage = isSME ? 0.50 : 0.15;
                          calculatedQuota = Math.max(1, Math.round(size * percentage));
                        }
                      }
                    }
                  }
                } catch (err) {
                  console.error("Error parsing subscription in profit calculator:", err);
                }
              }

              setHasSubscription(subExists);
              if (subExists) {
                setFundingNiiQuota(calculatedQuota);
                setDefaultNiiQuota(calculatedQuota);
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

  // Synchronize IPO Price to funding calculator on load
  useEffect(() => {
    if (issuePrice) {
      setFundingIpoPrice(issuePrice);
    }
  }, [issuePrice]);

  // Generate 10 columns of funding data
  const generateFundingColumns = () => {
    const cols = [];
    let currentCollection = fundingNiiQuota * startingOversubscription;
    
    for (let i = 0; i < 10; i++) {
      if (i > 0) {
        currentCollection += incrementalCollection;
      }
      const oversubscription = fundingNiiQuota > 0 ? (currentCollection / fundingNiiQuota) : 0;
      cols.push({
        collection: currentCollection,
        oversubscription: oversubscription,
      });
    }
    return cols;
  };

  const fundingColumns = generateFundingColumns();

  // Helper to calculate Funding Cost per Share
  const calculateFundingCost = (oversubscription: number, rate: number) => {
    const cost = fundingIpoPrice * oversubscription * (rate / 100) * (fundingDays / 365);
    return Number(cost.toFixed(2));
  };

  // Compile all interest rates to display: custom rate + presets [7, 7.5, 8, 8.5, 9, 9.5, 10, 15]
  const presetRates = [7, 7.5, 8, 8.5, 9, 9.5, 10, 15];
  const allRates = [...presetRates];
  if (fundingInterestRate > 0 && !presetRates.includes(fundingInterestRate)) {
    allRates.unshift(fundingInterestRate);
  } else if (fundingInterestRate > 0) {
    const filteredPresets = presetRates.filter(r => r !== fundingInterestRate);
    allRates.splice(0, allRates.length, fundingInterestRate, ...filteredPresets);
  }

  // Export results as CSV
  const exportToCSV = () => {
    const headers = [
      "NII IPO Collection (Cr)",
      ...fundingColumns.map(col => col.collection.toFixed(2))
    ].map(cell => `"${cell}"`).join(",");
    
    const oversub = [
      "NII oversubscription (times)",
      ...fundingColumns.map(col => col.oversubscription.toFixed(2))
    ].map(cell => `"${cell}"`).join(",");
    
    const csvRows = [headers, oversub];
    
    allRates.forEach(rate => {
      const row = [
        `${rate}%`,
        ...fundingColumns.map(col => calculateFundingCost(col.oversubscription, rate).toFixed(2))
      ].map(cell => `"${cell}"`).join(",");
      csvRows.push(row);
    });
    
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${ipoName.replace(/\s+/g, "_")}_funding_cost_${fundingDays}_days.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

          {hasSubscription && (
            <div className="mt-8 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-lg shadow-sm">
            <div className="p-5 border-b border-slate-100 dark:border-slate-850">
              <h2 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-150">
                IPO Funding Interest Rates Calculator
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                {ipoName} funding cost is derived based on the NII (HNI) oversubscription and interest rate considering the {fundingDays}-day loan period. The table provides an estimated interest cost per share for rate of interest (ROI) ranging from 7 to 15% over a range of 10 different oversubscription intervals.
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Form Input Table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded overflow-hidden">
                <table className="w-full text-sm border-collapse bg-slate-50/50 dark:bg-slate-900/10">
                  <tbody>
                    {/* IPO Price */}
                    <tr className="border-b border-slate-150 dark:border-slate-800">
                      <td className="py-3.5 px-4 font-semibold text-slate-500 w-1/2">
                        IPO Price
                      </td>
                      <td className="py-3.5 px-4 w-1/2">
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-slate-400 font-semibold text-xs">₹</span>
                          <input
                            type="number"
                            step="0.01"
                            value={fundingIpoPrice || ""}
                            readOnly
                            className="w-full pl-6 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400 outline-none cursor-not-allowed"
                          />
                        </div>
                      </td>
                    </tr>

                    {/* NII IPO Quota */}
                    <tr className="border-b border-slate-150 dark:border-slate-800">
                      <td className="py-3.5 px-4 font-semibold text-slate-500">
                        NII IPO Quota
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-slate-400 font-semibold text-xs">₹</span>
                          <input
                            type="number"
                            step="0.01"
                            value={fundingNiiQuota || ""}
                            readOnly
                            className="w-full pl-6 pr-8 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400 outline-none cursor-not-allowed"
                          />
                          <span className="absolute right-3 top-2 text-slate-400 font-semibold text-xs">Cr</span>
                        </div>
                      </td>
                    </tr>

                    {/* NII oversubscription (Estimated in times) */}
                    <tr className="border-b border-slate-150 dark:border-slate-800">
                      <td className="py-3.5 px-4 font-semibold text-slate-500">
                        NII oversubscription (Estimated in times)
                      </td>
                      <td className="py-3.5 px-4">
                        <input
                          type="number"
                          step="0.01"
                          value={startingOversubscription || ""}
                          onChange={(e) => setStartingOversubscription(parseFloat(e.target.value) || 0)}
                          className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500"
                        />
                      </td>
                    </tr>

                    {/* NII IPO Collection (Incremental in ₹ Cr) */}
                    <tr className="border-b border-slate-150 dark:border-slate-800">
                      <td className="py-3.5 px-4 font-semibold text-slate-500">
                        NII IPO Collection (Incremental in ₹ Cr)
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="relative">
                          <input
                            type="number"
                            step="0.01"
                            value={incrementalCollection || ""}
                            onChange={(e) => setIncrementalCollection(parseFloat(e.target.value) || 0)}
                            className="w-full pr-8 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500"
                          />
                          <span className="absolute right-3 top-2 text-slate-400 font-semibold text-xs">Cr</span>
                        </div>
                      </td>
                    </tr>

                    {/* Number of Days */}
                    <tr className="border-b border-slate-150 dark:border-slate-800">
                      <td className="py-3.5 px-4 font-semibold text-slate-500">
                        Number of Days
                      </td>
                      <td className="py-3.5 px-4">
                        <input
                          type="number"
                          value={fundingDays || ""}
                          onChange={(e) => setFundingDays(parseInt(e.target.value, 10) || 0)}
                          className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500"
                        />
                      </td>
                    </tr>

                    {/* Interest Rate (%) */}
                    <tr>
                      <td className="py-3.5 px-4 font-semibold text-slate-500">
                        Interest Rate (%)
                      </td>
                      <td className="py-3.5 px-4">
                        <input
                          type="number"
                          step="0.01"
                          value={fundingInterestRate || ""}
                          onChange={(e) => setFundingInterestRate(parseFloat(e.target.value) || 0)}
                          className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Action Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setFundingIpoPrice(issuePrice);
                    setFundingNiiQuota(defaultNiiQuota);
                    setStartingOversubscription(1);
                    setIncrementalCollection(100);
                    setFundingDays(7);
                    setFundingInterestRate(12);
                  }}
                  className="bg-[#2463eb] hover:bg-blue-700 text-white text-xs font-bold uppercase py-2.5 px-8 rounded shadow-sm hover:shadow transition-all"
                >
                  Refresh
                </button>
              </div>

              {/* Matrix Table */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-sans">
                    IPO HNI Cost for {fundingDays} days
                  </h3>
                  <button
                    onClick={exportToCSV}
                    className="bg-slate-800 hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold uppercase py-1.5 px-3 rounded shadow-sm hover:shadow transition-all flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    Export to CSV
                  </button>
                </div>

                <div className="w-full overflow-x-auto border border-slate-200 dark:border-slate-800 rounded">
                  <table className="w-full text-sm border-collapse text-left bg-white dark:bg-slate-950 font-sans">
                    <thead>
                      {/* NII IPO Collection Row */}
                      <tr className="border-b border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10">
                        <th className="py-3 px-4 font-semibold text-slate-500 whitespace-nowrap border-r border-slate-200 dark:border-slate-850">
                          NII IPO Collection (₹ Cr)
                        </th>
                        {fundingColumns.map((col, idx) => (
                          <th key={idx} className="py-3 px-4 text-center font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap border-r border-slate-150 dark:border-slate-800 last:border-r-0">
                            {col.collection.toFixed(2)}
                          </th>
                        ))}
                      </tr>
                      {/* NII Oversubscription Row */}
                      <tr className="border-b border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10">
                        <th className="py-3 px-4 font-semibold text-slate-500 whitespace-nowrap border-r border-slate-200 dark:border-slate-850">
                          NII oversubscription (times)
                        </th>
                        {fundingColumns.map((col, idx) => (
                          <th key={idx} className="py-3 px-4 text-center font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap border-r border-slate-150 dark:border-slate-800 last:border-r-0">
                            {col.oversubscription.toFixed(2)}
                          </th>
                        ))}
                      </tr>
                      {/* Section Separator */}
                      <tr className="bg-slate-100/80 dark:bg-slate-900/50 text-slate-600 dark:text-slate-355 font-bold border-b border-slate-200 dark:border-slate-800">
                        <th className="py-2.5 px-4 border-r border-slate-200 dark:border-slate-850 text-xs uppercase tracking-wider">
                          Interest Rate ⬇
                        </th>
                        <th colSpan={10} className="py-2.5 px-4 text-center text-xs uppercase tracking-wider font-extrabold text-slate-700 dark:text-slate-200 bg-blue-50/40 dark:bg-blue-950/20">
                          ⬇ HNI Funding Cost (Rs per share) ⬇
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {allRates.map((rate, rIdx) => {
                        const isCustom = rate === fundingInterestRate;
                        const isYellowHighlight = rate === 8.5;
                        let rowBg = "bg-white dark:bg-slate-950";
                        if (isCustom) {
                          rowBg = "bg-green-50/70 dark:bg-green-950/20 hover:bg-green-100/50 dark:hover:bg-green-900/10";
                        } else if (isYellowHighlight) {
                          rowBg = "bg-yellow-50/70 dark:bg-yellow-950/20 hover:bg-yellow-100/50 dark:hover:bg-yellow-900/10";
                        } else if (rIdx % 2 === 0) {
                          rowBg = "bg-slate-50/20 dark:bg-slate-900/5 hover:bg-slate-50 dark:hover:bg-slate-900/10";
                        } else {
                          rowBg = "hover:bg-slate-50 dark:hover:bg-slate-900/10";
                        }

                        return (
                          <tr key={rate} className={`border-b border-slate-150 dark:border-slate-800 last:border-b-0 ${rowBg} transition-colors`}>
                            <td className={`py-3 px-4 font-bold border-r border-slate-200 dark:border-slate-850 ${isCustom ? 'text-green-600 dark:text-green-400' : isYellowHighlight ? 'text-yellow-600 dark:text-yellow-450' : 'text-slate-700 dark:text-slate-350'}`}>
                              {rate}%
                            </td>
                            {fundingColumns.map((col, cIdx) => {
                              const cost = calculateFundingCost(col.oversubscription, rate);
                              return (
                                <td key={cIdx} className="py-3 px-4 text-center font-semibold text-slate-750 dark:text-slate-300 border-r border-slate-150 dark:border-slate-800 last:border-r-0">
                                  {cost.toFixed(2)}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Formula & Explanation Box */}
              <div className="mt-8 pt-6 border-t border-slate-150 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-3 leading-relaxed font-sans">
                <p className="font-bold text-slate-750 dark:text-slate-300">
                  IPO Funding Cost = IPO Price &times; NII oversubscription &times; (Interest Rate / 100) &times; ({fundingDays} / 365 days)
                </p>
                <p className="font-semibold text-slate-450 italic">where,</p>
                <ul className="list-disc pl-5 space-y-1.5 font-medium">
                  <li>
                    <strong className="text-slate-600 dark:text-slate-350">IPO Price:</strong> The upper price band in case of a Book Built issue (currently set to ₹{fundingIpoPrice.toFixed(2)}).
                  </li>
                  <li>
                    <strong className="text-slate-600 dark:text-slate-350">NII oversubscription:</strong> The number of times the NII category is oversubscribed. The table reflects data starting from {startingOversubscription.toFixed(2)}x oversubscription as a base point.
                  </li>
                  <li>
                    <strong className="text-slate-600 dark:text-slate-350">ROI (Return on Investment):</strong> The annual interest rate at which the funding loan is granted.
                  </li>
                  <li>
                    <strong className="text-slate-600 dark:text-slate-350">{fundingDays}-days:</strong> The loan funding tenure/period.
                  </li>
                </ul>
                <p className="text-[11px] mt-2 pt-2 border-t border-slate-150 dark:border-slate-850">
                  <strong className="text-slate-600 dark:text-slate-350">Note:</strong> The oversubscription columns are dynamically generated using an incremental NII IPO collection step of ₹{incrementalCollection} Cr. You can adjust this value to fit any IPO size.
                </p>
              </div>

            </div>
          </div>
          )}

          {/* Internal Linking Section */}
          <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-10">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 font-sans">
              <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
              </svg>
              Quick Resources & Utilities
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
              <a 
                href="/ipo-eligibility-check"
                className="group p-5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-500/50 dark:hover:border-indigo-400/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-sm md:text-base">
                    IPO Eligibility Checker &rarr;
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed font-medium">
                    Evaluate whether your company is qualified for listing on NSE Emerge, BSE SME, or the Mainboard exchange platforms.
                  </p>
                </div>
              </a>

              <a 
                href="/sme-to-mainboard-migration"
                className="group p-5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-500/50 dark:hover:border-indigo-400/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-sm md:text-base">
                    SME to Mainboard Migration &rarr;
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed font-medium">
                    Check the mandatory requirements, timelines, and legal guidelines to migrate your company from SME to the Mainboard.
                  </p>
                </div>
              </a>

              <a 
                href="/ipo-report-listing-day-gain"
                className="group p-5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-500/50 dark:hover:border-indigo-400/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-sm md:text-base">
                    Listing Day Gain Tracker &rarr;
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed font-medium">
                    Analyze the opening and closing day listing premiums, listing gains, and subscription patterns of historic IPOs.
                  </p>
                </div>
              </a>

              <a 
                href="/all-ipos"
                className="group p-5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-500/50 dark:hover:border-indigo-400/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-sm md:text-base">
                    Live IPO & GMP Calendar &rarr;
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed font-medium">
                    Keep track of open/upcoming IPO timelines, Gray Market Premium (GMP) updates, and live subscription status.
                  </p>
                </div>
              </a>
            </div>
          </div>

        </div>
      </main>
      
    </div>
  );
}
