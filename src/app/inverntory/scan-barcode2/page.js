import ScanBarcode2 from "@/components/inventory/sales-dispatch/scan-Barcode/scanbarcode2";
import { Suspense } from 'react';

export default function Inventory() {
  return (
    <Suspense>
      <ScanBarcode2 />
    </Suspense>
  );
}