
'use client';

import React, { Suspense } from 'react';
import CategoryMst from "@/components/masters/products/category/CategoryMst";

export default function TypePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
          <CategoryMst />
        </Suspense>
    );
}