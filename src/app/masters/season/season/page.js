'use client';

import SeasonMst from '@/components/masters/season/season/SeasonMst';
import React, { Suspense } from 'react';


export default function SeasonPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SeasonMst />
        </Suspense>
    );
}