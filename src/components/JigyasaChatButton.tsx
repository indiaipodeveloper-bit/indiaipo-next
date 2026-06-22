"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X, Sparkles, ArrowRight, Zap, Bot } from "lucide-react";
import Ribbon from "@/components/Ribbon";

const CHAT_URL = "https://indiaipo.ai/";

const JigyasaChatButton = () => {
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pulse, setPulse] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (showModal) setPulse(false);
  }, [showModal]);

  if (pathname?.startsWith("/admin")) return null;
  if (!mounted) return null;

  const handleStartChat = () => {
    window.open(CHAT_URL, "_blank", "noopener,noreferrer");
    setShowModal(false);
  };

  return (
    <>
      <div className="jigyasa-wrapper">
        {showModal && (
          <div className="jigyasa-modal" role="dialog" aria-modal="true" aria-label="Chat with Jigyasa">
            <div className="jigyasa-modal-header">
              <div className="jigyasa-modal-header-left">
                <div className="jigyasa-avatar-sm">
                  <Bot size={18} color="#fff" />
                </div>
                <div>
                  <p className="jigyasa-modal-title">Jigyasa AI</p>
                  <p className="jigyasa-modal-subtitle">
                    <span className="jigyasa-online-dot" />
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="jigyasa-close-btn"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="jigyasa-modal-body">
              <Ribbon
                fontSize="10px"
                cutout="0.4em"
                color="#0f766e"
                className="inline-flex items-center gap-2 font-extrabold uppercase tracking-[0.18em] mb-3 px-3 py-1.5"
                style={{ color: '#ffffff', borderRadius: '6px' }}
              >
                <Sparkles size={11} />
                India's First AI Chatbot for IPO
              </Ribbon>

              <h2 className="jigyasa-modal-heading">
                Chat with <span className="jigyasa-highlight">Jigyasa</span>
              </h2>

              <p className="jigyasa-modal-desc">
                Get instant, AI-powered answers on:
              </p>

              <ul className="jigyasa-feature-list">
                <li><Zap size={13} className="jigyasa-feat-icon" />SME & Mainboard Listings</li>
                <li><Zap size={13} className="jigyasa-feat-icon" /> IPO Readiness & Eligibility</li>
                <li><Zap size={13} className="jigyasa-feat-icon" /> IPO GMP & Subscription Status</li>
                <li><Zap size={13} className="jigyasa-feat-icon" /> Valuation & Funding Guidance</li>
              </ul>

              <button
                id="jigyasa-start-chat-btn"
                onClick={handleStartChat}
                className="jigyasa-cta-btn"
              >
                Start Chat with Jigyasa
                <ArrowRight size={16} />
              </button>

              <p className="jigyasa-disclaimer">
                Powered by <strong>India IPO</strong>
              </p>
            </div>
          </div>
        )}

        <button
          id="jigyasa-chat-fab"
          onClick={() => setShowModal((v) => !v)}
          className={`jigyasa-fab ${pulse ? "jigyasa-fab--pulse" : ""}`}
          aria-label="Chat with Jigyasa AI"
          title="Chat with Jigyasa – India's First IPO AI Chatbot"
        >
          {/* Glow rings */}
          <span className="jigyasa-ring jigyasa-ring--1" />
          <span className="jigyasa-ring jigyasa-ring--2" />

          {/* Icon */}
          <div className="jigyasa-fab-inner">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Brain outline */}
              <path d="M16 4C13.5 4 11.5 5.5 10.5 7.5C9.2 7.2 7.5 7.8 6.5 9C5.5 10.2 5.3 11.8 5.8 13.2C4.7 14 4 15.2 4 16.5C4 18.2 5 19.7 6.5 20.5C6.3 21.2 6.4 22 6.8 22.7C7.5 24 9 24.7 10.4 24.4C11 25.5 12.2 26.3 13.5 26.5V28H18.5V26.5C19.8 26.3 21 25.5 21.6 24.4C23 24.7 24.5 24 25.2 22.7C25.6 22 25.7 21.2 25.5 20.5C27 19.7 28 18.2 28 16.5C28 15.2 27.3 14 26.2 13.2C26.7 11.8 26.5 10.2 25.5 9C24.5 7.8 22.8 7.2 21.5 7.5C20.5 5.5 18.5 4 16 4Z" fill="white" fillOpacity="0.92" />
              {/* Circuit dots */}
              <circle cx="12" cy="13" r="1.5" fill="#0f766e" />
              <circle cx="16" cy="11" r="1.5" fill="#0f766e" />
              <circle cx="20" cy="13" r="1.5" fill="#0f766e" />
              <circle cx="12" cy="18" r="1.5" fill="#0f766e" />
              <circle cx="20" cy="18" r="1.5" fill="#0f766e" />
              {/* Circuit lines */}
              <line x1="12" y1="13" x2="16" y2="11" stroke="#0f766e" strokeWidth="1" strokeOpacity="0.7" />
              <line x1="16" y1="11" x2="20" y2="13" stroke="#0f766e" strokeWidth="1" strokeOpacity="0.7" />
              <line x1="12" y1="13" x2="12" y2="18" stroke="#0f766e" strokeWidth="1" strokeOpacity="0.7" />
              <line x1="20" y1="13" x2="20" y2="18" stroke="#0f766e" strokeWidth="1" strokeOpacity="0.7" />
              <line x1="12" y1="18" x2="20" y2="18" stroke="#0f766e" strokeWidth="1" strokeOpacity="0.7" />
              {/* Center node */}
              <circle cx="16" cy="15.5" r="2" fill="#059669" />
            </svg>
          </div>

          {/* Label chip */}
          <span className="jigyasa-label-chip">AI</span>
        </button>
      </div>

      {/* Scoped styles */}
      <style>{`
        /* ── Wrapper ── */
        .jigyasa-wrapper {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
        }

        /* ── Modal card ── */
        .jigyasa-modal {
          width: 300px;
          background: #ffffff;
          border-radius: 20px;
          box-shadow:
            0 24px 60px rgba(7,16,40,0.32),
            0 4px 16px rgba(0,0,0,0.14);
          overflow: hidden;
          animation: jigyasa-slide-up 0.32s cubic-bezier(0.34,1.56,0.64,1);
          border: 1px solid rgba(11,23,54,0.15);
        }

        .jigyasa-modal-header {
          background: linear-gradient(135deg, #0f766e 0%, #059669 60%, #047857 100%);
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .jigyasa-modal-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .jigyasa-avatar-sm {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(255,255,255,0.5);
        }
        .jigyasa-modal-title {
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          margin: 0;
          line-height: 1.2;
        }
        .jigyasa-modal-subtitle {
          font-size: 11px;
          color: rgba(255,255,255,0.85);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .jigyasa-online-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4ade80;
          display: inline-block;
          animation: jigyasa-blink 1.4s ease-in-out infinite;
        }
        .jigyasa-close-btn {
          background: rgba(255,255,255,0.15);
          border: none;
          color: #fff;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .jigyasa-close-btn:hover {
          background: rgba(255,255,255,0.3);
        }

        .jigyasa-modal-body {
          padding: 18px 18px 16px;
        }

        .jigyasa-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: linear-gradient(135deg, #ede9fe, #f5f3ff);
          color: #6337e2;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.04em;
          padding: 4px 10px;
          border-radius: 20px;
          border: 1px solid #ddd6fe;
          margin-bottom: 12px;
          text-transform: uppercase;
        }

        .jigyasa-modal-heading {
          font-size: 20px;
          font-weight: 800;
          color: #0B1736;
          margin: 0 0 6px;
          line-height: 1.25;
        }
        .jigyasa-highlight {
          background: linear-gradient(135deg, #0f766e, #059669);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .jigyasa-modal-desc {
          font-size: 13px;
          color: #64748b;
          margin: 0 0 10px;
        }

        .jigyasa-feature-list {
          list-style: none;
          padding: 0;
          margin: 0 0 16px;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .jigyasa-feature-list li {
          font-size: 12.5px;
          color: #134e4a;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f0fdf4;
          border-radius: 8px;
          padding: 6px 10px;
          border: 1px solid #bbf7d0;
        }
        .jigyasa-feat-icon {
          color: #059669;
          flex-shrink: 0;
        }

        .jigyasa-cta-btn {
          width: 100%;
          background: linear-gradient(135deg, #0f766e 0%, #059669 60%, #047857 100%);
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.25s ease;
          box-shadow: 0 4px 14px rgba(15,118,110,0.4);
          letter-spacing: 0.01em;
        }
        .jigyasa-cta-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(15,118,110,0.55);
        }
        .jigyasa-cta-btn:active {
          transform: translateY(0);
        }

        .jigyasa-disclaimer {
          font-size: 10.5px;
          color: #94a3b8;
          text-align: center;
          margin: 10px 0 0;
        }

        /* ── FAB ── */
        .jigyasa-fab {
          position: relative;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0f766e 0%, #059669 60%, #047857 100%);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 4px 20px rgba(15,118,110,0.55),
            0 2px 6px rgba(0,0,0,0.2);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          overflow: visible;
        }
        .jigyasa-fab:hover {
          transform: scale(1.1);
          box-shadow: 0 8px 28px rgba(15,118,110,0.7);
        }
        .jigyasa-fab:active {
          transform: scale(0.97);
        }

        .jigyasa-fab-inner {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Glow rings */
        .jigyasa-ring {
          position: absolute;
          border-radius: 50%;
          border: 2px solid rgba(15,118,110,0.45);
          pointer-events: none;
        }
        .jigyasa-ring--1 {
          width: 70px;
          height: 70px;
          animation: jigyasa-ring-expand 2s ease-out infinite;
        }
        .jigyasa-ring--2 {
          width: 86px;
          height: 86px;
          animation: jigyasa-ring-expand 2s ease-out infinite 0.6s;
        }

        /* AI label chip */
        .jigyasa-label-chip {
          position: absolute;
          top: -4px;
          right: -4px;
          background: linear-gradient(135deg, #f59e0b, #ef4444);
          color: #fff;
          font-size: 9px;
          font-weight: 800;
          border-radius: 8px;
          padding: 2px 5px;
          letter-spacing: 0.06em;
          border: 2px solid #fff;
          z-index: 3;
          line-height: 1.2;
          box-shadow: 0 2px 6px rgba(239,68,68,0.4);
        }

        /* Pulse for first attention */
        .jigyasa-fab--pulse {
          animation: jigyasa-attention 3s ease-in-out infinite 3s;
        }

        /* ── Keyframes ── */
        @keyframes jigyasa-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes jigyasa-slide-up {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes jigyasa-ring-expand {
          0% { transform: scale(0.85); opacity: 0.7; }
          70% { transform: scale(1.35); opacity: 0; }
          100% { transform: scale(1.35); opacity: 0; }
        }
        @keyframes jigyasa-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes jigyasa-attention {
          0%, 100% { transform: scale(1); }
          10% { transform: scale(1.12); }
          20% { transform: scale(1); }
          30% { transform: scale(1.08); }
          40% { transform: scale(1); }
        }

        /* Mobile adjustments */
        @media (max-width: 640px) {
          .jigyasa-modal {
            width: 280px;
          }
          .jigyasa-fab {
            width: 50px;
            height: 50px;
          }
        }
      `}</style>
    </>
  );
};

export default JigyasaChatButton;
