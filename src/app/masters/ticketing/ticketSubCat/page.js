import TicketSubCatMst from "@/components/masters/ticketing/ticketSubCat/TicketSubCatMst";
import { Suspense } from 'react';

export default function TicketSubCatPage() {
  return (
    <Suspense>
      <TicketSubCatMst />
    </Suspense>
  );
}