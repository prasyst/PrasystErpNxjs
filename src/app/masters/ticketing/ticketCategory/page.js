import TicketCatMst from "@/components/masters/ticketing/ticketCategory/TicketCatMst";
import { Suspense } from 'react';

export default function TicketCatMstPage() {
  return (
    <Suspense>
      <TicketCatMst />
    </Suspense>
  );
}