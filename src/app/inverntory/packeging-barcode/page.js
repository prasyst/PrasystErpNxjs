import PackagingBarcode from "@/components/inventory/sales-dispatch/Packaging/packagingBarcode";
import { Suspense } from 'react';

export default function packaging() {
  return (
    <Suspense>
      <PackagingBarcode />
    </Suspense>
  );
}