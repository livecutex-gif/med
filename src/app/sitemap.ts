import type { MetadataRoute } from "next";
import { DOCTORS_DATA } from "@/lib/doctor-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://medicare-hospital-demo.vercel.app";

  const staticRoutes = [
    "",
    "/about",
    "/departments",
    "/doctors",
    "/appointment",
    "/appointment/status",
    "/contact",
    "/faq",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : route.startsWith("/privacy") || route.startsWith("/terms") ? 0.3 : 0.8,
  }));

  const doctorRoutes = Object.keys(DOCTORS_DATA).map((id) => ({
    url: `${baseUrl}/doctors/${id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...doctorRoutes];
}
