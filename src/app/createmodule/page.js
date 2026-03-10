
import { Suspense } from 'react';

import Createmodule from '../../components/createmodule/createmodule';

export default function MasterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Createmodule />
    </Suspense>
  );
}
