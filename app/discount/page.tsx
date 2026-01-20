import DiscountCalculator from "../discount-calculator";
import { usePageSEO } from "@/lib/usePageSEO";

export const metadata = usePageSEO("/discount");

export default function DiscountPage() {
  return <DiscountCalculator />;
}