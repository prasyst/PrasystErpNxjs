// app/order/page.js

// import WebMst from "@/components/masters/products/webcollection/WebMst";

// export default function WebPage() {
//   return <WebMst />;
// }

'use client';

import React, { Suspense } from 'react';
import WebMst from "@/components/masters/products/webcollection/WebMst";

export default function WebPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <WebMst />
        </Suspense>
    );
}
