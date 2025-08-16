
'use client';

import ShadeMst from '@/components/masters/products/shade/ShadeMst';
import React, { Suspense } from 'react';

export default function ShadePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
          <ShadeMst />
        </Suspense>
    );
}