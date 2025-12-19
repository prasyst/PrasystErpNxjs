import Userpermission from "@/components/UserPermission(RBAC)/Userpermission";
import { Suspense } from 'react';

export default function packaging() {
  return (
    <Suspense>
      <Userpermission />
    </Suspense>
  );
}