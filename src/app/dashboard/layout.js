'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';


export default function Layout({ children }) {
  const router= useRouter();
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('authenticated') === 'true';
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [router]);
  return <DashboardLayout>{children}</DashboardLayout>;
}