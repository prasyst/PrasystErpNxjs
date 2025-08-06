import Cards from '@/components/dashboard/Cards';
import Charts from '@/components/dashboard/Charts';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Cards />
      <Charts />
    </div>
  );
}