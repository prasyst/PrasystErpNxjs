'use client';

import TaxMst from '@/components/masters/taxterms/taxmaster/TaxMst';
import React, { Suspense } from 'react';

export default function TaxPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TaxMst />
        </Suspense>
    );
}