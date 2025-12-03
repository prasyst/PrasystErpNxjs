import { Suspense } from 'react';
import InventoryComponent from '@/components/inventory/inventory/InventoryComponent';

export default function InventoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InventoryComponent />
    </Suspense>
  );
}
