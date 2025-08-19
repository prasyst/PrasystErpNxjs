'use client';

import RackMst from '@/components/masters/products/rack/RackMst';
import React, { Suspense } from 'react';


export default function RackPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RackMst />
        </Suspense>
    );
}