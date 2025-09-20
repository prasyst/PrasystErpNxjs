import SalesDashboard from "@/components/salesDashboard/SalesDashboard";

const salesDash = () => {
    return (
        <div className="space-y-6" style={{ height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
            <SalesDashboard />
        </div>
    )
};

export default salesDash;