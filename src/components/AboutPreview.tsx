import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Award, Users, Target } from "lucide-react";

import aboutPreview from "@/assets/about-preview2.webp";

const AboutPreview = () => {
  const aboutPreviewSrc = typeof aboutPreview === "string" ? aboutPreview : aboutPreview.src;

  return (
    <section className="py-24 bg-secondary/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          <div
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img src={aboutPreviewSrc} alt="IndiaIPO Team discussing IPO strategy" className="w-full h-auto aspect-video sm:aspect-[4/3] lg:aspect-auto lg:h-[480px] object-cover" width="1024"
                height="768" loading="eager"
                fetchPriority="high"
                decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
            </div>

            <div
              className="absolute -bottom-2 -right-1 sm:-bottom-8 sm:-right-4 lg:-right-8 bg-card border border-border rounded-lg sm:rounded-2xl p-2 sm:p-5 lg:p-6 shadow-xl"
            >
              <div className="grid grid-cols-2 gap-1 sm:gap-4">
                {[
                  { value: "8+", label: "Years" },
                  { value: "140+", label: "IPOs" },
                  { value: "9.2K+", label: "Consultancies" },
                  { value: "98%", label: "Success" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-0">
                    <div className="text-xs sm:text-lg lg:text-xl font-bold font-heading text-foreground leading-none mb-0.5">{stat.value}</div>
                    <div className="text-[8px] sm:text-[10px] text-muted-foreground font-medium tracking-wide">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute -top-4 -left-4 w-24 h-24 border-l-4 border-t-4 border-accent rounded-tl-3xl" />
          </div>


          <div>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-heading text-foreground mb-6 leading-tight">
              Why Companies Choose <span className="text-primary">India IPO</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4 text-base">
              India IPO is a premier IPO consultancy firm helping companies navigate the complex process of going public. With a proven track record of <strong className="text-foreground">9,200+ successful consultancies</strong>, we provide end-to-end IPO consultancy, guiding companies through planning, positioning and execution.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8 text-base">
              Our team of experienced merchant bankers, legal experts, and financial advisors work closely with promoters to ensure a <strong className="text-foreground">seamless IPO journey</strong> — from Eligibility assessment to listing day and beyond.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: Shield, label: "SEBI Compliant" },
                { icon: Users, label: "Expert Team" },
                { icon: Target, label: "End-to-End Advisory" },
                { icon: Award, label: "Proven Track Record" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3">
                  <item.icon className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                </div>
              ))}
            </div>

            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base px-8 rounded-xl group" asChild>
              <Link href="/about">
                Explore Our Journey
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
