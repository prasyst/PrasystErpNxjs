'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { RiSubtractLine } from "react-icons/ri";
import { sidebarMenuItems } from './SidebarMenu';
import {
  MdPushPin, MdOutlinePushPin, MdChevronRight
} from 'react-icons/md';
import { usePin } from '../../app/hooks/usePin';
import { useRecentPaths } from '../../app/context/RecentPathsContext';

const Sidebar = ({ isCollapsed, setIsCollapsed, isMobile, isOpen, onClose }) => {
  const sidebarRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState('');
  const [openSections, setOpenSections] = useState({});
  const { pinnedModules, pinModule, unpinModule, isPinned } = usePin();
  const { addRecentPath } = useRecentPaths();
  const [showPinConfirm, setShowPinConfirm] = useState(null);
  const [showUnpinConfirm, setShowUnpinConfirm] = useState(null);
  const [hasOpenSubmenu, setHasOpenSubmenu] = useState(false);
  const [activeChild, setActiveChild] = useState(null);
  const [activeGrandchild, setActiveGrandchild] = useState(null);

  const handleNavigationWithTracking = (path, name) => {
    console.log('path', path)
    if (path && path !== '#') {
      addRecentPath(path, name);
      router.push(path);
      if (isMobile) {
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

  useEffect(() => {
    if (pathname.startsWith('/masterpage')) {
      setOpenSections(prev => ({
        ...prev,
        Masters: true,
      }));
      setIsCollapsed(true);    //addnew
      setHasOpenSubmenu(true);

      // Determine activeChild based on activeTab
      const urlParams = new URLSearchParams(pathname.split('?')[1]);
      const activeTab = urlParams.get('activeTab');
      const mastersTabToChildMap = {
        company: 'Company',
        location: 'Location',
        vendors: 'Vendors',
        customers: 'Customers',
        products: 'Products',
        tax: 'Tax/Terms',
        season: 'Season',
        ticketing: 'Ticketing',
        gst: 'GST/SAC Code',
        process: 'Process',
      };
      setActiveChild(mastersTabToChildMap[activeTab] || null);
      setActiveGrandchild(null);
    } else if (pathname.startsWith('/inventorypage')) {
      setOpenSections(prev => ({
        ...prev,
        Inventory: true,
      }));
      setIsCollapsed(true);  //addnew
      setHasOpenSubmenu(true);

      // Determine activeChild based on activeTab
      const urlParams = new URLSearchParams(pathname.split('?')[1]);
      const activeTab = urlParams.get('activeTab');
      const inventoryTabToChildMap = {
        'inventory-items': 'Inventory Items',
        sampling: 'Sampling & Development',
        'opening-stock': 'Opening Stock',
        'purchase-order': 'Purchase Order',
        'inward-approval': 'Inward Approval',
        'provisinal-grn': 'Provisonal GRN',
        'purchase-inward': 'Purchase Inward',
        'rm-acc-issue': 'RM/Acc Issue',
        manufacturing: 'Manufacturing',
        'other-transactions': 'Other Transaction',
        'sample-packaging': 'Sample Packing',
        'make-to-order': 'Make to Order',
        'sales-dispatch': 'Sales/Dispatch',
        'sampling-production': 'Sampling & Production',
      };
      setActiveChild(inventoryTabToChildMap[activeTab] || null);
      setActiveGrandchild(null);
    } else {
      // Reset active states if not on masters or inventory
      setActiveChild(null);
      setActiveGrandchild(null);
    }
  }, [pathname]);

  useEffect(() => {
    if (isMobile && !isOpen) {
    }
  }, [isMobile, isOpen]);

  const handleChildClick = (child) => {
    setActiveChild(child.name);
    setActiveGrandchild(null);
  };

  const handleGrandchildClick = (grandchild) => {
    setActiveGrandchild(grandchild.name);
  };

  const menuItems = sidebarMenuItems;

  // Find menu item by path
  const findMenuItemByPath = (items, path) => {
    for (const item of items) {
      if (item.path === path) return item;
      if (item.children) {
        const found = findMenuItemByPath(item.children, path);
        if (found) return found;
      }
    }
    return null;
  };

  // Handle navigation
  const handleNavigation = (path, name) => {
    handleNavigationWithTracking(path, name);
  };

  const findAllItemsWithPaths = (items) => {
    let result = [];

    items.forEach(item => {
      if (item.path && item.path !== '#') {
        result.push({
          name: item.name,
          path: item.path,
          icon: item.icon
        });
      }

      if (item.children) {
        result = result.concat(findAllItemsWithPaths(item.children));
      }
    });

    return result;
  };

  // Get all searchable items
  const searchableItems = findAllItemsWithPaths(menuItems);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setOpenSections({});
        setHasOpenSubmenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle pin confirmation
  const handlePinClick = (item, event) => {
    event.stopPropagation();

    if (isPinned(item.path)) {
      setShowUnpinConfirm(item);
    } else {
      setShowPinConfirm(item);
    }
  };

  // Confirm pin
  const confirmPin = (item) => {
    pinModule({
      name: item.name,
      path: item.path,
      icon: item.icon
    });
    setShowPinConfirm(null);
  };

  // Confirm unpin
  const confirmUnpin = (item) => {
    unpinModule({
      name: item.name,
      path: item.path,
      icon: item.icon
    });
    setShowUnpinConfirm(null);
  };

  const renderMainMenu = useCallback((items) => {
    return items.map((item, index) => {
      // DIVIDER RENDERING — MUST BE AT THE TOP LEVEL
      if (item.divider) {
        return (
          <div
            key={`divider-${index}`}
            style={{
              height: '1px',
              backgroundColor: '#c8d6e5',
              margin: '18px 24px',
              borderRadius: '2px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
          />
        );
      }

      const IconComponent = item.icon;
      const hasChildren = item.children && item.children.length > 0;
      const isOpen = openSections[item.name];
      const isActive = false;

      const hasValidPath = item.path && item.path !== '#';

      return (
        <div key={item.name}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (hasChildren) toggleSection(item.name);
              // if (hasValidPath) handleNavigation(item.path, item.name);
              if (item.name === 'Masters') {
                handleNavigation('/masterpage?activeTab=company', 'Masters');
              } else if (hasValidPath) {
                handleNavigation(item.path, item.name);
              }
              if (item.name !== 'Masters' && item.name !== 'Inventory') {
                setActiveChild(null);
                setActiveGrandchild(null);
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.45rem 0.2rem',
              cursor: 'pointer',
              backgroundColor: isActive ? '#5ba8ffff' : 'transparent',
              color: isActive ? 'white' : '#333',
              transition: 'all 0.2s ease',
              margin: '0.10rem 0.4rem',
            }}
          >
            {IconComponent && (
              <IconComponent
                size={20}
                style={{
                  marginRight: isCollapsed ? 0 : '12px',
                  minWidth: '24px',
                  color: isActive ? 'white' : '#635bff',
                }}
              />
            )}
            {!isCollapsed && (
              <>
                <span style={{ flex: 1, fontWeight: isActive ? 600 : 500 }}>
                  {item.name}
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

          {/* Inline Collapsible Children */}
          {hasChildren && isOpen && !isCollapsed && (
            <div style={{ marginLeft: '10px', borderLeft: '2px solid #e0e0e0', paddingLeft: '12px' }}>
              {item.children
                .filter(child => child)
                .map((child) => {
                  const ChildIcon = child.icon;
                  const childIsOpen = openSections[child.name];
                  const hasGrandChildren = child.children && child.children.length > 0;
                  const isChildActive = activeChild === child.name;

                  return (
                    <div key={child.name}>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          if (child.path === '#') return;
                          handleChildClick(child);
                          let targetPath = child.path;

                          if (!targetPath || targetPath === '#') {
                            if (item.name === 'Inventory') {
                              const inventoryMap = {
                                'Inventory': 'inventory',
                                'Sampling & Development': 'sampling',
                                'Opening Stock': 'opening-stock',
                                'Purchase Order': 'purchase-order',
                                'Inward Approval': 'inward-approval',
                                'Provisonal GRN': 'provisinal-grn',
                                'Purchase Inward': 'purchase-inward',
                                'RM/Acc Issue': 'rm-acc-issue',
                                'Manufacturing': 'manufacturing',
                                'Other Transaction': 'other-transactions',
                                'Sample Packing': 'sample-packaging',
                                'Make to Order': 'make-to-order',
                                'Sales/Dispatch': 'sales-dispatch',
                                'Sampling & Production': 'sampling-production',
                              };
                              const tab = inventoryMap[child.name] || 'inventory';
                              targetPath = `/inventorypage?activeTab=${tab}`;
                            } else {
                              const mastersMap = {
                                Company: 'company',
                                Location: 'location',
                                Vendors: 'vendors',
                                Customers: 'customers',
                                Products: 'products',
                                'Tax/Terms': 'tax',
                                Season: 'season',
                                Ticketing: 'ticketing',
                                'GST/SAC Code': 'gst',
                                Process: 'process',
                              };
                              const tab = mastersMap[child.name] || 'company';
                              targetPath = `/masterpage?activeTab=${tab}`;
                            }
                          }

                          // Add to recent paths and navigate
                          handleNavigationWithTracking(targetPath, child.name);

                          toggleSection(child.name);
                          // Ensure parent stays open
                          if (item.name === 'Masters' || item.name === 'Inventory') {
                            setOpenSections(prev => ({ ...prev, [item.name]: true }));
                          }
                          if (isMobile) onClose();
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0.5rem 0.2rem',
                          cursor: 'pointer',
                          borderRadius: '6px',
                          margin: '2px 0',
                          backgroundColor: isChildActive ? '#f0f2ff' : 'transparent',
                          color: isChildActive ? '#635bff' : '#444',
                          fontWeight: isChildActive ? 600 : 500,
                        }}
                      >
                        {ChildIcon && <ChildIcon size={18} style={{ marginRight: '5px' }} />}
                        <span
                          style={{
                            flex: 1,
                            fontSize: '0.9rem',
                            display: child.hideName ? 'none' : 'inline',
                          }}
                        >
                          {child.name}
                        </span>

                        {hasGrandChildren && (
                          <MdChevronRight
                            size={16}
                            style={{
                              transform: childIsOpen ? 'rotate(90deg)' : 'rotate(0)',
                              transition: 'transform 0.2s',
                            }}
                          />
                        )}
                      </div>

                      {/* Grandchildren */}
                      {hasGrandChildren && childIsOpen && (
                        <div style={{ marginLeft: '20px', paddingLeft: '8px' }}>
                          {child.children.map((grandchild) => {
                            const GrandIcon = grandchild.icon;
                            const hasPath = grandchild.path && grandchild.path !== '#';
                            const isGrandchildActive = isChildActive && activeGrandchild === grandchild.name;

                            return (
                              <div
                                key={grandchild.name}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleGrandchildClick(grandchild);
                                  if (hasPath) {
                                    // Add to recent paths and navigate
                                    handleNavigationWithTracking(grandchild.path, grandchild.name);
                                  }
                                  toggleSection(grandchild.name);
                                  if (isMobile) onClose();
                                }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  padding: '0.35rem 0.1rem',
                                  cursor: hasPath ? 'pointer' : 'default',
                                  backgroundColor: isGrandchildActive ? '#635bff' : 'transparent',
                                  color: '#333',
                                  borderRadius: '6px',
                                  margin: '1px 1px',
                                  fontSize: '0.85rem',
                                }}
                              >
                                {GrandIcon && (
                                  <GrandIcon
                                    size={16}
                                    style={{
                                      marginRight: '2px',
                                      color: isGrandchildActive ? 'white' : '#444',
                                    }}
                                  />
                                )}
                                <span style={{ display: grandchild.hideName ? 'none' : 'inline' }}>
                                  {grandchild.name}
                                </span>

                                {/* Pin icon for leaf nodes */}
                                {hasPath && (
                                  <div
                                    onClick={(e) => handlePinClick(grandchild, e)}
                                    style={{
                                      marginLeft: 'auto',
                                      color: isPinned(grandchild.path) ? '#635bff' : '#aaa',
                                    }}
                                  >
                                    {isPinned(grandchild.path) ? (
                                      <MdPushPin size={15} />
                                    ) : (
                                      <MdOutlinePushPin size={15} />
                                    )}
                                  </div>
                                )}
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
  }, [openSections, activeChild, activeGrandchild, isCollapsed])

  return (
    <>
      <div
        ref={sidebarRef}
        onMouseEnter={() => {
          if (!isMobile) {
            setIsCollapsed(false);
          }
        }}
        onMouseLeave={() => {
          if (!isMobile) {
            const isMastersRoute = pathname === '/masterpage';
            if (!isMastersRoute) {
              setIsCollapsed(true);
              setOpenSections({});
              setHasOpenSubmenu(false);
            }
          }
        }}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#fff',
          color: '#0e0d0dff',
          height: '100vh',
          position: isMobile ? 'fixed' : 'fixed',
          borderRight: '1px solid #e0e0e0',
          left: 0,
          top: 0,
          width: isMobile
            ? (isOpen ? '270px' : '0')
            : (isCollapsed ? '77px' : '240px'),
          transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          padding: isMobile ? (isOpen ? '0.8rem 0.6rem' : '0') : '0.8rem 0.6rem',
          overflow: 'hidden',
          zIndex: isMobile ? 1000 : 1000,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: isMobile ? '2px 0 15px rgba(0,0,0,0.1)' : '2px 0 15px rgba(0,0,0,0.05)',
          opacity: isMobile ? (isOpen ? 1 : 0) : 1,
          visibility: isMobile ? (isOpen ? 'visible' : 'hidden') : 'visible',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
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
              Prasyst
            </h2>
          )}
        </div>

        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          maxHeight: 'calc(100vh - 100px)',
          paddingRight: '4px',
          visibility: isMobile ? (isOpen ? 'visible' : 'hidden') : 'visible',
        }}>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
          }}>
            {renderMainMenu(menuItems)}
          </ul>
        </div>
      </div>

      {/* Pin Confirmation Modal */}
      {showPinConfirm && (
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
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
          }}>
            <h3 style={{ marginTop: 0 }}>Pin Module</h3>
            <p>Are you sure you want to pin `${showPinConfirm.name}` to your quick access?</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                onClick={() => setShowPinConfirm(null)}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: '#f5f5f5',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => confirmPin(showPinConfirm)}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: '#1b69e7',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Yes, Pin It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unpin Confirmation Modal */}
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
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
          }}>
            <h3 style={{ marginTop: 0 }}>Unpin Module</h3>
            <p>Are you sure you want to unpin `${showUnpinConfirm.name}` from your quick access?</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                onClick={() => setShowUnpinConfirm(null)}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: '#f5f5f5',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => confirmUnpin(showUnpinConfirm)}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: '#ff4d4f',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Yes, Unpin It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;