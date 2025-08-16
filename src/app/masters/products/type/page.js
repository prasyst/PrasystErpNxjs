
'use client';

import React, { Suspense } from 'react';
import TypeMst from "@/components/masters/products/type/TypeMst";

export default function TypePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TypeMst />
        </Suspense>
    );
}


