
import { Suspense } from 'react';
import QcComponentPage from '@/components/qualitycontrol/QcComponent';

export default function MasterPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <QcComponentPage />
        </Suspense>
    )
}
