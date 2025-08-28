'use client';

import React, { Suspense } from 'react';
import CompanyMst from '@/components/masters/company/company/CompanyMst';

export default function CompanyPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
          <CompanyMst />
        </Suspense>
    );
}