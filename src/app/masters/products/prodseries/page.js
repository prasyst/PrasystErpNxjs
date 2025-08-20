'use client';

import ProdSrMst from '@/components/masters/products/prodseries/ProdSrMst';
import React, { Suspense } from 'react';


export default function ProdSeriesPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProdSrMst />
        </Suspense>
    );
}