// 'use client'
// import { useState } from 'react';
// import Sidebar from './Sidebar';
// import Header from './Header';

// export default function DashboardLayout({ children }) {
//   const [isCollapsed, setIsCollapsed] = useState(true);

//   return (
//     <div className="flex flex-col h-screen">
//       <Header isSidebarCollapsed={isCollapsed} />
//       <div className="flex flex-1 overflow-hidden">
//         <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
//         <main 
//           className="flex-1 overflow-auto p-4 transition-all duration-300"
//           style={{
//             marginLeft: isCollapsed ? '80px' : '250px',
//             marginTop: '60px',
//             width: isCollapsed ? 'calc(100vw - 80px)' : 'calc(100vw - 250px)',
//             maxWidth: isCollapsed ? 'calc(100vw - 80px)' : 'calc(100vw - 250px)'
//           }}
//         >
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }


'use client'
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
        setIsSidebarOpen(false);
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header 
        isSidebarCollapsed={isCollapsed} 
        onMenuToggle={toggleSidebar}
        isMobile={isMobile}
      />
      <div className="flex flex-1 overflow-hidden relative">
        {isMobile && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeSidebar}
          />
        )}
        
        <Sidebar 
          isCollapsed={isMobile ? false : isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobile={isMobile}
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
        />
        
        <main 
          className="flex-1 overflow-auto p-4 transition-all duration-300 bg-gray-50"
          style={{
            marginLeft: isMobile ? '0' : (isCollapsed ? '80px' : '250px'),
            marginTop: '60px',
            width: isMobile ? '100vw' : (isCollapsed ? 'calc(100vw - 80px)' : 'calc(100vw - 250px)'),
            maxWidth: isMobile ? '100vw' : (isCollapsed ? 'calc(100vw - 80px)' : 'calc(100vw - 250px)')
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}