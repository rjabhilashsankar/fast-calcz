import { Metadata } from "next";
import DiscountCalculator from "../discount-calculator";
import { usePageSEO } from "@/lib/usePageSEO";

export async function generateMetadata(): Promise<Metadata> {
  const seo = usePageSEO("/discount");  
  
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: 'website',
    },
  };
}
export default function DiscountPage() {
  return <DiscountCalculator />;
}