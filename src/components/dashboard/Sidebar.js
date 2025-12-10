'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { RiSubtractLine } from "react-icons/ri";
import { sidebarMenuItems } from './SidebarMenu';
import {
  MdPushPin, MdOutlinePushPin, MdChevronRight, MdSearch, MdClear
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
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  // Modified function to only track grandchild paths
  const handleNavigationWithTracking = (path, name, isGrandchild = false) => {
    console.log('path', path);
    if (path && path !== '#') {
      // Only track if it's a grandchild path (third level)
      if (isGrandchild) {
        addRecentPath(path, name);
      }
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

  // Function to check if an item or its children match search query
  const itemMatchesSearch = (item, query) => {
    if (!query.trim()) return true;
    
    const searchLower = query.toLowerCase().trim();
    const itemNameLower = item.name.toLowerCase();
    
    // Check if item name matches
    if (itemNameLower.includes(searchLower)) return true;
    
    // Check if any children match (recursively)
    if (item.children) {
      return item.children.some(child => itemMatchesSearch(child, query));
    }
    
    return false;
  };

  // Function to filter menu items tree
  const filterMenuTree = (items, query) => {
    if (!query.trim()) return items;
    
    return items.filter(item => {
      if (item.divider) return true;
      
      // Check if this item or any of its children match
      return itemMatchesSearch(item, query);
    }).map(item => {
      if (!item.children || item.children.length === 0) return item;
      
      // Recursively filter children
      const filteredChildren = filterMenuTree(item.children, query);
      
      // If children were filtered out but item itself matches, keep it
      if (filteredChildren.length > 0 || itemMatchesSearch(item, query)) {
        return {
          ...item,
          children: filteredChildren
        };
      }
      
      return item;
    });
  };

  // Get filtered menu items
  const getFilteredMenuItems = () => {
    if (!searchQuery.trim()) return sidebarMenuItems;
    
    return filterMenuTree(sidebarMenuItems, searchQuery);
  };

  // Highlight matching text
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

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Auto-open sections when searching
    if (value.trim()) {
      const filteredItems = filterMenuTree(sidebarMenuItems, value);
      const sectionsToOpen = {};
      
      // Function to collect parent sections
      const collectParents = (items, parent = null) => {
        items.forEach(item => {
          if (item.divider) return;
          
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

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setOpenSections({});
  };

  // Focus search input when sidebar opens
  useEffect(() => {
    if (isOpen && isMobile) {
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen, isMobile]);

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
        process: 'process',
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

  const menuItems = getFilteredMenuItems();

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
  const handleNavigation = (path, name, isGrandchild = false) => {
    handleNavigationWithTracking(path, name, isGrandchild);
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
      const isOpen = openSections[item.name] || (searchQuery.trim() && hasChildren);
      const isActive = false;

      const hasValidPath = item.path && item.path !== '#';

      return (
        <div key={item.name}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (hasChildren) toggleSection(item.name);
              if (hasValidPath) handleNavigation(item.path, item.name, false); // Not a grandchild
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
              borderRadius: '6px',
              border: searchQuery.trim() ? '1px solid #e0e0e0' : 'none',
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

          {/* Inline Collapsible Children */}
          {hasChildren && isOpen && !isCollapsed && (
            <div style={{ marginLeft: '10px', borderLeft: '2px solid #e0e0e0', paddingLeft: '12px' }}>
              {item.children
                .filter(child => child)
                .map((child) => {
                  const ChildIcon = child.icon;
                  const childIsOpen = openSections[child.name] || (searchQuery.trim() && child.children);
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
                          
                          // Do NOT track child paths (second level) - only navigate
                          handleNavigationWithTracking(targetPath, child.name, false);
                          
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
                          {searchQuery.trim() ? highlightText(child.name, searchQuery) : child.name}
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

                      {/* Grandchildren (only shown when this group is open) */}
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
                                    // Add to recent paths and navigate - THIS IS A GRANDCHILD
                                    handleNavigationWithTracking(grandchild.path, grandchild.name, true);
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
                                  color: isGrandchildActive ? 'white' : '#333',
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
                                  {searchQuery.trim() ? highlightText(grandchild.name, searchQuery) : grandchild.name}
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
  }, [openSections, activeChild, activeGrandchild, isCollapsed, searchQuery]);

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

        {/* Search Box */}
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
                placeholder="Search menus..."
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
                  e.target.style.borderColor = '#635bff';
                  e.target.style.boxShadow = '0 0 0 2px rgba(99, 91, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#ddd';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {searchQuery && (
                <MdClear 
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
          {/* Show message when no results found */}
          {searchQuery.trim() && menuItems.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '2rem 1rem',
              color: '#666',
              fontStyle: 'italic',
            }}>
              No menu items found for "{searchQuery}"
            </div>
          )}
          
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