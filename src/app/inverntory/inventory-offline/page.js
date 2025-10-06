import Inventoryoffline from "@/components/inventory/sales-dispatch/Inventory_Offline/inventoryoffline";
import { Suspense } from 'react';

export default function Inventory() {
  return (
    <Suspense>
      <Inventoryoffline />
    </Suspense>
  );
}