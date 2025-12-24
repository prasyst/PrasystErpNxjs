
import { Suspense } from 'react';
import MasterEmployeComp from '@/components/masters/employee/MasterEmployeComp';

export default function employeepage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MasterEmployeComp />
    </Suspense>
  );
}
