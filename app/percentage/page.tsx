import PercentageCalculator from "../discount-calculator";
import { usePageSEO } from "@/lib/usePageSEO";

export const metadata = usePageSEO("/percentage");

export default function PercentagePage() {
  return <PercentageCalculator />;
}