
import Tna from '../../../components/inventory/TnaComp/Tna';
import { Suspense } from 'react';
import Tnatable from '../../../components/inventory/TnaComp/Tnatable';
export default function tna() {
return (
    <Suspense>
      <Tnatable />
    </Suspense>
  );
}