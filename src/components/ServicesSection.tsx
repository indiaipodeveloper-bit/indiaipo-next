import { Building2, TrendingUp, BarChart3, Wallet, ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import servicesImg from "@/assets/service.webp";

const serviceCards = [
  {
    title: "SME IPO",
    description: "End-to-end support for SME IPOs across the BSE SME and NSE Emerge platforms.",
    icon: Building2,
    color: "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
    link: "/sme-ipo-consultant"
  },
  {
    title: "Mainline IPO",
    description: "Strategic advisory for mainboard IPO listings with SEBI compliance and investor positioning.",
    icon: TrendingUp,
    color: "bg-brand-green/10 text-brand-green group-hover:bg-brand-green group-hover:text-primary-foreground",
    link: "/mainline-ipo-consultant"
  },
  {
    title: "FPO Advisory",
    description: "Follow-on Public Offering planning, documentation and execution assistance for listed companies",
    icon: BarChart3,
    color: "bg-accent text-accent-foreground group-hover:bg-accent-foreground group-hover:text-accent",
    link: "/fpo"
  },
  {
    title: "Pre-IPO Funding",
    description: "Engage with institutional investors and HNIs for pre-IPO capital raising and valuation alignment.",
    icon: Wallet,
    color: "bg-brand-red/10 text-brand-red group-hover:bg-brand-red group-hover:text-primary-foreground",
    link: "/pre-ipo-consultant"
  },
];

const ServicesSection = () => {
  const servicesImgSrc = typeof servicesImg === "string" ? servicesImg : servicesImg.src;

  return (
    <section className="py-10 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div
          className="mb-12 max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-foreground mb-4 leading-tight">
            Comprehensive <span className="text-[#F99810]">IPO Services</span>
          </h2>
          <p className="text-muted-foreground text-base">
            From planning to listing day, we offer complete IPO advisory services aligned to your business objectives.
          </p>
        </div>

        {/* Grid for Cards and Image */}
        <div className="grid lg:grid-cols-2 gap-16 items-stretch">
          <div className="grid grid-cols-2 gap-3 md:gap-5">
            {serviceCards.map((service, idx) => (
              <div
                key={service.title}
                className="h-full"
              >
                <Link
                  href={service.link}
                  className="group block bg-card border border-border rounded-2xl p-4 md:p-6 shadow-2xl hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 h-full"
                >
                  <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300 ${service.color}`}>
                    <service.icon className="h-5 w-5 md:h-7 md:h-7" />
                  </div>
                  <h3 className="text-lg font-bold font-heading text-foreground mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{service.description}</p>
                  <span className="inline-flex items-center text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform">
                    Learn More <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </Link>
              </div>
            ))}
          </div>

          <div
            className="relative hidden lg:flex flex-col h-full"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl h-full flex-grow">
              <img src={servicesImgSrc} alt="IPO Trading Floor" className="w-full h-full object-cover min-h-[400px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent rounded-2xl" />
            </div>
            <div className="absolute bottom-8 left-8 right-8">
              <h3 className="text-2xl font-bold font-heading text-background mb-3">Ready to Go Public?</h3>
              <p className="text-background/80 text-sm mb-5">Get a free IPO Eligibility assessment from our experts today.</p>
              <Button className="text-white font-semibold rounded-xl shadow-lg hover:opacity-95"
                style={{
                  background:
                    "linear-gradient(135deg, #001529 0%, #003d78 60%, #0066cc 100%)",
                }} asChild>
                <Link href="/ipo-eligibility-check">
                  Check Eligibility Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r-4 border-b-4 border-primary rounded-br-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
