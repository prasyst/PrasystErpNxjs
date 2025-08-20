'use client';

import TermsMst from '@/components/masters/taxterms/termmaster/TermsMst';
import React, { Suspense } from 'react';

export default function TermsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TermsMst />
        </Suspense>
    );
}