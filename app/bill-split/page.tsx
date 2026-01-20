import BillSplitter from "../bill-splitter";
import { usePageSEO } from "@/lib/usePageSEO";

export const metadata = usePageSEO("/bill-split");

export default function BillSplitPage() {
  return <BillSplitter />;
}