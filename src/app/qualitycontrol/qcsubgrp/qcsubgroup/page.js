import { Suspense } from "react";
import QcSubGroup from "@/components/qualitycontrol/qcsubgrp/QcSubGroup";

export default function QcSubGroupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QcSubGroup />
    </Suspense>
  )
}