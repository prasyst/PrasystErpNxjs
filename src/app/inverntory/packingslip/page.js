import Packingslip from "@/components/inventory/sales-dispatch/Packaging slip/inventoryoffline";
import { Suspense } from 'react';

export default function packaging() {
  return (
    <Suspense>
      <Packingslip />
    </Suspense>
  );
}