import QcGroup from "@/components/qualitycontrol/qcgrp/QcGroup";
import { Suspense } from "react";


export default function QcGroupPage() {
  return(
 <Suspense fallback={<div>Loading...</div>}>
   <QcGroup />
  </Suspense>
  )
}