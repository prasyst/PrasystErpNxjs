
import { Suspense } from 'react';
import TnaComponentPage from '../../components/tna/tnacomponent';

export default function MasterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TnaComponentPage />
    </Suspense>
  );
}
