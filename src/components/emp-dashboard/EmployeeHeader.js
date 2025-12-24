'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from "next/navigation";
import { MdMenu, MdNotifications, MdHelp } from 'react-icons/md';
import { IoIosSearch, IoIosTime } from "react-icons/io";
import { useRecentPaths } from '../../app/context/RecentPathsContext';

const EmployeeHeader = ({ isSidebarCollapsed, onMenuToggle, isMobile }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isRecentlyVisitedOpen, setIsRecentlyVisitedOpen] = useState(false);
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const recentlyVisitedRef = useRef(null);
  const { recentPaths, clearRecentPaths, removeRecentPath } = useRecentPaths();
  
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New ticket assigned to you', time: '5 min ago', read: false, type: 'ticket' },
    { id: 2, text: 'Your ticket #TKT-1234 has been resolved', time: '1 hour ago', read: false, type: 'ticket' },
    { id: 3, text: 'System maintenance scheduled', time: '2 hours ago', read: true, type: 'system' }
  ]);

  useEffect(() => {
    const storedName = localStorage.getItem('EMP_NAME') || localStorage.getItem('USER_NAME');
    const storedRole = localStorage.getItem('userRole');
    if (storedName) {
      const name=storedName.length>3 ? storedName.substring(0,11) + '..' :storedName
      setUserName(name);
    }
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }

      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }

      if (recentlyVisitedRef.current && !recentlyVisitedRef.current.contains(event.target)) {
        setIsRecentlyVisitedOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getInitial = (name) => name?.charAt(0)?.toUpperCase() || 'E';

  const handleLogout = () => {
    localStorage.removeItem('authenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('EMP_KEY');
    localStorage.removeItem('EMP_NAME');
    localStorage.removeItem('FCYR_KEY');
    router.push("/login");
  };

  const handleProfile = () => {
    router.push("/employee-profile");
    setIsDropdownOpen(false);
  };

  const handleChangePassword = () => {
    router.push("/employee-change-password");
    setIsDropdownOpen(false);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setIsNotificationsOpen(false);
  };

  const getUnreadNotificationCount = () => {
    return notifications.filter(notif => !notif.read).length;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ticket': return '🎫';
      case 'system': return '⚙️';
      default: return '🔔';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const handleRecentPathClick = (path) => {
    window.open(path, '_blank');
    setIsRecentlyVisitedOpen(false);
  };

  return (
    <header
      style={{
        backgroundColor: '#1b69e7',
        padding: isMobile ? '0.2rem 0.8rem' : '0.2rem 1.5rem',
        position: 'fixed',
        top: 0,
        right: 0,
        left: isMobile ? '0' : (isSidebarCollapsed ? '80px' : '250px'),
        zIndex: 50,
        borderBottom: '1px solid #e0e0e0',
        transition: 'left 0.3s ease, padding 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}
    >

      <div className="flex items-center gap-3 md:gap-4" style={{ flex: 1 }}>
        {isMobile && (
          <button
            onClick={onMenuToggle}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              transition: 'background-color 0.2s ease',
            }}
            className="hover:bg-white hover:bg-opacity-10 active:bg-opacity-20"
            aria-label="Toggle menu"
          >
            <MdMenu size={24} />
          </button>
        )}

      </div>

      <div className="flex items-center gap-2 md:gap-3" style={{ flexShrink: 0 }}>
        {/* Recently Visited Button */}
       
        <div
          ref={dropdownRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '0.5rem' : '0.75rem',
            cursor: 'pointer',
            position: 'relative',
            padding: '0.25rem 0.5rem',
            borderRadius: '2rem',
            transition: 'background-color 0.2s ease',
            flexShrink: 0,
          }}
          className="hover:bg-white hover:bg-opacity-10"
          onClick={() => {
            setIsDropdownOpen(!isDropdownOpen);
            setIsNotificationsOpen(false);
            setIsRecentlyVisitedOpen(false);
          }}
        >
          <div
            style={{
              width: isMobile ? '32px' : '36px',
              height: isMobile ? '32px' : '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              transition: 'all 0.2s ease',
            }}
            className="hover:bg-opacity-30"
          >
            {getInitial(userName)}
          </div>

          {/* User name and role - Desktop view */}
          {!isMobile && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              lineHeight: '1.3',
              maxWidth: '150px',
            }}>
              <span style={{
                color: 'white',
                fontWeight: '600',
                fontSize: '0.9rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {userName || 'Employee'}
                <span style={{
                  marginLeft: '4px',
                  fontWeight: '500',
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '0.8rem',
                  padding: '0.1rem 0.3rem',
                  borderRadius: '4px',
                }}>
                  ({userRole || 'Employee'})
                </span>
              </span>
            </div>
          )}

          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            style={{
              transition: 'transform 0.2s ease',
              transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
            }}
          >
            <path d="M3 4.5L6 7.5L9 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          {isDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              width: isMobile ? '160px' : '180px',
              zIndex: 1000,
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              marginTop: '0.15rem',
              overflow: 'hidden',
            }}>
              <div style={{
                padding: '1rem',
                backgroundColor: '#f8fbff',
                borderBottom: '1px solid #e8f0fe',
              }}>
                <div style={{
                  fontWeight: '600',
                  color: '#333',
                  fontSize: '0.95rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {userName || 'Employee'}
                  <span style={{
                    marginLeft: '0.4rem',
                    fontWeight: '500',
                    fontSize: '0.85rem',
                    color: '#1b69e7',
                  }}>
                    ({userRole || 'Employee'})
                  </span>
                </div>
              </div>

              <div style={{ padding: '0.1rem 0' }}>
                <button
                  onClick={handleProfile}
                  style={{
                    width: '100%',
                    padding: '0.3rem 1rem',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    color: '#333',
                    transition: 'background-color 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                  className="hover:bg-gray-50"
                >
                  <span>👤</span>
                  <span>My Profile</span>
                </button>

                <button
                  onClick={handleChangePassword}
                  style={{
                    width: '100%',
                    padding: '0.3rem 1rem',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    color: '#333',
                    transition: 'background-color 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                  className="hover:bg-gray-50"
                >
                  <span>🔒</span>
                  <span>Change Password</span>
                </button>
                
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '0.3rem 1rem',
                    marginBottom:'3px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    color: '#e74c3c',
                    transition: 'background-color 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontWeight: '500',
                  }}
                  className="hover:bg-red-50"
                >
                  <span>🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default EmployeeHeader;