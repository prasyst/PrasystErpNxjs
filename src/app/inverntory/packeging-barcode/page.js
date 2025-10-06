import PackagingBarcode from "@/components/inventory/sales-dispatch/Packaging/PackagingBarcode";
import { Suspense } from 'react';

export default function packaging() {
  return (
    <Suspense>
      <PackagingBarcode />
    </Suspense>
  );
}