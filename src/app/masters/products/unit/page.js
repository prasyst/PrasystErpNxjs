
'use client';

import React, { Suspense } from 'react';
import UnitMst from "@/components/masters/products/unit/UnitMst";

export default function UnitPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
          <UnitMst />
        </Suspense>
    );
}