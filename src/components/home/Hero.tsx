import heroHome from "@/assets/heroImg.webp";
import { API_URL } from "@/lib/constants";
import HeroCarousel from "./HeroCarousel";

export interface Banner {
    id: string;
    title: string | null;
    subtitle: string | null;
    image_url: string;
    mobile_image_url?: string | null;
    video_url?: string | null;
    type?: "image" | "video";
    cta_text: string | null;
    cta_link: string |null;
    badge_text?: string | null;
    cta2_text?: string | null;
    cta2_link?: string | null;
    sort_order: number;
    is_active?: boolean;
}

async function getBanners(): Promise<Banner[]> {
    try {
        const res = await fetch(`${API_URL}/api/banners?page=/`);

        if (!res.ok) {
            throw new Error("Failed to fetch banners");
        }

        const data: Banner[] = await res.json();

        return data.filter((banner) => banner.is_active);
    } catch (error) {
        console.error("Error fetching banners:", error);
        return [];
    }
}

export default async function Hero() {
    const heroHomeSrc =
        typeof heroHome === "string" ? heroHome : heroHome.src;

    const fallbackBanners: Banner[] = [
        {
            id: "1",
            title: "Go Public, The Right Way",
            subtitle: "India's IPO Platform for Businesses",
            image_url: heroHomeSrc,
            video_url: "",
            type: "image",
            cta_text: "Contact Us",
            cta_link: "/contact",
            badge_text: "Official IPO Consultancy",
            cta2_text: "Check Your IPO Eligibility",
            cta2_link: "/ipo-eligibility-check",
            sort_order: 1,
        },
    ];

    const banners = await getBanners();

    return (
        <HeroCarousel
            banners={banners.length ? banners : fallbackBanners}
        />
    );
}