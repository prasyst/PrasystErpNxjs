import Inventoryoffline from "@/components/inventory/sales-dispatch/Sales-order_Barcode/inventoryoffline";
import { Suspense } from 'react';

export default function Inventory() {
  return (
    <Suspense>
      <Inventoryoffline />
    </Suspense>
  );
}