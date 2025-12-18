
import RawMaterial from "@/components/masters/qc/qctest/rawmaterial/RawMaterial";
import { Suspense } from "react";

export default function RawMaterialPage() {
  return(
 <Suspense fallback={<div>Loading...</div>}>
   <RawMaterial />;
  </Suspense>
  )
}