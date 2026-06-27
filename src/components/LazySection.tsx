"use client";
import { useEffect, useRef, useState } from "react";

interface LazySectionProps {
    children: React.ReactNode;
}

export default function LazySection({
    children,
}: LazySectionProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleHash = () => {
            if (window.location.hash) {
                setVisible(true);
            }
        };

        if (typeof window !== "undefined") {
            if (window.location.hash) {
                setVisible(true);
            }
            window.addEventListener("hashchange", handleHash);
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: "300px",
            }
        );

        if (ref.current && !visible) {
            observer.observe(ref.current);
        }

        return () => {
            observer.disconnect();
            if (typeof window !== "undefined") {
                window.removeEventListener("hashchange", handleHash);
            }
        };
    }, [visible]);

    return <div ref={ref}>{visible ? children : null}</div>;
}
