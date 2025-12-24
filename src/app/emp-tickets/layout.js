
'use client';


import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EmployeeDashboardLayout from '@/components/emp-dashboard/EmployeeDashboardLayout';

export default function TicketingMastersLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const empKey = localStorage.getItem('EMP_KEY');
    const userRole = localStorage.getItem('userRole');
    
    if (!empKey && userRole !== 'employee') {
      router.push('/login');
    }
  }, [router]);

  return <EmployeeDashboardLayout>{children}</EmployeeDashboardLayout>;
}