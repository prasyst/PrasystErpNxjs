'use client'
import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="flex flex-col h-screen">
      <Header isSidebarCollapsed={isCollapsed} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <main 
          className="flex-1 overflow-auto p-4 transition-all duration-300"
          style={{
            marginLeft: isCollapsed ? '80px' : '250px',
            marginTop: '60px',
            width: isCollapsed ? 'calc(100vw - 80px)' : 'calc(100vw - 250px)',
            maxWidth: isCollapsed ? 'calc(100vw - 80px)' : 'calc(100vw - 250px)'
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}