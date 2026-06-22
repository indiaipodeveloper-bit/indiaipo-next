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

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return <div ref={ref}>{visible ? children : null}</div>;
}
