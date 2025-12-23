import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import {
  GaugeContainer,
  GaugeValueArc,
  GaugeReferenceArc,
  useGaugeState,
} from '@mui/x-charts/Gauge';
const Dashboard = () => {
  const lineData = [
    { name: 'Jan', value: 5000 },
    { name: 'Feb', value: 8000 },
    { name: 'Mar', value: 6000 },
    { name: 'Apr', value: 9000 },
    { name: 'May', value: 11000 },
    { name: 'Jun', value: 12000 },
  ];

  const barData = [
    { name: 'Jan', value: 120 },
    { name: 'Feb', value: 190 },
    { name: 'Mar', value: 150 },
    { name: 'Apr', value: 220 },
    { name: 'May', value: 250 },
    { name: 'Jun', value: 280 },
  ];

  const pieData = [
    { name: 'Desktop', value: 400 },
    { name: 'Mobile', value: 300 },
    { name: 'Tablet', value: 200 },
    { name: 'Other', value: 100 },
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];

  // Order status data
  const orderData = [
    { id: '#001', name: 'John Doe', state: 'California', country: 'USA' },
    { id: '#002', name: 'Jane Smith', state: 'Texas', country: 'USA' },
    { id: '#003', name: 'Mike Johnson', state: 'New York', country: 'USA' },
    { id: '#004', name: 'Sarah Wilson', state: 'Florida', country: 'USA' },
    { id: '#005', name: 'David Brown', state: 'Nevada', country: 'USA' },
  ];

  const MuiGauge = ({ value = 75 }) => {
    return (
      <div className="gauge-wrapper">
        <GaugeContainer
          width={200}
          height={150}
          startAngle={-110}
          endAngle={110}
          value={value}
        >
          <GaugeReferenceArc />
          <GaugeValueArc />
        </GaugeContainer>
      </div>
    );
  };

  // Calculate total for percentage calculation
  const total = pieData.reduce((sum, entry) => sum + entry.value, 0);

  // Custom label function for pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Circular Progress Component
  const CircularProgress = ({ percentage, label, color = '#8884d8' }) => {
    const radius = 45;
    const strokeWidth = 8;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="circular-progress-container">
        <svg height={radius * 2} width={radius * 2} className="circular-progress-svg">
          <circle
            stroke="#e6e6e6"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div className="circular-progress-text">
          <div className="circular-progress-percentage">{percentage}%</div>
          <div className="circular-progress-label">{label}</div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style jsx>{`
        .dashboard-container {
          width: 100%;
          padding: 16px;
          box-sizing: border-box;
          overflow-y: auto;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .chart-card {
          background: white;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          position: relative;
          min-height: 200px;
          display: flex;
          flex-direction: column;
        }

        .chart-card:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .chart-title {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 12px;
          color: #374151;
        }

        .chart-wrapper {
          width: 100%;
          flex-grow: 1;
          position: relative;
        }

        .bottom-section {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 24px;
          align-items: start;
        }

        .progress-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .circular-progress-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          height: 100%;
        }

        .circular-progress-svg {
          transform: rotate(-90deg);
        }

        .circular-progress-text {
          margin-top: 8px;
          text-align: center;
        }

        .circular-progress-percentage {
          font-size: 18px;
          font-weight: bold;
          color: #1f2937;
        }

        .circular-progress-label {
          font-size: 12px;
          color: #6b7280;
          margin-top: 4px;
        }

        .table-section {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .table-header {
          padding: 16px 24px;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .table-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .table-container {
          overflow: auto;
          flex-grow: 1;
          max-height: 300px;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .table-head {
          background: #f9fafb;
        }

        .table-head th {
          padding: 12px 24px;
          text-align: left;
          font-size: 11px;
          font-weight: 500;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid #e5e7eb;
        }

        .table-body tr {
          transition: background-color 0.2s ease;
          height: 20px;
        }

        .table-body tr:not(:last-child) {
          border-bottom: 1px solid #e5e7eb;
        }

        .table-body tr:hover {
          background-color: #f9fafb;
        }

        .table-body td {
          padding: 8px 16px;
          font-size: 13px;
          color: #1f2937;
          white-space: nowrap;
        }

        .table-body tr:last-child td {
          border-bottom: none;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .charts-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          }
          
          .bottom-section {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .progress-section {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 768px) {
          .charts-grid {
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          }
          
          .dashboard-container {
            padding: 12px;
          }
        }

        @media (max-width: 480px) {
          .charts-grid {
            grid-template-columns: 1fr;
          }
          
          .chart-card {
            padding: 12px;
          }
          
          .progress-section {
            grid-template-columns: 1fr;
          }
          
          .table-head th,
          .table-body td {
            padding: 8px 12px;
            font-size: 12px;
          }
        }
      `}</style>

      <div className="dashboard-container">
        {/* 4 Small Graphs in a Row */}
        <div className="charts-grid">
          {/* Line Chart */}
          <div className="chart-card">
            <h3 className="chart-title">Revenue Trend</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 5, right: 5, left: 5, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                  />
                  <YAxis hide />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ fill: '#8884d8', strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="chart-card">
            <h3 className="chart-title">Order Volume</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 5, right: 5, left: 5, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                  />
                  <YAxis hide />
                  <Tooltip />
                  <Bar dataKey="value" fill="#82ca9d" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="chart-card">
            <h3 className="chart-title">Traffic Sources</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Simple Gauge Chart (Custom Implementation) */}
       <div className="chart-card">
            <h3 className="chart-title">Performance</h3>
            <div className="chart-wrapper">
              <MuiGauge value={75} />
            </div>
          </div>
        </div>

        {/* Bottom Section with Circular Progress and Table */}
        <div className="bottom-section">
          <div className="progress-section">
            <CircularProgress percentage={95} label="User Performance" color="#d1ce04ff" />
            <CircularProgress percentage={100} label="Customer Satisfaction" color="#0c8039ff" />
          </div>

          {/* Order Status Table */}
          <div className="table-section">
            <div className="table-header">
              <h3 className="table-title">Today Activity</h3>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead className="table-head">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>State</th>
                    <th>Country</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {orderData.map((order, index) => (
                    <tr key={index}>
                      <td>{order.id}</td>
                      <td>{order.name}</td>
                      <td>{order.state}</td>
                      <td>{order.country}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;