import aboutPreview from "@/assets/IPOConsultant.webp";

const IPOConsultant = () => {
    const aboutPreviewSrc = typeof aboutPreview === "string" ? aboutPreview : aboutPreview.src;

    return (
        <section className="py-16 md:py-24 bg-secondary/30 overflow-hidden">
            <div className="container mx-auto px-4">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-heading text-foreground mb-8 md:mb-12 text-center">
                    <span className="text-[#F99810]"> India IPO</span>  - India’s Most Trusted IPO Consultant
                </h1>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">

                    <div className="relative h-64 sm:h-[400px] lg:h-full w-full">
                        <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-xl border border-border bg-card">
                            <img
                                src={aboutPreviewSrc}
                                alt="IndiaIPO Team discussing IPO strategy"
                                className="w-full h-full object-cover"
                                width="1024"
                                height="768"
                                loading="eager"
                                fetchPriority="high"
                                decoding="async"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <p className="text-muted-foreground leading-relaxed text-base">
                            <strong style={{ color: "#000000" }}> India IPO </strong> is a leading    <strong style={{ color: "#000000" }}>IPO Consultant</strong> and <a href="/ipo-services"><strong style={{ color: "#000000" }}>IPO Advisory</strong></a> platform in India, helping companies successfully access the Indian Capital Markets. We offer end-to-end IPO services for businesses looking to conduct an SME IPO or a Mainboard IPO, helping promoters at every step of their journey from education and strategic planning to execution and post-listing visibility.
                        </p>

                        <p className="text-muted-foreground leading-relaxed text-base">
                            Our services include IPO readiness assessment, business structuring, corporate governance, documentation services, regulatory requirements, investor education, and capital market education. Whether your company is a growing SME, a family business, a startup looking to grow, or an established company looking to raise capital through a public offering, India IPO simplifies the entire IPO process.
                        </p>

                        <p className="text-muted-foreground leading-relaxed text-base">
                            In addition to IPOs, we help companies secure <a href="/pre-ipo-consultant"><strong style={{ color: "#000000" }} >Pre-IPO Funding</strong> </a>, Private Placement, and Project Funding solutions to strengthen their growth plans before entering the public markets. We work closely with businesses to identify funding opportunities tailored to their requirements, improve market readiness, and create a strong foundation for future fundraising initiatives.
                        </p>

                        <p className="text-muted-foreground leading-relaxed text-base">
                            India IPO is also a reliable platform for obtaining IPO Details, market analysis and industry analysis and information related to <a href="/all-ipos"> <strong style={{ color: "#000000" }}>IPO GMP</strong> </a> (Grey Market Premium) trends, and keeping investors and other participants informed about developments in the primary market.
                        </p>

                        <p className="text-muted-foreground leading-relaxed text-base">
                            India IPO’s philosophy is driven by “IPO from Education to Execution,” which combines knowledge and market insight to guide our clients in raising capital, building credibility, accelerating growth and becoming successful public companies.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default IPOConsultant;
