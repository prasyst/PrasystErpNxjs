"use client"
import CreateTicket from '@/components/ticket/CreateTicket';
import { Suspense } from 'react';

export default function TicketDashboardPage() {
  // return <CreateTicket/>;
    return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateTicket />
    </Suspense>
  );
}