
import { Suspense } from 'react';
import MasterComponent from '@/components/masters/master/MasterComponent';

export default function MasterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MasterComponent />
    </Suspense>
  );
}
