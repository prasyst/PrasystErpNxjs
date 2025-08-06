'use client'

import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from '../../../src/app/context/ThemeContext';
import { 
  MdDashboard, 
  MdSearch, 
  MdShoppingCart, 
  MdInventory, 
  MdPeople, 
  MdAnalytics, 
  MdSettings,
  MdMenu,
  MdClose
} from 'react-icons/md';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { theme } = useTheme();

  const menuItems = [
    { name: 'Dashboard', icon: MdDashboard, path: '/' },
    // { name: 'Stock Enquiry', icon: MdSearch, path: '/dashboard/stock-enquiry-table' },
    { name: 'Orders', icon: MdShoppingCart, path: '/order' },
    { name: 'Products', icon: MdInventory, path: '/products' },
    { name: 'Customers', icon: MdPeople, path: '/customers' },
    { name: 'Reports', icon: MdAnalytics, path: '/reports' },
    { name: 'Settings', icon: MdSettings, path: '/settings' },
  ];

  return (
    <div 
      className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}
      style={{
        backgroundColor: 'var(--sidebar-bg)',
        color: 'var(--sidebar-text)',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        width: isCollapsed ? '80px' : '250px',
        transition: 'width 0.3s ease',
        padding: '1rem',
        overflow: 'hidden',
        zIndex: 1000,
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        padding: '0.5rem',
      }}>
        {!isCollapsed && (
          <h2 style={{ 
            fontSize: '1.25rem',
            fontWeight: 'bold',
            margin: 0,
            whiteSpace: 'nowrap'
          }}>
            StockDash
          </h2>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            fontSize: '1.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            marginLeft: !isCollapsed ? 'auto' : 0,
          }}
          className="hover:bg-opacity-20 hover:bg-white"
        >
          {isCollapsed ? <MdMenu size={20} /> : <MdClose size={20} />}
        </button>
      </div>

      <ul style={{ 
        listStyle: 'none',
        padding: 0,
        margin: 0,
      }}>
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <li key={index} style={{ marginBottom: '0.5rem' }}>
              <Link 
                href={item.path} 
                passHref
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.75rem 0.5rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  className="hover:bg-opacity-20 hover:bg-white"
                >
                  <span style={{ 
                    fontSize: '1.2rem',
                    minWidth: '24px',
                    display: 'flex',
                    justifyContent: 'center',
                    marginRight: isCollapsed ? 0 : '1rem',
                  }}>
                    <IconComponent size={20} />
                  </span>
                  {!isCollapsed && (
                    <span style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {item.name}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;