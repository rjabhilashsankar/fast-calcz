import { Metadata } from "next";
import TipCalculator from "../tip-calculator";
import { usePageSEO } from "@/lib/usePageSEO";

export async function generateMetadata(): Promise<Metadata> {
  const seo = usePageSEO("/tip");  
  
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
export default function TipPage() {
  return <TipCalculator />;
}