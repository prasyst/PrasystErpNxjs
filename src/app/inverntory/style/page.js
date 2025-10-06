import Style from "@/components/inventory/Style/Style";
import { Suspense } from 'react';

export default function style() {
  return (
    <Suspense>
      <Style />
    </Suspense>
  );
}