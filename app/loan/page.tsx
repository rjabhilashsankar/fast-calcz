import { Metadata } from "next";
import LoanEMICalculator from "../loan-emi-calculator";
import { usePageSEO } from "@/lib/usePageSEO";

export async function generateMetadata(): Promise<Metadata> {
  const seo = usePageSEO("/loan");  
  
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
export default function LoanPage() {
  return <LoanEMICalculator />;
}