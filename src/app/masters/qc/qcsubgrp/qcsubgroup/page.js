import QcSubGroup from "@/components/masters/qc/qcsubgrp/QcSubGroup";
import { Suspense } from "react";

export default function QcSubGroupPage() {
  return(
 <Suspense fallback={<div>Loading...</div>}>
   <QcSubGroup />;
  </Suspense>
  )
}