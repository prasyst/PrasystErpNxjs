import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function TicketsLayout({ children }) {
    
  return (
    <div className="tickets-layout">
      <DashboardLayout>{children}</DashboardLayout>
    </div>
  );
}