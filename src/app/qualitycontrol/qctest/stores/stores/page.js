import { Suspense } from "react";
import Stores from "@/components/qualitycontrol/qctest/stores/Stores";

export default function StoresPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Stores />
    </Suspense>
  )
};