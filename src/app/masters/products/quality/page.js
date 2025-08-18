'use client';

import QualityMst from '@/components/masters/products/quality/QualityMst';
import React, { Suspense } from 'react';


export default function QualityPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <QualityMst />
        </Suspense>
    );
}