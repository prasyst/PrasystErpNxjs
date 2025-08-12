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




'use client'
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const Charts = () => {
  const revenueChartRef = useRef(null);
  const ordersChartRef = useRef(null);
  const chartInstances = useRef({ revenue: null, orders: null });
  
  useEffect(() => {
  // Cleanup previous charts
  const currentChartInstances = chartInstances.current;
  return () => {
    if (currentChartInstances.revenue) {
      currentChartInstances.revenue.destroy();
    }
    if (currentChartInstances.orders) {
      currentChartInstances.orders.destroy();
    }
  };
}, []);

  useEffect(() => {
    if (revenueChartRef.current && ordersChartRef.current) {
      // Revenue Chart
      const revenueCtx = revenueChartRef.current.getContext('2d');
      if (chartInstances.current.revenue) {
        chartInstances.current.revenue.destroy();
      }
      chartInstances.current.revenue = new Chart(revenueCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Revenue',
            data: [5000, 8000, 6000, 9000, 11000, 12000],
            borderColor: 'var(--primary)',
            backgroundColor: 'rgba(72, 126, 176, 0.1)',
            tension: 0.4,
            fill: true,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'var(--border-color)',
              },
              ticks: {
                color: 'var(--text-color)',
              }
            },
            x: {
              grid: {
                color: 'var(--border-color)',
              },
              ticks: {
                color: 'var(--text-color)',
              }
            }
          }
        }
      });

      // Orders Chart
      const ordersCtx = ordersChartRef.current.getContext('2d');
      if (chartInstances.current.orders) {
        chartInstances.current.orders.destroy();
      }
      chartInstances.current.orders = new Chart(ordersCtx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Orders',
            data: [120, 190, 150, 220, 250, 280],
            backgroundColor: 'var(--secondary)',
            borderRadius: 6,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'var(--border-color)',
              },
              ticks: {
                color: 'var(--text-color)',
              }
            },
            x: {
              grid: {
                color: 'var(--border-color)',
              },
              ticks: {
                color: 'var(--text-color)',
              }
            }
          }
        }
      });
    }
  }, []);

  // Resize charts when container size changes
  useEffect(() => {
    const handleResize = () => {
      if (chartInstances.current.revenue) {
        chartInstances.current.revenue.resize();
      }
      if (chartInstances.current.orders) {
        chartInstances.current.orders.resize();
      }
    };

    // Listen for window resize and transitions
    window.addEventListener('resize', handleResize);
    const timeout = setTimeout(handleResize, 300); // Handle sidebar transition

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div 
      className="flex flex-col lg:flex-row gap-6 w-full h-full transition-all duration-300"
      style={{
        minHeight: '400px',
      }}
    >
      {/* Revenue Chart */}
      <div 
        className="bg-card-bg p-6 rounded-lg shadow transition-all duration-300"
        style={{
          position: 'relative',
          minHeight: '350px',
          maxHeight: '400px',
          width: '100%',
          flex: '1 1 50%' // Equal width for both charts
        }}
      >
        <h3 className="mb-4 font-semibold text-lg">Revenue Overview</h3>
        <canvas 
          ref={revenueChartRef} 
          style={{
            width: '100%',
            height: 'calc(100% - 60px)',
            maxHeight: '400px'
          }}
        ></canvas>
      </div>
      
      {/* Orders Chart */}
      <div 
        className="bg-card-bg p-6 rounded-lg shadow transition-all duration-300"
        style={{
          position: 'relative',
          minHeight: '350px',
          maxHeight: '400px',
          width: '100%',
          flex: '1 1 50%' // Equal width for both charts
        }}
      >
        <h3 className="mb-4 font-semibold text-lg">Orders Overview</h3>
        <canvas 
          ref={ordersChartRef}
          style={{
            width: '100%',
            height: 'calc(100% - 60px)',
            maxHeight: '400px'
          }}
        ></canvas>
      </div>
    </div>
  );
};

export default Charts;