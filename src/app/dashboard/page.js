// import Cards from '@/components/dashboard/Cards';
// import Charts from '@/components/dashboard/Charts';

// export default function DashboardPage() {
//   return (
//     <div className="space-y-6">
//       <Cards />
//       <Charts />
//     </div>
//   );
// }

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cards from '@/components/dashboard/Cards';
import Charts from '@/components/dashboard/Charts';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('authenticated') === 'true';
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="space-y-6">
      <Cards />
      <Charts />
    </div>
  );
}
