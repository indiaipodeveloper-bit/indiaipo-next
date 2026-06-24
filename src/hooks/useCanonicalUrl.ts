"use client";
import { usePathname } from "next/navigation";
import { BASE_URL } from "@/lib/constants";

export function useCanonicalUrl(overridePath?: string): string {
  const pathname = usePathname();

  const normalisePath = (p: string) =>
    p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;

  const resolvedPath = overridePath
    ? normalisePath(overridePath)
    : normalisePath(pathname || "");

  return `${BASE_URL}${resolvedPath}`;
}

export { BASE_URL };
