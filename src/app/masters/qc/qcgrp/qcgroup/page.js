import QcGroup from "@/components/masters/qc/qcgrp/QcGroup";
import { Suspense } from "react";


export default function QcGroupPage() {
  return(
 <Suspense fallback={<div>Loading...</div>}>
   <QcGroup />;
  </Suspense>
  )
}