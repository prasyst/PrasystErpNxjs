import ScanBarcode from "@/components/inventory/sales-dispatch/scan-Barcode/scanbarcode";
import { Suspense } from 'react';

export default function Inventory() {
  return (
    <Suspense>
      <ScanBarcode />
    </Suspense>
  );
}