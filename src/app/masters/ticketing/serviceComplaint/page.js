import ServiceComplaint from "@/components/masters/ticketing/serviceComplaint/ServiceComplaint";
import { Suspense } from 'react';

export default function ServiceComplaintPage() {
  return (
    <Suspense>
      <ServiceComplaint />
    </Suspense>
  );
}