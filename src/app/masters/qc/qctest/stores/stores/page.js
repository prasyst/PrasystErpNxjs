
import Stores from "@/components/masters/qc/qctest/stores/Stores";
import { Suspense } from "react";

export default function StoresPage() {
  return(
 <Suspense fallback={<div>Loading...</div>}>
   <Stores />;
  </Suspense>
  )
}