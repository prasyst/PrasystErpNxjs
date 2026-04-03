
import Tna from '../../../components/inventory/TnaComp/Tna';
import { Suspense } from 'react';
import TNAReport from '../../../components/inventory/TnaComp/Tnareport';
export default function tna() {
return (
    <Suspense>
      <TNAReport />
    </Suspense>
  );
}