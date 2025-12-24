'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import {
  MdDashboard, MdAddTask, MdAssignmentTurnedIn, MdSearch, 
  MdCollectionsBookmark, MdHelp, MdClose, MdMenu, MdChevronRight,
  MdPayments, MdReceipt
} from 'react-icons/md';
import { TiTicket } from 'react-icons/ti';
import { useRecentPaths } from '../../app/context/RecentPathsContext';

const EmployeeSidebar = ({ isCollapsed, setIsCollapsed, isMobile, isOpen, onClose }) => {
  const sidebarRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState('');
  const [activeChild, setActiveChild] = useState(null);
  const [activeGrandchild, setActiveGrandchild] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const { addRecentPath } = useRecentPaths();
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const [hasOpenSubmenu, setHasOpenSubmenu] = useState(false);
  const [userName, setUserName] = useState('');
  
  useEffect(() => {
    const storedName = localStorage.getItem('EMP_NAME') || localStorage.getItem('USER_NAME');
    if (storedName) {
      const shortName = storedName.length > 3 ? storedName.substring(0, 11) + '..' : storedName;
      setUserName(shortName);
    }
  }, []);

  const employeeMenuItems = [
    {
      name: 'Ticketing',
      icon: TiTicket,
      path: '/employeepage?activeTab=ticketing',
      children: [
        { 
          name: 'Dashboard', 
          icon: MdReceipt, 
          path: '/emp-tickets/ticket-dashboard' 
        },
        { 
          name: 'Raise Ticket', 
          icon: MdAddTask, 
          path: '/emp-tickets/create-tickets/' 
        },
        { 
          name: 'My Tickets', 
          icon: MdAssignmentTurnedIn, 
          path: '/emp-tickets/all-tickets' 
        },
      ],
    },
  ];

  const handleNavigationWithTracking = (path, name, isGrandchild = false) => {
    if (path && path !== '#') {
      if (isGrandchild) {
        addRecentPath(path, name);
      }
      router.push(path);
      
      if (isMobile && isGrandchild) {
        onClose();
      }
    }
  };

  const toggleSection = (name) => {
    setOpenSections(prev => {
      const newState = { ...prev };
      if (newState[name]) {
        delete newState[name];
      } else {
        newState[name] = true;
      }
      setHasOpenSubmenu(Object.keys(newState).length > 0);
      return newState;
    });
  };

  const handleParentClick = (item, e) => {
    e.stopPropagation();
    setActiveItem(item.name);
    setActiveChild(null);
    setActiveGrandchild(null);
    
    if (item.children && item.children.length > 0) {
      toggleSection(item.name);
    }
    
    if (item.path && item.path !== '#') {
      handleNavigationWithTracking(item.path, item.name, false);
    }
  };

  const handleChildClick = (child, parentName, e) => {
    e.stopPropagation();
    
    setActiveItem(parentName);
    setActiveChild(child.name);
    setActiveGrandchild(null);
    
    if (child.children && child.children.length > 0) {
      toggleSection(child.name);
    }
    
    let targetPath = child.path;

    if (!targetPath || targetPath === '#') {
      if (parentName === 'Ticketing') {
        const ticketingMap = {
          'Dashboard': 'dashboard',
          'Raise Ticket': 'raise-ticket',
          'My Tickets': 'my-tickets',
        };
        const tab = ticketingMap[child.name] || 'ticketing';
        targetPath = `/employeepage?activeTab=${tab}`;
      }
    }
    
    if (targetPath && targetPath !== '#') {
      handleNavigationWithTracking(targetPath, child.name, false);
    }
    
    if (parentName === 'Ticketing') {
      setOpenSections(prev => ({ ...prev, [parentName]: true }));
    }
  };

  const handleGrandchildClick = (grandchild, parentName, childName, e) => {
    e.stopPropagation();
    
    setActiveItem(parentName);
    setActiveChild(childName);
    setActiveGrandchild(grandchild.name);
    
    setOpenSections(prev => ({
      ...prev,
      [parentName]: true,
      [childName]: true
    }));
    
    if (grandchild.path && grandchild.path !== '#') {
      handleNavigationWithTracking(grandchild.path, grandchild.name, true);
    }
    
  };

  useEffect(() => {
    const findActiveItems = () => {
      for (const item of employeeMenuItems) {
        if (item.path && pathname.includes(item.path.split('?')[0])) {
          setActiveItem(item.name);
          setOpenSections(prev => ({ ...prev, [item.name]: true }));
          return true;
        }

        if (item.children) {
          for (const child of item.children) {
            if (child.path && pathname.includes(child.path.split('?')[0])) {
              setActiveItem(item.name);
              setActiveChild(child.name);
              setActiveGrandchild(null);
              setOpenSections(prev => ({ ...prev, [item.name]: true }));
              return true;
            }

            if (child.children) {
              for (const grandchild of child.children) {
                if (grandchild.path && pathname.includes(grandchild.path)) {
                  setActiveItem(item.name);
                  setActiveChild(child.name);
                  setActiveGrandchild(grandchild.name);
                  setOpenSections(prev => ({
                    ...prev,
                    [item.name]: true,
                    [child.name]: true
                  }));
                  return true;
                }
              }
            }
          }
        }
      }
      
  
      if (pathname.startsWith('/employeepage') || pathname.includes('ticket')) {
        const url = new URL(window.location.href);
        const activeTab = url.searchParams.get('activeTab');
        
        if (activeTab) {
          setActiveItem('Ticketing');
          setOpenSections(prev => ({ ...prev, Ticketing: true }));
          
          const tabToChildMap = {
            'dashboard': 'Dashboard',
            'raise-ticket': 'Raise Ticket',
            'my-tickets': 'My Tickets',
          };
          
          setActiveChild(tabToChildMap[activeTab] || null);
          setActiveGrandchild(null);
          return true;
        }

        if (pathname.includes('ticket-dashboard')) {
          setActiveItem('Ticketing');
          setActiveChild('Dashboard');
          setOpenSections(prev => ({ ...prev, Ticketing: true }));
        } else if (pathname.includes('create-tickets')) {
          setActiveItem('Ticketing');
          setActiveChild('Raise Ticket');
          setOpenSections(prev => ({ ...prev, Ticketing: true }));
        } else if (pathname.includes('all-tickets')) {
          setActiveItem('Ticketing');
          setActiveChild('My Tickets');
          setOpenSections(prev => ({ ...prev, Ticketing: true }));
        }
      }
      
      return false;
    };

    findActiveItems();
  }, [pathname]);

  useEffect(() => {
    if (isOpen && isMobile) {
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen, isMobile]);

  const itemMatchesSearch = (item, query) => {
    if (!query.trim()) return true;
    
    const searchLower = query.toLowerCase().trim();
    const itemNameLower = item.name.toLowerCase();
    
    if (itemNameLower.includes(searchLower)) return true;
    
    if (item.children) {
      return item.children.some(child => itemMatchesSearch(child, query));
    }
    
    return false;
  };

  const filterMenuTree = (items, query) => {
    if (!query.trim()) return items.filter(item => item);
    
    return items
      .filter(item => {
        if (!item) return false;
        return itemMatchesSearch(item, query);
      })
      .map(item => {
        if (!item.children || item.children.length === 0) return item;
        
        const filteredChildren = filterMenuTree(item.children, query);
        
        if (filteredChildren.length > 0 || itemMatchesSearch(item, query)) {
          return {
            ...item,
            children: filteredChildren
          };
        }
        
        return item;
      });
  };

  const getFilteredMenuItems = () => {
    if (!searchQuery.trim()) return employeeMenuItems.filter(item => item);
    return filterMenuTree(employeeMenuItems, searchQuery);
  };

  const highlightText = (text, query) => {
    if (!query || !text) return text;
    
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);
    
    if (index === -1) return text;
    
    const before = text.substring(0, index);
    const match = text.substring(index, index + query.length);
    const after = text.substring(index + query.length);
    
    return (
      <>
        {before}
        <span style={{ backgroundColor: '#ffeb3b', fontWeight: 'bold', borderRadius: '2px' }}>{match}</span>
        {after}
      </>
    );
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      const filteredItems = filterMenuTree(employeeMenuItems, value);
      const sectionsToOpen = {};
      
      const collectParents = (items, parent = null) => {
        items.forEach(item => {
          if (!item) return;
          
          if (parent && itemMatchesSearch(item, value)) {
            sectionsToOpen[parent.name] = true;
          }
          
          if (item.children) {
            collectParents(item.children, item);
          }
        });
      };
      
      collectParents(filteredItems);
      setOpenSections(prev => ({ ...prev, ...sectionsToOpen }));
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setOpenSections({});
  };

  const menuItems = getFilteredMenuItems();

  const renderMenu = useCallback((items) => {
    return items
      .filter(item => item)
      .map((item, index) => {
        const IconComponent = item.icon;
        const hasChildren = item.children && item.children.length > 0;
        const isOpen = openSections[item.name] || (searchQuery.trim() && hasChildren);
        const isActive = activeItem === item.name;
        const hasValidPath = item.path && item.path !== '#';

        return (
          <div key={`${item.name}-${index}`}>
            {/* PARENT ITEM */}
            <div
              onClick={(e) => handleParentClick(item, e)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isActive ? '#5ba8ffff' : '#f0f2ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isActive ? '#5ba8ffff' : 'transparent';
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.4rem 0.8rem',
                cursor: 'pointer',
                backgroundColor: isActive ? '#5ba8ffff' : 'transparent',
                color: isActive ? 'white' : '#333',
                transition: 'all 0.2s ease',
                margin: '0.25rem 0.5rem',
                borderRadius: '8px',
                border: isActive ? '1px solid #5ba8ff' : '1px solid transparent',
                borderLeft: isActive ? '4px solid #1b69e7' : '4px solid transparent',
              }}
            >
              {IconComponent && (
                <IconComponent
                  size={20}
                  style={{
                    marginRight: isCollapsed ? 0 : '12px',
                    minWidth: '24px',
                    color: isActive ? 'white' : '#1b69e7',
                  }}
                />
              )}
              {!isCollapsed && (
                <>
                  <span style={{ 
                    flex: 1, 
                    fontWeight: isActive ? 600 : 500,
                  }}>
                    {searchQuery.trim() ? highlightText(item.name, searchQuery) : item.name}
                  </span>
                  {hasChildren && (
                    <MdChevronRight
                      size={18}
                      style={{
                        transform: isOpen ? 'rotate(90deg)' : 'rotate(0)',
                        transition: 'transform 0.25s ease',
                        color: isActive ? 'white' : '#777',
                      }}
                    />
                  )}
                </>
              )}
            </div>

            {hasChildren && isOpen && !isCollapsed && (
              <div style={{ marginLeft: '20px', borderLeft: '2px solid #e0e0e0', paddingLeft: '12px' }}>
                {item.children
                  .filter(child => child)
                  .map((child, childIndex) => {
                    const ChildIcon = child.icon;
                    const childIsOpen = openSections[child.name] || (searchQuery.trim() && child.children);
                    const hasGrandChildren = child.children && child.children.length > 0;
                    const isChildActive = activeChild === child.name;

                    return (
                      <div key={`${child.name}-${childIndex}`}>
                        <div
                          onClick={(e) => handleChildClick(child, item.name, e)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = isChildActive ? '#5ba8ffff' : '#f0f2ff';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = isChildActive ? '#5ba8ffff' : 'transparent';
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0.3rem 0.6rem',
                            cursor: 'pointer',
                            borderRadius: '6px',
                            margin: '4px 0',
                            backgroundColor: isChildActive ? '#5ba8ffff' : 'transparent',
                            color: isChildActive ? 'white' : '#444',
                            fontWeight: isChildActive ? 600 : 500,
                            transition: 'all 0.2s ease',
                            borderLeft: isChildActive ? '3px solid #1b69e7' : '3px solid transparent',
                          }}
                        >
                          {ChildIcon && (
                            <ChildIcon 
                              size={18} 
                              style={{ 
                                marginRight: '8px', 
                                color: isChildActive ? 'white' : '#1b69e7',
                              }} 
                            />
                          )}
                          <span
                            style={{
                              flex: 1,
                              fontSize: '0.9rem',
                            }}
                          >
                            {searchQuery.trim() ? highlightText(child.name, searchQuery) : child.name}
                          </span>

                          {hasGrandChildren && (
                            <MdChevronRight
                              size={16}
                              style={{
                                transform: childIsOpen ? 'rotate(90deg)' : 'rotate(0)',
                                transition: 'transform 0.2s',
                                color: isChildActive ? 'white' : '#777',
                              }}
                            />
                          )}
                        </div>

                        {hasGrandChildren && childIsOpen && (
                          <div style={{ marginLeft: '20px', paddingLeft: '8px' }}>
                            {child.children
                              .filter(grandchild => grandchild)
                              .map((grandchild, grandchildIndex) => {
                                const GrandIcon = grandchild.icon;
                                const hasPath = grandchild.path && grandchild.path !== '#';
                                const isGrandchildActive = activeGrandchild === grandchild.name;

                                return (
                                  <div
                                    key={`${grandchild.name}-${grandchildIndex}`}
                                    onClick={(e) => hasPath ? handleGrandchildClick(grandchild, item.name, child.name, e) : null}
                                    onMouseEnter={(e) => {
                                      if (hasPath) {
                                        e.currentTarget.style.backgroundColor = isGrandchildActive ? '#1b69e7' : '#f0f2ff';
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      if (hasPath) {
                                        e.currentTarget.style.backgroundColor = isGrandchildActive ? '#1b69e7' : 'transparent';
                                      }
                                    }}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      padding: '0.5rem 0.8rem',
                                      cursor: hasPath ? 'pointer' : 'default',
                                      backgroundColor: isGrandchildActive ? '#1b69e7' : 'transparent',
                                      color: isGrandchildActive ? 'white' : '#333',
                                      borderRadius: '6px',
                                      margin: '2px 0',
                                      fontSize: '0.85rem',
                                      transition: 'all 0.2s ease',
                                      borderLeft: isGrandchildActive ? '2px solid #1b69e7' : '2px solid transparent',
                                    }}
                                  >
                                    {GrandIcon && (
                                      <GrandIcon
                                        size={16}
                                        style={{
                                          marginRight: '6px',
                                          color: isGrandchildActive ? 'white' : '#444',
                                        }}
                                      />
                                    )}
                                    <span>
                                      {searchQuery.trim() ? highlightText(grandchild.name, searchQuery) : grandchild.name}
                                    </span>
                                  </div>
                                );
                              })}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        );
      });
  }, [openSections, activeItem, activeChild, activeGrandchild, isCollapsed, searchQuery]);

  return (
    <>
      <div
        ref={sidebarRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#fff',
          color: '#0e0d0dff',
          height: '100vh',
          position: 'fixed',
          borderRight: '1px solid #e0e0e0',
          left: 0,
          top: 0,
          width: isMobile
            ? (isOpen ? '270px' : '0')
            : (isCollapsed ? '77px' : '240px'),
          transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          padding: isMobile ? (isOpen ? '0.8rem 0.6rem' : '0') : '0.8rem 0.6rem',
          overflow: 'hidden',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: isMobile ? '2px 0 15px rgba(0,0,0,0.1)' : '2px 0 15px rgba(0,0,0,0.05)',
          opacity: isMobile ? (isOpen ? 1 : 0) : 1,
          visibility: isMobile ? (isOpen ? 'visible' : 'hidden') : 'visible',
        }}
      >
        {/* HEADER */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed && !isMobile ? 'center' : 'space-between',
          marginBottom: '1rem',
          padding: '0 0.5rem',
          minHeight: '40px',
        }}>
          {(!isCollapsed || isMobile) && (
            <h2 style={{
              fontSize: '1.3rem',
              fontWeight: '700',
              margin: 0,
              whiteSpace: 'nowrap',
              color: '#1b69e7',
              letterSpacing: '0.5px',
            }}>
              {userName}
            </h2>
          )}

          {isMobile && isOpen && (
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#635bff',
                padding: '0.25rem',
                borderRadius: '4px',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
              }}
              title="Close sidebar"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f2ff'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <MdClose size={24} />
            </button>
          )}
    
          {!isMobile && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#635bff',
                padding: '0.25rem',
                borderRadius: '4px',
                transition: 'background-color 0.2s',
              }}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f2ff'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <MdMenu size={24} />
            </button>
          )}
        </div>

        {(!isCollapsed || isMobile) && (
          <div style={{
            marginBottom: '1rem',
            padding: '0 0.5rem',
          }}>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}>
              <MdSearch 
                size={20} 
                style={{
                  position: 'absolute',
                  left: '10px',
                  color: '#999',
                  zIndex: 1,
                }}
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search ticket features..."
                value={searchQuery}
                onChange={handleSearchChange}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.5rem 0.5rem 2.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: '#f8f9fa',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1b69e7';
                  e.target.style.boxShadow = '0 0 0 2px rgba(27, 105, 231, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#ddd';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {searchQuery && (
                <MdClose 
                  size={18}
                  onClick={clearSearch}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    color: '#999',
                    cursor: 'pointer',
                    zIndex: 1,
                  }}
                  title="Clear search"
                />
              )}
            </div>
          </div>
        )}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          maxHeight: 'calc(100vh - 180px)',
          paddingRight: '4px',
          visibility: isMobile ? (isOpen ? 'visible' : 'hidden') : 'visible',
        }}>
          {searchQuery.trim() && menuItems.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '2rem 1rem',
              color: '#666',
              fontStyle: 'italic',
            }}>
              No features found for "{searchQuery}"
            </div>
          )}
          
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
          }}>
            {renderMenu(menuItems)}
          </ul>
        </div>
      </div>
    </>
  );
};

export default EmployeeSidebar;