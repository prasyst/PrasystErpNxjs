// app/order/page.js

import PartyMst from "@/components/masters/Customers/party/PartyMstComponent";
import { Suspense } from 'react';

export default function PartyPage() {
  return (
    <Suspense>
      <PartyMst />
    </Suspense>
  );
}