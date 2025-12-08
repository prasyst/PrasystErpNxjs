'use client';

import { useEffect, useState, useRef } from 'react';
import { useTheme } from '../../../src/app/context/ThemeContext';
import { IoIosSearch, IoIosPin, IoIosTime } from "react-icons/io";
import { useRouter } from "next/navigation";
import { MdPushPin, MdMenu, MdClose, MdNotifications, MdSettings, MdHelp, MdHistory } from 'react-icons/md';
import { usePin } from '../../app/hooks/usePin';
import { getAllMenuItemsWithPaths, getIconComponent } from './menuData';
import Link from 'next/link';
import ReportIcon from '@mui/icons-material/Report';
import axiosInstance from '@/lib/axios';
import { useRecentPaths } from '../../../src/app/context/RecentPathsContext';

const Header = ({ isSidebarCollapsed, onMenuToggle, isMobile }) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false);
  const [isRecentlyVisitedOpen, setIsRecentlyVisitedOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [branchName, setBranchName] = useState('');
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const settingsRef = useRef(null);
  const recentlyVisitedRef = useRef(null);
  const { pinnedModules, unpinModule } = usePin();
  const [showUnpinConfirm, setShowUnpinConfirm] = useState(null);
  const { recentPaths, clearRecentPaths, removeRecentPath } = useRecentPaths();
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New ticket assigned to you', time: '5 min ago', read: false, type: 'ticket' },
    { id: 2, text: 'Inventory stock running low', time: '1 hour ago', read: false, type: 'inventory' },
    { id: 3, text: 'Monthly report is ready', time: '2 hours ago', read: true, type: 'report' }
  ]);

  const searchableItems = getAllMenuItemsWithPaths();

  useEffect(() => {
    const storedName = localStorage.getItem('USER_NAME');
    const storedRole = localStorage.getItem('userRole');
    if (storedName) {
      setUserName(storedName);
    }
    if (storedRole) {
      setUserRole(storedRole);
    }

    fetchCompanyAndBranchNames();
  }, []);

  const fetchCompanyAndBranchNames = async () => {
    try {
      const coId = localStorage.getItem('CO_ID');
      const cobrId = localStorage.getItem('COBR_ID');

      if (coId && cobrId) {
        const companyResponse = await axiosInstance.post('COMPANY/Getdrpcofill', {
          CO_ID: "",
          Flag: ""
        });

        if (companyResponse.data?.STATUS === 0 && Array.isArray(companyResponse.data.DATA)) {
          const company = companyResponse.data.DATA.find(c => c.CO_ID === coId);
          if (company) {
            setCompanyName(company.CO_NAME);
          }
        }

        const branchResponse = await axiosInstance.post('COMPANY/Getdrpcobrfill', {
          COBR_ID: "",
          CO_ID: coId,
          Flag: ""
        });

        if (branchResponse.data?.STATUS === 0 && Array.isArray(branchResponse.data.DATA)) {
          const branch = branchResponse.data.DATA.find(b => b.COBR_ID === cobrId);
          if (branch) {
            setBranchName(branch.COBR_NAME);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching company/branch names:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }

      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }

      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }

      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsQuickSettingsOpen(false);
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

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      const results = searchableItems.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults(searchableItems.slice(0, 8));
      setShowSearchResults(true);
    }
  };

  const handleSearchResultClick = (path) => {
    setSearchQuery('');
    setShowSearchResults(false);
    setIsSearchExpanded(false);
    window.open(path, '_blank');
  };

  const handleSearchIconClick = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setSearchResults(searchableItems.slice(0, 8));
      setShowSearchResults(true);
      setTimeout(() => {
        const input = searchRef.current?.querySelector('input');
        input?.focus();
      }, 300);
    } else {
      setShowSearchResults(false);
      setSearchQuery('');
    }
  };

  const getInitial = (name) => name?.charAt(0)?.toUpperCase() || 'U';

  const handleLogout = () => {
    localStorage.removeItem('authenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('CO_ID');
    localStorage.removeItem('COBR_ID');
    localStorage.removeItem('PARTY_NAME');
    localStorage.removeItem('PARTY_KEY');
    localStorage.removeItem('FCYR_KEY');
    localStorage.removeItem('USER_NAME');
    router.push("/login");
  };

  const handleProfile = () => {
    router.push("/profile");
    setIsDropdownOpen(false);
  };

  const handleChangePassword = () => {
    router.push("/change-password");
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
      case 'inventory': return '📦';
      case 'report': return '📊';
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
    // Open in new tab
    window.open(path, '_blank');
    setIsRecentlyVisitedOpen(false);
  };

  return (
    <header
      style={{
        backgroundColor: '#635bff',
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

      <div className="flex items-center gap-3 md:gap-4">
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

        <div
          ref={searchRef}
          className="flex items-center relative"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '2rem',
            padding: '0.5rem',
            overflow: 'visible',
            border: isSearchExpanded ? '2px solid rgba(255, 255, 255, 0.8)' : '2px solid transparent',
            transition: 'all 0.3s ease-out',
            width: isSearchExpanded ? (isMobile ? '200px' : '320px') : '40px',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          <button
            onClick={handleSearchIconClick}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              minWidth: '30px',
              height: '20px',
              transition: 'transform 0.3s ease',
              transform: isSearchExpanded ? 'scale(1.1)' : 'scale(1)',
            }}
            aria-label={isSearchExpanded ? "Collapse search" : "Expand search"}
          >
            <IoIosSearch size={20} />
          </button>

          <input
            type="text"
            placeholder="Search modules, features..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setShowSearchResults(true)}
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'white',
              marginLeft: '0.5rem',
              width: isSearchExpanded ? '100%' : '0',
              padding: isSearchExpanded ? '0.25rem 0' : '0',
              opacity: isSearchExpanded ? 1 : 0,
              transition: 'all 0.3s ease-out',
              fontSize: '0.9rem',
              lineHeight: '1.2',
            }}
            className="placeholder:text-white placeholder:text-opacity-80"
          />

          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && isSearchExpanded && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              marginTop: '0.75rem',
              maxHeight: '400px',
              overflowY: 'auto',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              zIndex: 1000,
            }}>
              <div style={{
                padding: '0.75rem 1rem',
                borderBottom: '1px solid #f0f0f0',
                fontSize: '0.8rem',
                fontWeight: '600',
                color: '#666',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Quick Navigation
              </div>
              {searchResults.map((item, index) => {
                const IconComponent = getIconComponent(item.icon);

                return (
                  <div
                    key={index}
                    onClick={() => handleSearchResultClick(item.path)}
                    style={{
                      padding: '0.4rem 1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      borderBottom: index < searchResults.length - 1 ? '1px solid #f8f8f8' : 'none',
                      transition: 'background-color 0.2s ease',
                      backgroundColor: '#fff',
                    }}
                    className="hover:bg-gray-50 active:bg-gray-100"
                  >
                    {IconComponent && (
                      <span style={{
                        marginRight: '0.875rem',
                        color: '#635bff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '20px',
                      }}>
                        <IconComponent size={16} />
                      </span>
                    )}
                    <span style={{
                      fontSize: '0.9rem',
                      color: '#333',
                      fontWeight: '500',
                      flex: 1,
                    }}>
                      {item.name}
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      color: '#999',
                      backgroundColor: '#f5f5f5',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                    }}>
                      Module
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {showSearchResults && searchResults.length === 0 && searchQuery.length > 0 && isSearchExpanded && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              marginTop: '0.75rem',
              padding: '2rem 1rem',
              textAlign: 'center',
              color: '#666',
              fontSize: '0.9rem',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              zIndex: 1000,
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔍</div>
              No results found for {searchQuery}
              <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>
                Try different keywords
              </div>
            </div>
          )}
        </div>

        {/* Company and Branch Name Display */}
        {!isMobile && (companyName || branchName) && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              marginLeft: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              maxWidth: '300px',
            }}
          >
            {branchName && (
              <span
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '1rem',
                  lineHeight: '1.2',
                  marginTop: '0.1rem',
                  whiteSpace: 'nowrap',
                  fontWeight: '600',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100%',
                }}
                title={branchName}
              >
                {branchName}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Recently Visited Button */}
        {!isMobile && (
          <div ref={recentlyVisitedRef} style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setIsRecentlyVisitedOpen(!isRecentlyVisitedOpen);
                setIsNotificationsOpen(false);
                setIsDropdownOpen(false);
              }}
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
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
              className="hover:bg-white hover:bg-opacity-10 active:bg-opacity-20"
              title={`Recently Visited (${recentPaths.length})`}
            >
              <IoIosTime size={20} />
              {/* Red notification badge for recently visited count */}
              {recentPaths.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  backgroundColor: '#ff4757',
                  color: 'white',
                  borderRadius: '50%',
                  width: '15px',
                  height: '15px',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  // border: '2px solid #635bff',
                  // boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.8)',
                }}>
                  {recentPaths.length}
                </span>
              )}
            </button>

            {isRecentlyVisitedOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                width: '280px',
                maxHeight: '400px',
                zIndex: 1000,
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                marginTop: '0.5rem',
              }}>
                <div style={{
                  padding: '1rem',
                  borderBottom: '1px solid #f0f0f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span style={{ fontWeight: '600', color: '#333' }}>
                    Recently Visited
                    {recentPaths.length > 0 && (
                      <span style={{
                        marginLeft: '0.5rem',
                        fontSize: '0.8rem',
                        backgroundColor: '#635bff',
                        color: 'white',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '10px',
                        fontWeight: '500',
                      }}>
                        {recentPaths.length}
                      </span>
                    )}
                  </span>
                  {recentPaths.length > 0 && (
                    <button
                      onClick={clearRecentPaths}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#635bff',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        fontWeight: '500',
                      }}
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {recentPaths.length > 0 ? (
                    recentPaths.map((item, index) => (
                      <div
                        key={item.id}
                        style={{
                          padding: '0.75rem 1rem',
                          borderBottom: index < recentPaths.length - 1 ? '1px solid #f8f8f8' : 'none',
                          cursor: 'pointer',
                          backgroundColor: '#fff',
                          transition: 'background-color 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                        className="hover:bg-gray-50"
                        onClick={() => handleRecentPathClick(item.path)}
                        title={`Click to open "${item.name}" in new tab`}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                          <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            backgroundColor: '#f0f2ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#635bff',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                          }}>
                            {index + 1}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{
                              fontSize: '0.9rem',
                              color: '#333',
                              fontWeight: '500',
                              lineHeight: '1.4',
                              marginBottom: '0.2rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                            }}>
                              {item.name}
                              <span style={{
                                fontSize: '0.7rem',
                                color: '#999',
                                marginLeft: 'auto',
                              }}>
                                {formatTimeAgo(item.timestamp)}
                              </span>
                            </div>
                            {/* Time ago indicator */}
                            <div style={{
                              fontSize: '0.7rem',
                              color: '#999',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                            }}>
                              <span style={{
                                fontSize: '0.6rem',
                                color: '#635bff',
                                backgroundColor: '#f0f2ff',
                                padding: '0.1rem 0.4rem',
                                borderRadius: '4px',
                                fontWeight: '500',
                              }}>
                                New Tab
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeRecentPath(item.id);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#999',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            padding: '0.25rem',
                            borderRadius: '4px',
                            transition: 'all 0.2s ease',
                          }}
                          className="hover:bg-gray-100 hover:text-red-500"
                          title="Remove from history"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  ) : (
                    <div style={{
                      padding: '2rem 1rem',
                      textAlign: 'center',
                      color: '#999',
                      fontSize: '0.9rem',
                    }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#ccc' }}>
                        <IoIosTime />
                      </div>
                      No recent visits
                      <div style={{ fontSize: '0.8rem', color: '#ccc', marginTop: '0.5rem' }}>
                        Visit pages to see them here
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Footer with info */}
                {recentPaths.length > 0 && (
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderTop: '1px solid #f0f0f0',
                    fontSize: '0.75rem',
                    color: '#999',
                    textAlign: 'center',
                    backgroundColor: '#f9f9f9',
                    borderBottomLeftRadius: '12px',
                    borderBottomRightRadius: '12px',
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                      <span style={{ color: '#635bff' }}>ℹ️</span>
                      Click any item to open in new tab
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {!isMobile && (
          <Link href="/pinned-modules" passHref>
            <button
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
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
              className="hover:bg-white hover:bg-opacity-10 active:bg-opacity-20"
              title="Pinned Modules"
            >
              <MdPushPin size={20} />
            </button>
          </Link>
        )}
        {!isMobile && (
          <Link href="/analytics" passHref>
            <button
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
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
              className="hover:bg-white hover:bg-opacity-10 active:bg-opacity-20"
              title="Analytics"
            >
              <ReportIcon size={20} />
            </button>
          </Link>
        )}

        <div ref={notificationsRef} style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsRecentlyVisitedOpen(false);
              setIsDropdownOpen(false);
            }}
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
              transition: 'all 0.2s ease',
              position: 'relative',
            }}
            className="hover:bg-white hover:bg-opacity-10 active:bg-opacity-20"
            aria-label="Notifications"
          >
            <MdNotifications size={20} />
            {getUnreadNotificationCount() > 0 && (
              <span style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                backgroundColor: '#ff4757',
                color: 'white',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #635bff',
              }}>
                {getUnreadNotificationCount()}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              width: '320px',
              maxHeight: '400px',
              zIndex: 1000,
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              marginTop: '0.5rem',
            }}>
              <div style={{
                padding: '1rem',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ fontWeight: '600', color: '#333' }}>Notifications</span>
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#635bff',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      fontWeight: '500',
                    }}
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      style={{
                        padding: '0.875rem 1rem',
                        borderBottom: '1px solid #f8f8f8',
                        cursor: 'pointer',
                        backgroundColor: notification.read ? '#fff' : '#f8fbff',
                        transition: 'background-color 0.2s ease',
                      }}
                      className="hover:bg-gray-50"
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.2rem' }}>
                          {getNotificationIcon(notification.type)}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontSize: '0.9rem',
                            color: '#333',
                            fontWeight: notification.read ? '400' : '500',
                            lineHeight: '1.4',
                          }}>
                            {notification.text}
                          </div>
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#999',
                            marginTop: '0.25rem',
                          }}>
                            {notification.time}
                          </div>
                        </div>
                        {!notification.read && (
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: '#635bff',
                            marginTop: '0.5rem',
                          }} />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{
                    padding: '2rem 1rem',
                    textAlign: 'center',
                    color: '#999',
                    fontSize: '0.9rem',
                  }}>
                    No notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div
          ref={dropdownRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            position: 'relative',
            padding: '0.25rem 0.5rem',
            borderRadius: '2rem',
            transition: 'background-color 0.2s ease',
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
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              fontSize: '0.9rem',
              transition: 'all 0.2s ease',
            }}
            className="hover:bg-opacity-30"
          >
            {getInitial(userName)}
          </div>

          {!isMobile && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              lineHeight: '1.3'
            }}>
              <span style={{
                color: 'white',
                fontWeight: '600',
                fontSize: '0.9rem',
              }}>
                {userName || 'User'}
                {userRole && (
                  <span style={{
                    marginLeft: '0px',
                    fontWeight: '500',
                    color: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '0.88rem',
                    padding: '0.15rem 0.1rem',
                    borderRadius: '6px',
                    backdropFilter: 'blur(4px)',
                  }}>
                    ({userRole})
                  </span>
                )}
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
              top: '90%',
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              width: '170px',
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
                }}>
                  {userName || 'User'}
                  {userRole && (
                    <span style={{
                      marginLeft: '0.4rem',
                      fontWeight: '500',
                      fontSize: '0.85rem',
                      color: '#635bff',
                    }}>
                      ({userRole})
                    </span>
                  )}
                </div>
              </div>

              <div style={{ padding: '0.1rem 0' }}>
                <button
                  onClick={handleProfile}
                  style={{
                    width: '90%',
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

      {showUnpinConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📌</div>
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem', color: '#333' }}>Unpin Module</h3>
            <p style={{ color: '#666', lineHeight: '1.5' }}>
              Are you sure you want to unpin <strong>{showUnpinConfirm.name}</strong> from your quick access?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                onClick={() => setShowUnpinConfirm(null)}
                style={{
                  padding: '0.6rem 1.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: '#f8f9fa',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                }}
                className="hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  unpinModule(showUnpinConfirm.id);
                  setShowUnpinConfirm(null);
                }}
                style={{
                  padding: '0.6rem 1.5rem',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#ff4757',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                }}
                className="hover:bg-red-600"
              >
                Yes, Unpin It
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;