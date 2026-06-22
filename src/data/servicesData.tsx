import React from "react";
import {
  Building2,
  TrendingUp,
  BarChart3,
  Wallet,
  FileText,
  Briefcase,
  LineChart,
  PieChart,
  ShieldCheck,
  Scale,
  Globe,
  LayoutDashboard,
  Target,
  Landmark,
  Coins,
  HandCoins,
  Banknote,
  AreaChart,
} from "lucide-react";

export type ServiceData = {
  id: string;
  slug: string;
  category: "IPO" | "CAPITAL RAISING" | "FINANCE ADVISORY";
  title: string;
  icon: React.ReactNode;
  shortDescription: string;
  fullDescription: string;
  overviewParagraph2?: string;
  faqs?: { q: string; a: string }[];
  keyBenefits: string[];
  processSteps: { title: string; desc: string }[];
};

export const servicesData: ServiceData[] = [
  {
    id: "sme-ipo-consultant",
    slug: "sme-ipo-consultant",
    category: "IPO",
    title: "SME IPO Consultation",
    icon: <Building2 className="h-10 w-10" />,
    shortDescription:
      "End-to-end advisory for Small and Medium Enterprise IPOs on BSE SME and NSE Emerge platforms.",
    fullDescription:
      "Our SME IPO Consultation service empowers high-growth small and medium enterprises to tap into the public markets. We provide comprehensive guidance through the complex regulatory landscape of BSE SME and NSE Emerge, ensuring your business is valuation-ready, compliant and positioned for a successful listing that unlocks vital growth capital. ",
    overviewParagraph2:
      "SME IPOs require a different approach compared to mainboard listings, with tighter eligibility norms, focused investor targeting and streamlined compliance processes. Our team works closely with you to structure the issue, align financial reporting and prepare for exchange-specific requirements, ensuring your business is fully ready for a confident and well-positioned market debut",
    faqs: [
      {
        q: "How do I know if an SME IPO is right for my company?",
        a: "We assess your financial performance, eligibility criteria and growth plans to determine whether an SME IPO on BSE SME or NSE Emerge is the right fit and whether you are ready for listing.",
      },
      {
        q: "How long does the SME IPO process typically take?",
        a: "The SME IPO timeline usually ranges from 3 to 6 months, depending on your company’s preparedness, documentation and regulatory approvals at each stage of the process.",
      },
      {
        q: "Are your SME IPO advisors experienced?",
        a: "Yes, our advisors have extensive experience in managing SME IPOs, working closely with merchant bankers, legal teams and exchanges to ensure smooth execution and compliance.",
      },
      {
        q: "What are your fee structures?",
        a: "Our fees are structured based on the scope and size of the SME IPO. For capital-raising services, we typically follow a success-fee model linked to the funds raised. For advisory services like valuation and modelling, we charge a fixed professional fee, discussed transparently upfront.",
      },
      {
        q: "Can you assist SME companies from non-metro cities?",
        a: "Absolutely. We have executed SME IPO mandates for companies across Tier 1, Tier 2 and Tier 3 cities in India. Location is not a limitation; we combine on-ground support with secure digital processes.",
      },
    ],
    keyBenefits: [
      "Access to alternative, low-cost capital for expansion",
      "Enhanced brand visibility and corporate governance",
      "Liquidity for early-stage investors and promoters",
      "Lower compliance burden compared to Mainboard listings",
    ],
    processSteps: [
      {
        title: "Eligibility Assessment",
        desc: "Evaluating financial track record against stock exchange criteria.",
      },
      {
        title: "Restructuring & Preparation",
        desc: "Aligning corporate structure and financials for listing.",
      },
      {
        title: "DRHP Drafting",
        desc: "Preparing the Draft Red Herring Prospectus with legal teams.",
      },
      {
        title: "Exchange Approval",
        desc: "Filing and obtaining necessary in-principle approvals.",
      },
      {
        title: "Marketing & Issue",
        desc: "Conducting roadshows and opening the issue to the public.",
      },
      {
        title: "Listing Ceremony",
        desc: "Ringing the bell and managing post-listing compliance.",
      },
    ],
  },
  {
    id: "mainline-ipo-consultant",
    slug: "mainline-ipo-consultant",
    category: "IPO",
    title: "Mainline IPO Consultation",
    icon: <TrendingUp className="h-10 w-10" />,
    shortDescription:
      "Structured IPO advisory for mainboard IPOs, helping companies prepare, structure and execute listings with full regulatory compliance and strong institutional participation.",
    fullDescription:
      "A Mainboard IPO is a significant milestone. We offer specialised advisory services for large companies aiming to list on the primary boards of BSE and NSE, managing the process from preparation to execution. Our team handles the full process, structuring the issue, preparing documentation and determining optimal pricing to attract institutional and retail investors.",
    overviewParagraph2:
      "Mainboard IPOs involve higher regulatory scrutiny, detailed disclosures and strong institutional participation. We work closely with your leadership team to align governance standards, strengthen financial reporting and position the business effectively for both institutional and retail investors, ensuring a well-prepared and confidently executed market entry.",
    faqs: [
      {
        q: "How do I know if a Mainboard IPO is right for my company?",
        a: "We assess your company’s scale, profitability, governance standards and growth outlook to determine Mainboard IPO eligibility and readiness, along with the right preparation roadmap.",
      },
      {
        q: "What are the key eligibility criteria for a Mainboard IPO?",
        a: "Eligibility depends on financial track record, net worth, profitability and compliance standards as defined by SEBI. We help evaluate your position and identify any gaps before initiating the IPO process.",
      },
      {
        q: "How long does a Mainboard IPO typically take?",
        a: "Mainboard IPOs generally take 9–18 months, depending on readiness, audits and regulatory approvals. This includes preparation, DRHP filing, SEBI review and listing.",
      },
      {
        q: "What role do institutional investors play in a Mainboard IPO?",
        a: "Institutional investors (QIBs) are critical for price discovery and subscription momentum. We assist in positioning your company effectively and coordinating investor roadshows to drive strong participation.",
      },
      {
        q: "What are your fee structures?",
        a: "Our fees depend on the scope and size of the engagement. For IPO transactions, we typically use a success-linked model tied to funds raised, while advisory services are charged as a fixed professional fee.",
      },
    ],
    keyBenefits: [
      "Large-scale capital raising to support growth and expansion ",
      "Enhanced brand visibility across national and global markets",
      "Access to top-tier institutional investors (QIBs)",
      "Improved liquidity for existing shareholders",
    ],
    processSteps: [
      {
        title: "Strategic Planning",
        desc: "Determining issue size, pricing strategy, and timing.",
      },
      {
        title: "Due Diligence",
        desc: "Rigorous legal, financial, and operational audits.",
      },
      {
        title: "SEBI Filing",
        desc: "Drafting and filing the DRHP with the Securities and Exchange Board of India.",
      },
      {
        title: "Pre-Issue Marketing",
        desc: "Engaging anchor investors and QIBs through global roadshows.",
      },
      {
        title: "Book Building",
        desc: "Discovering optimal price through the bidding process.",
      },
      {
        title: "Allotment & Listing",
        desc: "Finalizing shares and debut trading on the main exchanges.",
      },
    ],
  },
  {
    id: "ipo-services",
    slug: "ipo-services",
    category: "IPO",
    title: "Initial Public Offering (IPO)",
    icon: <Globe className="h-10 w-10" />,
    shortDescription:
      "Comprehensive IPO advisory services designed to help your company plan, structure and execute a successful public listing.",
    fullDescription:
      "Our holistic Initial Public Offering service is built for companies exploring the capital markets but unsure of the right path. We review your financials, industry and growth plans to recommend whether an SME or Mainboard IPO fits best, while outlining a strategic roadmap from private to public ownership.",
    overviewParagraph2:
      "Our advisory is designed to take the guesswork out of your listing journey. We conduct rigorous Eligibility checks, coordinate with all intermediaries, and build a compelling equity story to maximize your valuation.",
    faqs: [
      {
        q: "How do I know if my company is ready for an IPO?",
        a: "We conduct a thorough pre-IPO readiness assessment that evaluates your financial track record, corporate governance, market positioning, and compliance history to determine your readiness.",
      },
      {
        q: "What is the difference between an SME IPO and a Mainboard IPO?",
        a: "SME IPOs have lower capital and profitability thresholds, are easier to execute, and cater to smaller businesses. Mainboard IPOs are for larger corporations with higher capital requirements and stricter compliance norms.",
      },
      {
        q: "Who are the key intermediaries in an IPO?",
        a: "An IPO requires coordination between Lead Managers (Merchant Bankers), Legal Advisors, Registrars, Statutory Auditors, and Underwriters. We manage all these stakeholders for you.",
      },
    ],
    keyBenefits: [
      "Unbiased assessment of IPO readiness",
      "Customised strategy based on your company size and goals",
      "Expert guidance on valuation and pricing",
      "Smooth transition from private to public company",
    ],
    processSteps: [
      {
        title: "Initial Consultation",
        desc: "Understanding company goals and financial health.",
      },
      {
        title: "Eligibility Report",
        desc: "Analyzing market readiness and regulatory compliance.",
      },
      {
        title: "Platform Selection",
        desc: "Choosing between SME or Mainboard exchanges.",
      },
      {
        title: "Intermediary Appointment",
        desc: "Selecting lead managers, legal counsel, and registrars.",
      },
      {
        title: "Execution Plan",
        desc: "Setting a timeline for drafting, filing, and listing.",
      },
    ],
  },
  {
    id: "fpo",
    slug: "fpo",
    category: "IPO",
    title: "Follow-On Public Offer (FPO)",
    icon: <BarChart3 className="h-10 w-10" />,
    shortDescription:
      "End-to-end advisory for listed companies raising additional capital through FPOs, ensuring efficient execution, regulatory compliance and strong investor participation",
    fullDescription:
      "For companies already listed on the stock exchange, a Follow-On Public Offer (FPO) is an effective route to raise additional equity capital. Whether it is a dilutive FPO to fund expansion or an offer for sale by existing shareholders, we provide regulatory guidance and market positioning strategies to ensure a well-subscribed issue.",
    overviewParagraph2:
      "FPOs require careful timing, pricing alignment with market conditions and strong investor communication. We work closely with management and intermediaries to structure the offering, manage disclosures and execute the issue efficiently, ensuring optimal participation and market confidence.",
    faqs: [
      {
        q: "How long does an FPO process typically take?",
        a: "FPO timelines are typically shorter than IPOs, ranging from 2 to 4 months depending on documentation, approvals and market readiness.",
      },
      {
        q: "What is the difference between a dilutive and non-dilutive FPO?",
        a: "A dilutive FPO involves issuing new shares to raise fresh capital, while a non-dilutive FPO allows existing shareholders to sell their stake. We help structure the offering to align with your objectives.",
      },
      {
        q: "How is pricing determined in an FPO?",
        a: "FPO pricing is influenced by market conditions, current share price, investor demand and company performance. We guide pricing strategy to balance investor interest and value optimisation.",
      },
      {
        q: "What are the regulatory requirements for an FPO?",
        a: "FPOs must comply with SEBI regulations, including updated disclosures, eligibility norms and exchange approvals. We guide you through documentation, filings and compliance to ensure a smooth and timely process.",
      },
      {
        q: "How do you ensure strong investor participation in an FPO?",
        a: "We focus on optimal timing, pricing strategy and clear investor communication. Through targeted outreach and positioning, we help build confidence among institutional and retail investors to secure successful subscriptions.",
      },
    ],
    keyBenefits: [
      "Raise additional capital without debt",
      "Improve stock liquidity and free float",
      "Fund large-scale diversification or acquisitions",
      "Reduce promoter debt effectively",
    ],
    processSteps: [
      {
        title: "Capital Assessment",
        desc: "Evaluating the exact capital requirement and purpose.",
      },
      {
        title: "Board Approval",
        desc: "Securing necessary board and shareholder resolutions.",
      },
      {
        title: "Pricing Strategy",
        desc: "Determining the floor price or price band relative to current market price.",
      },
      {
        title: "Regulatory Filing",
        desc: "Filing the prospectus with SEBI and exchanges.",
      },
      {
        title: "Marketing & Issue",
        desc: "Re-engaging investors and opening the issue.",
      },
    ],
  },
  {
    id: "pre-ipo-consultant",
    slug: "pre-ipo-consultant",
    category: "IPO",
    title: "Pre-IPO Funding Service",
    icon: <Wallet className="h-10 w-10" />,
    shortDescription:
      "Expert-led pre-IPO fundraising support focused on investor access, deal structuring and optimal valuation to make companies IPO ready.",
    fullDescription:
      "Pre-IPO funding bridges the gap between private equity and public markets. We connect late-stage private companies with targeted High Net Worth Individuals (HNIs) and institutional investors. This not only provides immediate growth capital but acts as a strong valuation benchmark, setting a positive tone for the upcoming actual IPO.",
    overviewParagraph2:
      "Pre-IPO rounds require careful investor selection, deal structuring and valuation alignment. We work closely with founders to position the business, negotiate terms and bring in strategic investors, ensuring the company is well-prepared for a successful IPO transition",
    faqs: [
      {
        q: "How do I know if Pre-IPO funding is right for my company?",
        a: "We assess your growth stage, capital requirements and IPO timeline to determine if Pre-IPO funding is suitable, along with the right investor mix and deal structure.",
      },
      {
        q: "How long does the Pre-IPO fundraising process typically take?",
        a: "Pre-IPO funding rounds usually take 2 to 4 months, depending on investor interest, due diligence and deal structuring. We define clear timelines and milestones at the start of the engagement.",
      },
      {
        q: "What kind of investors participate in Pre-IPO rounds?",
        a: "Pre-IPO rounds typically involve institutional investors, HNIs, family offices and strategic investors. We connect you with the right investors aligned with your growth and listing plans.",
      },
      {
        q: "How is valuation determined in Pre-IPO funding?",
        a: "Valuation is based on financial performance, growth potential, market comparables and investor demand. We help position your company to achieve a balanced and realistic valuation.",
      },
      {
        q: "How much capital can be raised through Pre-IPO funding?",
        a: "The amount depends on your company’s size, valuation and investor appetite. We help structure the raise to balance dilution, capital needs and future IPO positioning.",
      },
      {
        q: "How do you ensure the right investor fit for our company?",
        a: "We focus on aligning investor expectations with your long-term strategy and on selecting partners who add value beyond capital and support your IPO journey.",
      },
    ],
    keyBenefits: [
      "Immediate capital injection before the formal IPO",
      "Establishes a solid baseline valuation",
      "Onboards strategic investors who add long-term value",
      "Builds market confidence ahead of public listing",
    ],
    processSteps: [
      {
        title: "Company Profiling",
        desc: "Creating compelling investment memorandums and pitch decks.",
      },
      {
        title: "Investor Targeting",
        desc: "Identifying synergy-driven HNIs and institutional funds.",
      },
      {
        title: "Valuation Discovery",
        desc: "Negotiating fair pre-listing valuations.",
      },
      {
        title: "Term Sheet Finalization",
        desc: "Drafting and signing investment agreements.",
      },
      {
        title: "Due Diligence Support",
        desc: "Facilitating investor audits and legal checks.",
      },
    ],
  },

  {
    id: "social-stock-exchange",
    slug: "social-stock-exchange",
    category: "CAPITAL RAISING",
    title:
      "Social Stock Exchange Guide for Social Enterprises/Not for Profit Organisations (NPO)",
    icon: <HandCoins className="h-10 w-10" />,
    shortDescription:
      "Advisory for Non-Profit Organizations (NPOs) and Social Enterprises to raise funds via the Social Stock Exchange.",
    fullDescription:
      "The Social Stock Exchange (SSE) is a revolutionary platform allowing Social Enterprises and NPOs to raise capital. We guide organizations through the distinct eligibility criteria, help structure Zero Coupon Zero Principal (ZCZP) instruments, and ensure compliance with social impact reporting standards.",
    keyBenefits: [
      "Access to a dedicated pool of philanthropic capital",
      "Enhanced transparency and trust among donors",
      "Standardized impact measurement and reporting",
      "Zero debt burden for NPOs via ZCZP bonds",
    ],
    processSteps: [
      {
        title: "Social Impact Audit",
        desc: "Evaluating current social initiatives and outcomes.",
      },
      {
        title: "Registration",
        desc: "Registering the entity on the SSE platform.",
      },
      {
        title: "Instrument Structuring",
        desc: "Designing ZCZP bonds or equity structures for for-profit social enterprises.",
      },
      {
        title: "Filing Offer Document",
        desc: "Submitting the necessary paperwork to the exchange.",
      },
      {
        title: "Fundraising",
        desc: "Engaging impact investors and philanthropic institutions.",
      },
    ],
  },
  {
    id: "private-placement-services",
    slug: "private-placement-services",
    category: "CAPITAL RAISING",
    title:
      "Private Placement Service: Strategic Capital Raising with India IPO",
    icon: <Briefcase className="h-10 w-10" />,
    shortDescription:
      "Raise capital efficiently through private placements with targeted investors, optimised structuring and strategic execution.",
    fullDescription:
      "Private Placement is a rapid and cost-effective method of raising capital without the stringent regulatory requirements of a public issue. We assist in structuring the offering, drafting the Private Placement Offer Letter (PAS-4), and identifying strategic investors to subscribe to equity or debt securities.",
    keyBenefits: [
      "Faster turnaround time compared to public issues",
      "Lower regulatory and compliance costs",
      "Flexibility in structuring terms and pricing",
      "Maintains confidentiality of business operations",
    ],
    processSteps: [
      {
        title: "Structuring the Offer",
        desc: "Deciding between equity, preference shares, or debentures.",
      },
      {
        title: "Board & Shareholder Resolution",
        desc: "Passing necessary resolutions as per the Companies Act.",
      },
      {
        title: "Drafting Offer Letter",
        desc: "Preparing the PAS-4 document detailing the issue.",
      },
      {
        title: "Investor Subscription",
        desc: "Receiving funds in a separate bank account.",
      },
      {
        title: "Allotment & Return Filing",
        desc: "Alloting securities and filing Return of Allotment (PAS-3) with ROC.",
      },
    ],
  },
  {
    id: "project-funding-services",
    slug: "project-funding-services",
    category: "CAPITAL RAISING",
    title: "Project Funding Services — Fueling Your Business Growth",
    icon: <Target className="h-10 w-10" />,
    shortDescription:
      "End-to-end project funding advisory covering financial structuring, debt syndication and investor coordination for large-scale infrastructure and industrial projects.",
    fullDescription:
      "Project Funding requires meticulous planning, as repayment depends heavily on the project's cash flow rather than the sponsor's balance sheet. We provide comprehensive advisory, from preparing bankable Detailed Project Reports (DPRs) to syndicating term loans and structured finance from a consortium of lenders.",
    keyBenefits: [
      "Non-recourse or limited recourse financing",
      "Longer tenures matching asset lifecycles",
      "Optimal debt-equity ratio structuring",
      "Risk mitigation across the project lifecycle",
    ],
    processSteps: [
      {
        title: "Project Conceptualization",
        desc: "Analyzing technical and financial viability.",
      },
      {
        title: "DPR Preparation",
        desc: "Drafting a comprehensive Detailed Project Report.",
      },
      {
        title: "Financial Modeling",
        desc: "Creating robust cash flow projections and sensitivity analyses.",
      },
      {
        title: "Lender Syndication",
        desc: "Approaching banks, NBFCs, and sovereign funds.",
      },
      {
        title: "Financial Closure",
        desc: "Signing loan agreements and initiating initial drawdown.",
      },
    ],
  },
  {
    id: "mainstream-reit-structuring",
    slug: "mainstream-reit-structuring",
    category: "CAPITAL RAISING",
    title: "Mainstream REIT Structuring & Listing Services",
    icon: <Landmark className="h-10 w-10" />,
    shortDescription:
      "Advisory support for structuring and listing REITs, helping unlock value from rent-yielding commercial real estate portfolios.",
    fullDescription:
      "Real Estate Investment Trusts (REITs) offer a powerful way for developers to monetize large, completed, rent-yielding commercial properties. We advise on asset transfer structuring, sponsor holding regulations, establishing the trust, and managing the entire IPO process for the REIT.",
    keyBenefits: [
      "Monetize illiquid real estate assets",
      "Tax-efficient pass-through structure",
      "Access to global institutional capital",
      "Steady dividend yields for investors",
    ],
    processSteps: [
      {
        title: "Asset Identification",
        desc: "Selecting completed and income-generating properties.",
      },
      {
        title: "Trust Formation",
        desc: "Establishing the REIT, Manager, and Trustee hierarchy.",
      },
      {
        title: "Asset Transfer Structuring",
        desc: "Navigating stamp duty and capital gains implications.",
      },
      {
        title: "Valuation & Rating",
        desc: "Independent valuation of the real estate portfolio.",
      },
      {
        title: "Listing the REIT",
        desc: "Filing the Offer Document and issuing units to the public.",
      },
    ],
  },
  {
    id: "sm-reit-structuring-listing-services",
    slug: "sm-reit-structuring-listing-services",
    category: "CAPITAL RAISING",
    title: "SM REIT Structuring & Listing Services",
    icon: <Building2 className="h-10 w-10" />,
    shortDescription:
      "Consultancy for Small and Medium Real Estate Investment Trusts to democratize real estate ownership.",
    fullDescription:
      "Small and Medium REITs (SM REITs) are the latest regulatory innovation allowing fractional ownership of smaller, yielding real estate assets (starting from ₹50 Crores). We guide asset managers in setting up micro-REIT structures, ensuring compliance with the new SEBI Fractional Ownership regulations.",
    keyBenefits: [
      "Lower threshold for asset monetization (₹50 Cr+)",
      "Regulated alternative to unregulated fractional platforms",
      "Diversified asset classes including warehousing and retail",
      "Retail investor participation with smaller ticket sizes",
    ],
    processSteps: [
      {
        title: "Scheme Design",
        desc: "Structuring the specific SM REIT scheme and asset SPVs.",
      },
      {
        title: "SEBI Registration",
        desc: "Registering the Investment Manager under SM REIT regulations.",
      },
      {
        title: "Asset Acquisition",
        desc: "Transferring identified assets into specific scheme SPVs.",
      },
      {
        title: "Offer Document",
        desc: "Drafting the Scheme Information Document (SID).",
      },
      {
        title: "Fundraising & Listing",
        desc: "Raising capital from public/private investors and listing units.",
      },
    ],
  },
  {
    id: "rights-issue-advisory",
    slug: "rights-issue-advisory",
    category: "CAPITAL RAISING",
    title: "Rights Issue Advisory Services",
    icon: <Scale className="h-10 w-10" />,
    shortDescription:
      "End-to-end advisory for listed companies to raise capital through rights issues, covering structuring, pricing, regulatory compliance and efficient execution with existing shareholders",
    fullDescription:
      "A Rights Issue allows listed companies to raise funds without diluting the ownership percentage of participating shareholders. We provide end-to-end advisory on fixing the entitlement ratio, pricing the issue at an attractive discount, managing renounceable rights trading, and overall compliance.",
    keyBenefits: [
      "No dilution of control for subscribing shareholders",
      "Lower marketing and issue expenses",
      "Rewarding existing loyal shareholders with discounted shares",
      "Surety of funds if underwritten",
    ],
    processSteps: [
      {
        title: "Issue Sizing & Pricing",
        desc: "Determining the total capital required and the offer price.",
      },
      {
        title: "Record Date Finalization",
        desc: "Setting the date to determine eligible shareholders.",
      },
      {
        title: "Letter of Offer",
        desc: "Drafting and filing the requisite documents with SEBI/Exchanges.",
      },
      {
        title: "Rights Entitlement Trading",
        desc: "Facilitating the trading of REs on the stock exchange.",
      },
      {
        title: "Allotment",
        desc: "Finalizing allotment based on subscriptions and renunciations.",
      },
    ],
  },
  {
    id: "invit-rights-issue-advisory-services",
    slug: "invit-rights-issue-advisory-services",
    category: "CAPITAL RAISING",
    title: "InvIT Rights Issue Advisory Services",
    icon: <AreaChart className="h-10 w-10" />,
    shortDescription:
      "Specialized advisory for listed Infrastructure Investment Trusts raising capital through rights offerings.",
    fullDescription:
      "Infrastructure Investment Trusts (InvITs) frequently require large capital injections to acquire new infrastructure assets (such as toll roads or power projects). We assist listed InvITs in structuring rights issues, enabling existing unitholders to participate in capital raises while maintaining their proportional ownership and yield profile.",
    overviewParagraph2:
      "Our advisory focuses on optimising issue structure, pricing and investor participation while ensuring full regulatory compliance. From planning to execution, we deliver a seamless capital raise aligned with both sponsor objectives and unitholder value.",
    keyBenefits: [
      "Efficient Capital for Asset Expansion",
      "Streamlined Regulatory Process",
      "Maintains Yield Stability",
      "Cost-Effective Capital Raising",
    ],
    faqs: [
      {
        q: "How do I know if a Rights Issue is suitable for our InvIT?",
        a: "We begin with a detailed assessment of your asset pipeline, capital requirements and yield impact. Based on this, we recommend whether a rights issue is the optimal route for funding acquisitions while maintaining unitholder alignment.",
      },
      {
        q: "How long does an InvIT Rights Issue typically take?",
        a: "Timelines generally range from 4–8 weeks, depending on structuring, regulatory filings and investor readiness. We define a clear execution roadmap with milestones from announcement to allotment.",
      },
      {
        q: "How is the Rights Issue price and ratio determined?",
        a: "Pricing and entitlement ratios are structured based on market conditions, yield considerations and expected investor participation to ensure a successful subscription.",
      },
      {
        q: "What level of investor participation can be expected?",
        a: "Participation depends on asset quality, yield visibility and communication strategy. We design the issue to encourage strong unitholder engagement and subscription.",
      },
      {
        q: "What regulatory approvals are required for an InvIT Rights Issue?",
        a: "Rights issues require compliance with SEBI InvIT regulations and stock exchange requirements, including the filing of offer documents and adherence to disclosure norms.",
      },
    ],

    processSteps: [
      {
        title: "Asset & Capital Planning",
        desc: "Assessment of acquisition pipeline, capital requirements and impact on yield and distributions.",
      },
      {
        title: "Structuring & Pricing",
        desc: "Determination of issue size, entitlement ratio and pricing aligned with investor participation.",
      },
      {
        title: "Regulatory Filings & Approvals",
        desc: "Preparation of offer documents and coordination with SEBI and stock exchanges to ensure compliance.",
      },
      {
        title: "Investor Communication & Issue Launch",
        desc: "Announcement of the record date, communication of the offer terms and management of the subscription process.",
      },
      {
        title: "Allotment & Fund Deployment",
        desc: "Finalisation of allotment, credit of units and deployment of funds toward asset acquisition.",
      },
    ],
  },
  {
    id: "invit-public-issue-advisory",
    slug: "invit-public-issue-advisory",
    category: "CAPITAL RAISING",
    title: "InvIT Public Issue Structuring & Advisory Services",
    icon: <LayoutDashboard className="h-10 w-10" />,
    shortDescription:
      "Raise capital through a well-structured InvIT public issue, backed by expert advisory on structuring, compliance and market execution.",
    fullDescription:
      "Launching an InvIT via a Public Issue is a complex undertaking that involves transferring large-scale infrastructure assets, securing appropriate credit ratings and positioning a yield-based investment product for both retail and institutional investors. We manage the entire lifecycle from sponsor structuring and asset packaging to regulatory approvals and final listing on the exchanges. ",
    overviewParagraph2:
      "At India IPO, our InvIT advisory is designed to help sponsors unlock value from operational assets while building a credible, institutional-grade listed platform. Whether it involves structuring the trust, optimising yield visibility, or navigating SEBI and stock exchange requirements, our approach is customised to your asset profile, investor base and long-term capital strategy. ",
    keyBenefits: [
      "Broader Capital Access: Enables fundraising from institutional, anchor and retail segments.",
      "Regulatory Compliance Assurance: Fully aligned with SEBI’s 2022 conversion framework and reforms.",
      "Sponsor Integrity & Governance: Structured unitholding and float obligations integrated into strategy.",
      "Administrative Efficiency: End-to-end orchestration from structuring to documentation.",
      "Modular Engagement Options: Choose from full-service execution or specific strategic advisory.",
    ],
    faqs: [
      {
        q: "How do I know if an InvIT Public Issue is suitable for our assets?",
        a: "We begin with a detailed assessment of your infrastructure portfolio, focusing on asset stability, cash flows and yield potential. Based on this, we evaluate whether an InvIT public issue is the right structure for capital raising and long-term value creation.",
      },
      {
        q: "How long does an InvIT Public Issue typically take?",
        a: "Timelines generally range from 6–12 months, depending on asset readiness, regulatory filings and market conditions. We provide a structured roadmap covering each stage from trust formation to final listing.",
      },
      {
        q: "What types of assets are eligible for an InvIT?",
        a: "InvITs primarily include completed, revenue-generating infrastructure assets, such as roads, power transmission networks and renewable energy projects, with stable cash flows.",
      },
      {
        q: "How is investor interest built for an InvIT offering?",
        a: "Investor interest is driven by strong yield visibility, asset quality and transparent disclosures. We support positioning, documentation and engagement strategies to attract institutional and retail investors.",
      },
      {
        q: "What regulatory approvals are required for an InvIT Public Issue?",
        a: "The process involves compliance with SEBI InvIT regulations, filing the Offer Document, obtaining stock exchange approvals and adherence to disclosure and governance norms.",
      },
    ],
    processSteps: [
      {
        title: "Strategic Structuring & Eligibility",
        desc: "Evaluate public issue Eligibility vs. follow-on or private placement routes and model capital raise size.",
      },
      {
        title: "Offer Document Drafting & SEBI Coordination",
        desc: "Draft Offer Document compliant with SEBI Schedule A and manage SEBI comment handling and approvals.",
      },
      {
        title: "Investor Allocation & Pricing Strategy",
        desc: "Define allocation split—typically 75% institutional/anchor and 25% public/retail—and recommend pricing methodology.",
      },
      {
        title: "Subscription & Allotment Execution",
        desc: "Oversee the ASBA-based subscription process and administer allotment basis and dematerialisation.",
      },
      {
        title: "Post‑Listing Governance & Compliance Setup",
        desc: "Support ongoing public float monitoring and enable trustee oversight and periodic reporting.",
      },
    ],
  },
  {
    id: "invit-private-issue-advisory",
    slug: "invit-private-issue-advisory",
    category: "CAPITAL RAISING",
    title: "InvIT Private Issue Structuring & Advisory Services",
    icon: <LayoutDashboard className="h-10 w-10" />,
    shortDescription:
      "Customized advisory for private placements and institutional placements of InvIT units under SEBI regulations.",
    fullDescription:
      "Raising capital through private placements allows InvITs to secure funding from sophisticated institutional partners efficiently, bypass massive marketing costs, and customize deal structures specifically to fit investor preferences.",
    keyBenefits: [
      "Customized Structure & Terms",
      "Faster Time to Market & Execution",
      "Optimized Costs vs Public Offerings",
      "Robust Strategic Institutional Relationships",
    ],
    processSteps: [
      {
        title: "Strategic Formulation",
        desc: "Assessing funding requirements and structuring private placement terms.",
      },
      {
        title: "PPM Drafting",
        desc: "Drafting the Private Placement Memorandum tailored for sophisticated QIBs.",
      },
      {
        title: "Regulatory Approvals",
        desc: "Securing SEBI, trustee, and unitholder clearances for private placements.",
      },
      {
        title: "Subscription & Closure",
        desc: "Orchestrating fund subscription and closure mechanisms.",
      },
    ],
  },
  {
    id: "debt-syndication-services",
    slug: "debt-syndication-services",
    category: "CAPITAL RAISING",
    title: "Debt Syndication Services by India IPO",
    icon: <Banknote className="h-10 w-10" />,
    shortDescription:
      "Raise debt efficiently through structured syndication, backed by expert advisory on lender selection, pricing and deal execution.",
    fullDescription:
      "When single-lender limits are exhausted, Debt Syndication brings together a consortium of banks to fund large capital requirements. We structure Working Capital Limits, Term Loans, and Non-Convertible Debentures (NCDs), negotiating the lowest possible interest rates and favorable covenants on your behalf.",
    keyBenefits: [
      "Fulfill massive funding requirements seamlessly",
      "Diversify lender relationships",
      "Negotiate highly competitive interest rates",
      "Optimize debt repayment schedules",
    ],
    processSteps: [
      {
        title: "Credit Assessment",
        desc: "Evaluating the company's borrowing capacity and credit rating.",
      },
      {
        title: "Information Memorandum",
        desc: "Drafting a detailed IM for prospective lenders.",
      },
      {
        title: "Lead Bank Appointment",
        desc: "Selecting the lead arranger to underwrite the debt.",
      },
      {
        title: "Syndication & Appraisal",
        desc: "Onboarding participating banks and facilitating appraisals.",
      },
      {
        title: "Documentation & Disbursement",
        desc: "Signing the consortium agreement and initiating drawdown.",
      },
    ],
  },
  {
    id: "securitised-debt-instruments-sdi",
    slug: "securitised-debt-instruments-sdi",
    category: "CAPITAL RAISING",
    title: "Securitised Debt Instruments (SDIs) : Comprehensive Overview",
    icon: <Banknote className="h-10 w-10" />,
    shortDescription:
      "Strategic advisory for transforming illiquid assets into marketable securities through structured SDI frameworks.",
    fullDescription:
      "Securitised Debt Instruments (SDIs) enable the transformation of illiquid assets, such as loans and receivables, into tradable securities. These instruments are issued via Special Purpose Distinct Entities (SPDEs), typically in the form of trusts, and are listed on recognized stock exchanges under SEBI regulations. SDIs provide a powerful mechanism for banks, NBFCs, and originators to release capital and move risk off-balance sheet while offering investors structured returns from predictable cash flows.",
    keyBenefits: [
      "Access to Capital Markets via Exchange Listing",
      "Risk Mitigation through Diversification & Structuring",
      "Enhanced Transparency & Investor Trust",
      "Regulated Framework by SEBI",
      "Improved Liquidity for Originators",
    ],
    processSteps: [
      {
        title: "Asset Identification & Pooling",
        desc: "Selecting and pooling underlying assets like mortgage loans or trade receivables.",
      },
      {
        title: "SPDE & Trust Formation",
        desc: "Establishing a bankruptcy-remote trust and appointing SEBI-registered trustees.",
      },
      {
        title: "Structuring & Credit Enhancement",
        desc: "Designing tranches and adding guarantees to diminish risk.",
      },
      {
        title: "Rating & Regulatory Filing",
        desc: "Obtaining mandatory credit ratings and filing the prospectus with SEBI.",
      },
      {
        title: "Listing & Tradability",
        desc: "Issuing and listing SDIs on recognized stock exchanges for institutional access.",
      },
    ],
  },
  {
    id: "public-issued-municipal-debt-securities",
    slug: "public-issued-municipal-debt-securities",
    category: "CAPITAL RAISING",
    title: "Municipal Debt Securities Public Issue",
    icon: <Building2 className="h-10 w-10" />,
    shortDescription:
      "Specialized advisory for Urban Local Bodies to raise capital via Public Issues of Municipal Debt Securities (MDS).",
    fullDescription:
      "Public Issues of Municipal Debt Securities (MDS) empower Indian cities to access capital markets for sustainable infrastructure. These bonds, issued by Urban Local Bodies (ULBs) like city corporations, finance critical projects including roads, water supply, and green energy. By leveraging MDS, municipalities reduce dependence on grants and provide citizens a direct stake in urban development through a regulated, transparent framework.",
    keyBenefits: [
      "Access to Scalable Public Capital",
      "Diversified Investor Base (Retail & Institutional)",
      "Enhanced Transparency & Governance",
      "Direct Citizen Participation in Development",
      "Listed on Major Stock Exchanges (NSE/BSE)",
    ],
    processSteps: [
      {
        title: "Eligibility & Credit Health",
        desc: "Assessing financial health, creditworthiness, and SEBI MDS compliance.",
      },
      {
        title: "Bond Structuring",
        desc: "Designing instruments, selecting bond categories, and evaluating tax-free eligibility.",
      },
      {
        title: "Regulatory Drafting",
        desc: "Preparing the Draft Offer Document (DOD) and coordinating with SEBI/Exchanges.",
      },
      {
        title: "Marketing & Subscription",
        desc: "Managing investor education, roadshows, and UPI-based subscription platforms.",
      },
    ],
  },
  {
    id: "privately-issued-municipal-debt-securities",
    slug: "privately-issued-municipal-debt-securities",
    category: "CAPITAL RAISING",
    title: "Privately Issued Municipal Debt Securities",
    icon: <Building2 className="h-10 w-10" />,
    shortDescription:
      "Specialized advisory for Urban Local Bodies and public entities to raise capital via Private Placements of Municipal Debt Securities (MDS).",
    fullDescription:
      "Private Placements of Municipal Debt Securities (MDS) empower Indian cities, public entities, and Urban Local Bodies (ULBs) to raise targeted capital from select institutional investors. This route offers a faster, highly customized, and cost-effective fundraising mechanism for specific urban development projects, smart city initiatives, and infrastructure improvements, ensuring full SEBI compliance with optimized terms.",
    keyBenefits: [
      "Targeted Institutional Capital Sourcing",
      "Faster Execution & Lower Issuance Costs",
      "Flexible & Customized Bond Structuring",
      "Full SEBI MDS Regulatory Compliance",
      "Secured Funding for Smart City & Urban Infrastructure",
    ],
    processSteps: [
      {
        title: "Project & Financial Assessment",
        desc: "Evaluating financial health, debt servicing capacity, and project viability.",
      },
      {
        title: "Targeted Investor Identification",
        desc: "Identifying and engaging select QIBs, HNIs, and institutional investors.",
      },
      {
        title: "Custom Bond Structuring",
        desc: "Designing tenure, coupon rate, and security parameters tailored to institutional demands.",
      },
      {
        title: "Drafting & Regulatory Filings",
        desc: "Preparing the private placement offer document and securing SEBI/Exchange clearances.",
      },
      {
        title: "Subscription & Capital Closure",
        desc: "Managing the subscription process, legal document executions, and fund disbursement.",
      },
    ],
  },
  {
    id: "business-valuation-services",
    slug: "business-valuation-services",
    category: "FINANCE ADVISORY",
    title: "Business Valuation Services: Complete Guide",
    icon: <PieChart className="h-10 w-10" />,
    shortDescription:
      "Strategic valuation services designed to provide clarity, compliance and confidence across M&A, fundraising & reporting requirements.",
    fullDescription:
      "Valuation is both an art and a science. Our Registered Valuers utilize globally accepted methodologies (DCF, Relative Valuation, Net Asset Value) to provide precise business valuations. Whether required for FEMA compliance, Income Tax, M&A transactions, or financial reporting, our reports stand up to intense regulatory scrutiny.",
    keyBenefits: [
      "Regulatory compliance (FEMA, IT Act, Companies Act)",
      "Strong negotiation baseline for Mergers & Acquisitions",
      "Accurate ESOP and Sweat Equity pricing",
      "Comprehensive financial and scenario modeling",
    ],
    processSteps: [
      {
        title: "Information Gathering",
        desc: "Collecting historical financials and future projections.",
      },
      {
        title: "Management Discussions",
        desc: "Understanding the underlying business drivers and risks.",
      },
      {
        title: "Methodology Selection",
        desc: "Choosing appropriate valuation approaches based on context.",
      },
      {
        title: "Financial Modeling",
        desc: "Building the mathematical models and applying discount rates.",
      },
      {
        title: "Report Issuance",
        desc: "Delivering a certified, comprehensive Valuation Report.",
      },
    ],
  },
  {
    id: "corporate-finance-services",
    slug: "corporate-finance-services",
    category: "FINANCE ADVISORY",
    title: "Corporate finance Services : A Comprehensive Overview",
    icon: <Coins className="h-10 w-10" />,
    shortDescription:
      "End-to-end corporate finance solutions across capital structuring, working capital optimisation and strategic financial planning to drive sustainable enterprise growth.",
    fullDescription:
      "Our Corporate Finance advisory acts as an extension of your CFO's office. We provide strategic guidance on capital allocation, debt restructuring, mergers & amalgamations, and risk management. We analyze your long-term objectives to ensure every financial decision is accretive to overall shareholder value.",
    keyBenefits: [
      "Optimized Weighted Average Cost of Capital (WACC)",
      "Strategic alignment of M&A with core business",
      "Efficient capital restructuring to avert distress",
      "Enhanced overall enterprise value",
    ],
    processSteps: [
      {
        title: "Strategic Audit",
        desc: "Reviewing current capital structure and operational efficiency.",
      },
      {
        title: "Gap Analysis",
        desc: "Identifying areas of suboptimal capital deployment.",
      },
      {
        title: "Strategy Formulation",
        desc: "Recommending M&A, divestitures, or recapitalization.",
      },
      {
        title: "Execution Advisory",
        desc: "Guiding the implementation of the chosen strategy.",
      },
      {
        title: "Post-Implementation Review",
        desc: "Tracking metrics to ensure desired outcomes are achieved.",
      },
    ],
  },
  {
    id: "financial-modelling-services",
    slug: "financial-modelling-services",
    category: "FINANCE ADVISORY",
    title: "India IPO Expert Financial Modelling Services",
    icon: <LineChart className="h-10 w-10" />,
    shortDescription:
      "End-to-end financial modelling solutions to support capital raising, valuation and strategic decision-making built for accuracy, flexibility and investor readiness.",
    fullDescription:
      "A robust financial model is the bedrock of any major corporate decision. We build dynamic, three-statement financial models from scratch. Our models incorporate complex sensitivity analyses, scenario building, and KPI tracking, empowering management to visualize the financial impact of strategic choices before executing them.",
    keyBenefits: [
      "Data-driven decision making",
      "Identify precise capital requirements over time",
      "Stress-test business plans under various scenarios",
      "Professional presentation format for investors/lenders",
    ],
    processSteps: [
      {
        title: "Assumption Finalization",
        desc: "Agreeing on macroeconomic and microeconomic inputs.",
      },
      {
        title: "Historical Data Input",
        desc: "Establishing the baseline from past financial statements.",
      },
      {
        title: "Projections & Linkages",
        desc: "Forecasting the Income Statement, Balance Sheet, and Cash Flow.",
      },
      {
        title: "Scenario & Sensitivity",
        desc: "Adding toggles for best, base, and worst-case scenarios.",
      },
      {
        title: "Review & Handover",
        desc: "Rigorous error-checking and training for the client.",
      },
    ],
  },
  {
    id: "project-finance-services",
    slug: "project-finance-services",
    category: "FINANCE ADVISORY",
    title: "Project Finance Services by India IPO",
    icon: <FileText className="h-10 w-10" />,
    shortDescription:
      "End-to-end structuring and financing of infrastructure and large-scale projects through cash flow-based lending and optimised capital structures.",
    fullDescription:
      "Project Finance involves evaluating the economic viability of new industrial or infrastructure projects. We assist in preparing Detailed Project Reports (DPR), calculating IRR and Payback Periods, and advising on the optimal mix of equity, term loans, and working capital to ensure the project achieves financial closure smoothly.",
    keyBenefits: [
      "Rigorous viability assessment before capital commitment",
      "Clear visibility on debt servicing capabilities (DSCR)",
      "Structured to meet precise lender requirements",
      "Minimization of sponsor balance-sheet risk",
    ],
    processSteps: [
      {
        title: "Viability Study",
        desc: "Initial assessment of technical and commercial Eligibility.",
      },
      {
        title: "Cost & Means of Finance",
        desc: "Estimating total project cost and proposed funding mix.",
      },
      {
        title: "DPR Preparation",
        desc: "Drafting the master document required by lenders.",
      },
      {
        title: "Appraisal Support",
        desc: "Defending the projections during bank credit appraisals.",
      },
      {
        title: "Sanction & Closure",
        desc: "Securing the sanction letter and fulfilling pre-disbursement conditions.",
      },
    ],
  },
];
