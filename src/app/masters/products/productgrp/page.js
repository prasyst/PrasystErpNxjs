
'use client';

import React, { Suspense } from 'react';
import ProductGrp from '@/components/masters/products/productgrp/ProductGrp';

export default function ProductGrpPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
          <ProductGrp />
        </Suspense>
    );
}