import { Suspense } from "react";
import QcParamtr from "@/components/masters/qc/qcparameter/QcParamtr";

export default function QcParameterPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <QcParamtr />;
        </Suspense>
    )
}