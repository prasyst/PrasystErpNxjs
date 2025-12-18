import FinishedGoods from "@/components/masters/qc/qctest/finishedGoods/FinishedGoods";
import { Suspense } from "react";

export default function FinishedGoodsPage() {
  return(
 <Suspense fallback={<div>Loading...</div>}>
   <FinishedGoods />;
  </Suspense>
  )
}