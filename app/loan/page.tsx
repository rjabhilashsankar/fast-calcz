import LoanEMICalculator from "../loan-emi-calculator";
import { usePageSEO } from "@/lib/usePageSEO";

export const metadata = usePageSEO("/loan");

export default function LoanPage() {
  return <LoanEMICalculator />;
}