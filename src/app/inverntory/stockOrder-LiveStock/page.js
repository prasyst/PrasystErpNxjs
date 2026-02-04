import Inventoryoffline from "@/components/inventory/sales-dispatch/saleOrder_Online/inventoryoffline";
import { Suspense } from 'react';

export default function Inventory() {
    return (
        <Suspense>
            <Inventoryoffline />
        </Suspense>
    );
}