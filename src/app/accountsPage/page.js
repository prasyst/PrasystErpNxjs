import { Suspense } from 'react';
import AccountComponent from "@/components/accounts/AccountComponent";

export default function AccountsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccountComponent />;
    </Suspense>
  )
}

