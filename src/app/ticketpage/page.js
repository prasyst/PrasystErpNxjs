
import { Suspense } from 'react';
import MasterComponent from '@/components/masters/master/MasterComponent';
import TicketPage from '../../components/ticket/TicketComponent';

export default function MasterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TicketPage />
    </Suspense>
  );
}
