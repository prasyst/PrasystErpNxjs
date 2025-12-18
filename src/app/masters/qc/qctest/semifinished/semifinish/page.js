

import SemiFinish from "@/components/masters/qc/qctest/semifinished/SemiFinish";
import { Suspense } from "react";

export default function SemiFinishedPage() {
  return(
 <Suspense fallback={<div>Loading...</div>}>
   <SemiFinish/>;
  </Suspense>
  )
}