import MortgageCalculator from "../mortgage-calculator";
import { usePageSEO } from "@/lib/usePageSEO";

export const metadata = usePageSEO("/mortgage");

export default function MortgagePage() {
  return <MortgageCalculator />;
}