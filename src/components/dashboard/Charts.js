// 'use client'
// import { useEffect, useRef } from 'react';
// import Chart from 'chart.js/auto';

// const Charts = () => {
//   const revenueChartRef = useRef(null);
//   const ordersChartRef = useRef(null);
//   const chartInstances = useRef({ revenue: null, orders: null });
  
//   useEffect(() => {
//     // Cleanup previous charts
//     return () => {
//       if (chartInstances.current.revenue) {
//         chartInstances.current.revenue.destroy();
//       }
//       if (chartInstances.current.orders) {
//         chartInstances.current.orders.destroy();
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (revenueChartRef.current && ordersChartRef.current) {
//       // Revenue Chart
//       const revenueCtx = revenueChartRef.current.getContext('2d');
//       if (chartInstances.current.revenue) {
//         chartInstances.current.revenue.destroy();
//       }
//       chartInstances.current.revenue = new Chart(revenueCtx, {
//         type: 'line',
//         data: {
//           labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//           datasets: [{
//             label: 'Revenue',
//             data: [5000, 8000, 6000, 9000, 11000, 12000],
//             borderColor: 'var(--primary)',
//             backgroundColor: 'rgba(72, 126, 176, 0.1)',
//             tension: 0.4,
//             fill: true,
//           }]
//         },
//         options: {
//           responsive: true,
//           maintainAspectRatio: false,
//           plugins: {
//             legend: {
//               position: 'top',
//             },
//           },
//           scales: {
//             y: {
//               beginAtZero: true,
//               grid: {
//                 color: 'var(--border-color)',
//               },
//               ticks: {
//                 color: 'var(--text-color)',
//               }
//             },
//             x: {
//               grid: {
//                 color: 'var(--border-color)',
//               },
//               ticks: {
//                 color: 'var(--text-color)',
//               }
//             }
//           }
//         }
//       });

//       // Orders Chart
//       const ordersCtx = ordersChartRef.current.getContext('2d');
//       if (chartInstances.current.orders) {
//         chartInstances.current.orders.destroy();
//       }
//       chartInstances.current.orders = new Chart(ordersCtx, {
//         type: 'bar',
//         data: {
//           labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//           datasets: [{
//             label: 'Orders',
//             data: [120, 190, 150, 220, 250, 280],
//             backgroundColor: 'var(--secondary)',
//             borderRadius: 6,
//           }]
//         },
//         options: {
//           responsive: true,
//           maintainAspectRatio: false,
//           plugins: {
//             legend: {
//               position: 'top',
//             },
//           },
//           scales: {
//             y: {
//               beginAtZero: true,
//               grid: {
//                 color: 'var(--border-color)',
//               },
//               ticks: {
//                 color: 'var(--text-color)',
//               }
//             },
//             x: {
//               grid: {
//                 color: 'var(--border-color)',
//               },
//               ticks: {
//                 color: 'var(--text-color)',
//               }
//             }
//           }
//         }
//       });
//     }
//   }, []);

//   return (
    
//     <div 
//       className="grid grid-cols-1 md:grid-cols-2 gap-4"
//       style={{
//         width: '100%',
//         height: '100%',
//       }}
//     >
//       <div 
//         className="bg-card-bg p-6 rounded-lg shadow"
//         style={{
//           position: 'relative',
//           height: '300px',
//           width: '100%'
//         }}
//       >
//         <h3 className="mb-4 font-semibold">Revenue Overview</h3>
//         <canvas 
//           ref={revenueChartRef} 
//           style={{
//             width: '100%',
//             height: '100%'
//           }}
//         ></canvas>
//       </div>
      
//       <div 
//         className="bg-card-bg p-6 rounded-lg shadow"
//         style={{
//           position: 'relative',
//           height: '300px',
//           width: '100%'
//         }}
//       >
//         <h3 className="mb-4 font-semibold">Orders Overview</h3>
//         <canvas 
//           ref={ordersChartRef}
//           style={{
//             width: '100%',
//             height: '100%'
//           }}
//         ></canvas>
//       </div>
//     </div>
    
//   );
// };

// export default Charts;
import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import {
  GaugeContainer,
  GaugeValueArc,
  GaugeReferenceArc,
  useGaugeState,
} from '@mui/x-charts/Gauge';

const Dashboard = () => {
  // Sample data for charts
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

  // MUI Gauge Component
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

        .gauge-wrapper {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
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
    max-height: 300px; /* Adjust this value as needed */
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
    height: 20px; /* Reduced row height */
  }

  .table-body tr:not(:last-child) {
    border-bottom: 1px solid #e5e7eb;
  }
        .table-body tr:hover {
          background-color: #f9fafb;
        }

        .table-body td {
    padding: 8px 16px; /* Reduced padding */
    font-size: 13px; /* Slightly smaller font */
    color: #1f2937;
    white-space: nowrap;
  }

  /* Remove the bottom border from the last row */
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
                <LineChart data={lineData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={false}
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
                <BarChart data={barData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <Bar dataKey="value" fill="#82ca9d" />
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
                    outerRadius={50}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* MUI Gauge Chart */}
          <div className="chart-card">
            <h3 className="chart-title">Performance</h3>
            <div className="chart-wrapper">
              <MuiGauge value={75} />
            </div>
          </div>
        </div>

        {/* Bottom Section with Circular Progress and Table */}
        <div className="bottom-section">
          {/* Circular Progress Bars Section */}
          <div className="progress-section">
            <CircularProgress percentage={85} label="Sales Target" color="#8884d8" />
            <CircularProgress percentage={92} label="Customer Satisfaction" color="#82ca9d" />
          </div>

          {/* Order Status Table */}
         {/* Order Status Table */}
<div className="table-section">
  <div className="table-header">
    <h3 className="table-title">Order Status</h3>
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