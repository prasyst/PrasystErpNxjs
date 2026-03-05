import { Suspense } from 'react';
import MyAiTool from "../../components/myaitool/myaitool";

export default function AccountsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyAiTool />;
    </Suspense>
  )
}

