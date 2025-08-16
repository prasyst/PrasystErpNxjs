
'use client';

import React, { Suspense } from 'react';
import PatternMst from "@/components/masters/products/pattern/PatternMst";

export default function PatternPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
          <PatternMst />
        </Suspense>
    );
}