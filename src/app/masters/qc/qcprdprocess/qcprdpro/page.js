import { Suspense } from "react";
import QcPrdPro from "@/components/masters/qc/qcprdprocess/qcprdpro";

export default function QcProductProcessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <QcPrdPro/>;
        </Suspense>
    )
}