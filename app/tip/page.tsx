import TipCalculator from "../tip-calculator";
import { usePageSEO } from "@/lib/usePageSEO";

export const metadata = usePageSEO("/tip");

export default function TipPage() {
  return <TipCalculator />;
}