import Style from "@/components/masters/products/Style/Style";
import { Suspense } from 'react';

export default function style() {
  return (
    <Suspense>
      <Style />
    </Suspense>
  );
}