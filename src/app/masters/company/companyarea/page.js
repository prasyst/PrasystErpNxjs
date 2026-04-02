import React, { Suspense } from "react";
import CompanyArea from "@/components/masters/company/companyarea/CompanyArea";

export default function CompanyAreaPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CompanyArea />
        </Suspense>
    )
}