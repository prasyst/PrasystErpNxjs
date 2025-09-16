// app/order/page.js

import CreditorsSuppliersMst from "@/components/masters/Vendors/creditorsSuppliers/creditorsSuppliersMst";
import { Suspense } from 'react';

export default function CreditorsSuppliersPage() {
  return (
    <Suspense>
      <CreditorsSuppliersMst />
    </Suspense>
  );
}