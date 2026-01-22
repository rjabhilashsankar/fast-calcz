import type { Metadata } from "next";
import PercentageCalculator from "../discount-calculator";
import { usePageSEO } from "@/lib/usePageSEO";

export async function generateMetadata(): Promise<Metadata> {
  const seo = usePageSEO("/percentage");

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "website",
    },
  };
}

export default function PercentagePage() {
  return <PercentageCalculator />;
}