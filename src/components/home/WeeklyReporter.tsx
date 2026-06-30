"use client";

import React, { useState } from "react";
import {
    Mail,
    CheckCircle2,
    ArrowRight,
    Newspaper,
    Bell,
    ShieldCheck,
    Clock,
} from "lucide-react";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import { toast } from "sonner";
import weeklyReporterImg from "@/assets/weekly-reporter-image.webp";
import Ribbon from "@/components/Ribbon";
import { API_URL } from "@/lib/constants";

const validateEmail = (email: string) => {
    const trimmed = email.trim();
    if (!trimmed) return "Please enter your email address";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) return "Please enter a valid email address";
    return null;
};

const WeeklyReporter = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "duplicate">("idle");
    const { getToken, loadRecaptcha } = useRecaptcha({ lazy: true });

    const weeklyReporterImgSrc = typeof weeklyReporterImg === "string" ? weeklyReporterImg : weeklyReporterImg.src;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const errorMsg = validateEmail(email);
        if (errorMsg) {
            toast.error(errorMsg);
            return;
        }

        setStatus("loading");

        try {
            const recaptchaToken = await getToken("newsletter_subscribe");
            const res = await fetch(`${API_URL}/api/subscriptions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim(), recaptchaToken }),
            });

            if (res.ok) {
                setStatus("success");
                setEmail("");
                toast.success("🎉 Subscribed! See you every Sunday.");
            } else {
                const err = await res.json();
                const msg: string = err?.error || "";
                if (
                    msg.toLowerCase().includes("already subscribed") ||
                    msg.toLowerCase().includes("duplicate") ||
                    res.status === 400
                ) {
                    setStatus("duplicate");
                } else {
                    toast.error(msg || "Something went wrong. Please try again.");
                    setStatus("idle");
                }
            }
        } catch {
            toast.error("Network error. Please try again.");
            setStatus("idle");
        }
    };

    return (
        <section style={{ background: "linear-gradient(to bottom right,#071028,#0B1736, #111827)" }} className="wr-section">
            <div className="wr-container">

                {/* ── LEFT: Image ── */}
                <div className="wr-img-col">
                    <img
                        src={weeklyReporterImgSrc}
                        alt="India IPO Weekly Reporter Newsletter"
                        className="wr-img"
                        loading="lazy"
                    />
                </div>

                {/* ── RIGHT: Content ── */}
                <div className="wr-content-col">

                    <Ribbon
                        fontSize="11px"
                        cutout="0.4em"
                        color="rgba(251, 191, 36, 0.15)"
                        className="inline-flex items-center gap-2 text-amber-300 font-extrabold uppercase tracking-[0.2em] border border-amber-400/20 mb-5 px-3 py-1.5"
                    >
                        Every Sunday — Free of Cost
                    </Ribbon>

                    <h2 className="wr-heading">
                        Get India's <span className="text-[#F99810]">Weekly IPO Report</span> Delivered to Your Inbox
                    </h2>

                    <p className="wr-desc">
                        Every <strong>Sunday</strong>, receive a comprehensive summary of the Indian IPO market covering IPO listings, new launches, DRHP filings, SEBI approvals, subscription trends, listing performance and key market insights - all in one report.
                    </p>

                    {/* Feature list */}
                    <ul className="wr-list">
                        {[
                            { icon: Newspaper, label: "Complete Weekly IPO Market Summary" },
                            { icon: Bell, label: " IPO Listings, Launches, DRHPs & Approvals" },
                            { icon: ShieldCheck, label: " Subscription & Listing Gain Analysis" },
                            { icon: Clock, label: "India IPO View & Market Outlook" },
                        ].map(({ icon: Icon, label }, i) => (
                            <li key={i} className="wr-list-item">
                                <Icon className="wr-list-icon" />
                                <span>{label}</span>
                            </li>
                        ))}
                    </ul>

                    {/* ── Form / States ── */}
                    {status === "success" ? (
                        <div className="wr-state-box wr-state-success">
                            <CheckCircle2 className="wr-state-icon" />
                            <div>
                                <p className="wr-state-title">You're subscribed! 🎉</p>
                                <p className="wr-state-sub">Check your inbox — your first Weekly Reporter arrives this Sunday.</p>
                            </div>
                        </div>
                    ) : status === "duplicate" ? (
                        <div className="wr-state-box wr-state-duplicate">
                            <CheckCircle2 className="wr-state-icon" />
                            <div>
                                <p className="wr-state-title">Already Subscribed!</p>
                                <p className="wr-state-sub">You're already part of the India IPO Weekly Reporter family. See you this Sunday!</p>
                            </div>
                        </div>
                    ) : (
                        <form
                            id="weekly-reporter-form"
                            onSubmit={handleSubmit}
                            onMouseEnter={loadRecaptcha}
                            onTouchStart={loadRecaptcha}
                            className="wr-form"
                        >
                            <div className="wr-field-row">
                                <div className="wr-input-wrap">
                                    <Mail className="wr-input-icon" />
                                    <input
                                        id="weekly-reporter-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onFocus={loadRecaptcha}
                                        placeholder="Enter your email address"
                                        className="wr-input"
                                        disabled={status === "loading"}
                                        autoComplete="email"
                                    />
                                </div>
                                <button
                                    id="weekly-reporter-submit"
                                    type="submit"
                                    disabled={status === "loading"}
                                    className="wr-btn cursor-pointer bg-[#f99810]"
                                >
                                    {status === "loading" ? (
                                        <span className="wr-spinner" />
                                    ) : (
                                        <>Subscribe Free <ArrowRight className="wr-btn-arrow" /></>
                                    )}
                                </button>
                            </div>
                            <p className="wr-privacy">🔒 We respect your privacy. No spam, ever.</p>
                        </form>
                    )}


                </div>
            </div>

            <style>{`
                .wr-section {
                    padding: 72px 0;
                    position: relative;
                    overflow: hidden;
                }

                .wr-container {
                    max-width: 1160px;
                    margin: 0 auto;
                    padding: 0 32px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 72px;
                    align-items: center;
                }

                /* IMAGE */
                .wr-img-col {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .wr-img {
                    width: 100%;
                    max-width: 500px;
                    height: auto;
                    aspect-ratio: 4 / 3;
                    object-fit: cover;
                    border-radius: 20px;
                    display: block;
                    box-shadow: 0 24px 72px rgba(0, 0, 0, 0.45);
                }

                /* CONTENT */
                .wr-content-col {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 0;
                }

                .wr-eyebrow {
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    color: rgba(255,255,255,0.6);
                    margin: 0 0 12px;
                }

                .wr-heading {
                    font-size: clamp(24px, 2.8vw, 36px);
                    font-weight: 900;
                    line-height: 1.18;
                    color: #ffffff;
                    margin: 0 0 16px;
                    letter-spacing: -0.02em;
                }
                .wr-heading-accent {
                    color: #fbbf24;
                }

                .wr-desc {
                    font-size: 15px;
                    color: rgba(255,255,255,0.78);
                    line-height: 1.75;
                    margin: 0 0 24px;
                }
                .wr-desc strong {
                    color: #fff;
                    font-weight: 700;
                }

                /* Feature list */
                .wr-list {
                    list-style: none;
                    padding: 0;
                    margin: 0 0 28px;
                    display: flex;
                    flex-direction: column;
                    gap: 11px;
                }
                .wr-list-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 14px;
                    color: rgba(255,255,255,0.85);
                    font-weight: 500;
                }
                .wr-list-icon {
                    width: 17px;
                    height: 17px;
                    color: #fbbf24;
                    flex-shrink: 0;
                }

                /* FORM */
                .wr-form {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .wr-field-row {
                    display: flex;
                    gap: 10px;
                    align-items: stretch;
                }
                .wr-input-wrap {
                    flex: 1;
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .wr-input-icon {
                    position: absolute;
                    left: 14px;
                    width: 17px;
                    height: 17px;
                    color: rgba(255,255,255,0.45);
                    pointer-events: none;
                    flex-shrink: 0;
                }
                .wr-input {
                    width: 100%;
                    height: 50px;
                    padding: 0 14px 0 44px;
                    background: rgba(255,255,255,0.1);
                    border: 1.5px solid rgba(255,255,255,0.2);
                    border-radius: 12px;
                    font-size: 14px;
                    color: #fff;
                    outline: none;
                    transition: border-color 0.2s, background 0.2s;
                    box-sizing: border-box;
                }
                .wr-input::placeholder { color: rgba(255,255,255,0.4); }
                .wr-input:focus {
                    border-color: #fbbf24;
                    background: rgba(255,255,255,0.14);
                }
                .wr-input:disabled { opacity: 0.5; cursor: not-allowed; }

                .wr-btn {
                    height: 50px;
                    padding: 0 24px;
                    background: #fbbf24;
                    color: #002a52;
                    font-size: 14px;
                    font-weight: 800;
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    white-space: nowrap;
                    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
                    box-shadow: 0 6px 20px rgba(251, 191, 36, 0.35);
                    flex-shrink: 0;
                }
                .wr-btn:hover:not(:disabled) {
                    background: #f59e0b;
                    transform: translateY(-2px);
                    box-shadow: 0 10px 28px rgba(251,191,36,0.45);
                }
                .wr-btn:disabled { opacity: 0.6; cursor: not-allowed; }
                .wr-btn-arrow { width: 16px; height: 16px; }

                .wr-spinner {
                    width: 18px;
                    height: 18px;
                    border: 2.5px solid rgba(0,42,82,0.3);
                    border-top-color: #002a52;
                    border-radius: 50%;
                    animation: wr-spin 0.7s linear infinite;
                }
                @keyframes wr-spin { to { transform: rotate(360deg); } }

                .wr-privacy {
                    font-size: 11.5px;
                    color: rgba(255,255,255,0.45);
                    margin: 0;
                }

                /* States */
                .wr-state-box {
                    display: flex;
                    align-items: flex-start;
                    gap: 14px;
                    padding: 18px 22px;
                    border-radius: 14px;
                    margin-bottom: 4px;
                    width: 100%;
                    box-sizing: border-box;
                }
                .wr-state-success {
                    background: rgba(34,197,94,0.15);
                    border: 1.5px solid rgba(34,197,94,0.4);
                }
                .wr-state-duplicate {
                    background: rgba(251,191,36,0.12);
                    border: 1.5px solid rgba(251,191,36,0.35);
                }
                .wr-state-icon { width: 26px; height: 26px; color: #4ade80; flex-shrink: 0; margin-top: 1px; }
                .wr-state-duplicate .wr-state-icon { color: #fbbf24; }
                .wr-state-title {
                    font-size: 15px;
                    font-weight: 800;
                    color: #fff;
                    margin: 0 0 4px;
                }
                .wr-state-sub {
                    font-size: 13px;
                    color: rgba(255,255,255,0.72);
                    margin: 0;
                    line-height: 1.5;
                }

                /* Trust */
                .wr-trust {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-top: 18px;
                    font-size: 12.5px;
                    color: rgba(255,255,255,0.5);
                    font-weight: 500;
                }
                .wr-trust-dot {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: #4ade80;
                    box-shadow: 0 0 8px #4ade80;
                    flex-shrink: 0;
                }

                /* ── Responsive ── */
                @media (max-width: 860px) {
                    .wr-container {
                        grid-template-columns: 1fr;
                        gap: 40px;
                        text-align: left;
                    }
                    .wr-img-col {
                        order: -1;
                    }
                    .wr-img {
                        max-width: 100%;
                        aspect-ratio: 16/9;
                    }
                    .wr-field-row {
                        flex-direction: column;
                    }
                    .wr-btn {
                        width: 100%;
                        justify-content: center;
                        height: 52px;
                    }
                    .wr-input { height: 52px; }
                }

                @media (max-width: 480px) {
                    .wr-section { padding: 56px 0; }
                    .wr-container { padding: 0 20px; gap: 32px; }
                    .wr-heading { font-size: 22px; }
                }
            `}</style>
        </section>
    );
};

export default React.memo(WeeklyReporter);
