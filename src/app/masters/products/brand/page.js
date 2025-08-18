'use client';

import BrandMst from '@/components/masters/products/brand/BrandMst';
import React, { Suspense } from 'react';


export default function BrandPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BrandMst />
        </Suspense>
    );
}