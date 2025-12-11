'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { sidebarMenuItems } from './SidebarMenu';
import {
  MdPushPin, MdOutlinePushPin, MdChevronRight, MdSearch, MdClear, MdMenu
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
  const [activeParent, setActiveParent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  
  // Track if user has manually interacted with sidebar
  const [isUserInteracted, setIsUserInteracted] = useState(false);

  // Main navigation function with recent path tracking
  const handleNavigationWithTracking = (path, name, isGrandchild = false) => {
    console.log('Navigating to:', path, 'name:', name, 'isGrandchild:', isGrandchild);
    
    if (path && path !== '#') {
      // Track only grandchild paths in recent paths
      if (isGrandchild) {
        console.log('Adding to recent paths:', name, path);
        addRecentPath(path, name);
      }
      
      // Navigate to the path
      router.push(path);
      
      // Mark that user has interacted
      setIsUserInteracted(true);
      
      if (isMobile) {
        onClose();
      }
    }
  };

  const toggleSection = (name) => {
    setIsUserInteracted(true);
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

  // Handle parent click
  const handleParentClick = (item, e) => {
    e.stopPropagation();
    setIsUserInteracted(true);
    
    // Set active parent
    setActiveParent(item.name);
    setActiveChild(null);
    setActiveGrandchild(null);
    
    // If it has children, toggle section
    if (item.children && item.children.length > 0) {
      toggleSection(item.name);
    }
    
    // If it has a valid path, navigate
    if (item.path && item.path !== '#') {
      handleNavigationWithTracking(item.path, item.name, false);
    }
  };

  // Handle child click
  const handleChildClick = (child, parentName, e) => {
    e.stopPropagation();
    setIsUserInteracted(true);
    
    // Set active states
    setActiveParent(parentName);
    setActiveChild(child.name);
    setActiveGrandchild(null);
    
    // Toggle child section if it has grandchildren
    if (child.children && child.children.length > 0) {
      toggleSection(child.name);
    }
    
    let targetPath = child.path;

    // Handle special cases for Masters and Inventory
    if (!targetPath || targetPath === '#') {
      if (parentName === 'Inventory') {
        const inventoryMap = {
          'Inventory Items': 'inventory-items',
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
      } else if (parentName === 'Masters') {
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
    
    // Navigate (not tracking as recent since it's a child, not grandchild)
    if (targetPath && targetPath !== '#') {
      console.log('Navigating to child:', child.name, targetPath);
      handleNavigationWithTracking(targetPath, child.name, false);
    }
    
    // Ensure parent stays open
    if (parentName === 'Masters' || parentName === 'Inventory') {
      setOpenSections(prev => ({ ...prev, [parentName]: true }));
    }
    
    if (isMobile) onClose();
  };

  // Handle grandchild click
  const handleGrandchildClick = (grandchild, parentName, childName, e) => {
    e.stopPropagation();
    setIsUserInteracted(true);
    
    // Set active states
    setActiveParent(parentName);
    setActiveChild(childName);
    setActiveGrandchild(grandchild.name);
    
    // Ensure parent and child sections are open
    setOpenSections(prev => ({
      ...prev,
      [parentName]: true,
      [childName]: true
    }));
    
    // Navigate and track as recent (since it's a grandchild)
    if (grandchild.path && grandchild.path !== '#') {
      console.log('Navigating to grandchild:', grandchild.name, grandchild.path);
      handleNavigationWithTracking(grandchild.path, grandchild.name, true);
    }
    
    if (isMobile) onClose();
  };

  // Item matches search
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

  // Filter menu tree
  const filterMenuTree = (items, query) => {
    if (!query.trim()) return items.filter(item => item);
    
    return items
      .filter(item => {
        if (!item) return false;
        if (item.divider) return true;
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
    if (!searchQuery.trim()) return sidebarMenuItems.filter(item => item);
    return filterMenuTree(sidebarMenuItems, searchQuery);
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
      const filteredItems = filterMenuTree(sidebarMenuItems, value);
      const sectionsToOpen = {};
      
      const collectParents = (items, parent = null) => {
        items.forEach(item => {
          if (!item || item.divider) return;
          
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

  // Focus search input on mobile open
  useEffect(() => {
    if (isOpen && isMobile) {
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen, isMobile]);

  // Set active states based on current path
  useEffect(() => {
    console.log('Path changed to:', pathname);
    
    // Helper function to find active items
    const findActiveItems = (items) => {
      for (const item of items) {
        if (!item) continue;
        
        // Check if this item matches the path
        if (item.path === pathname) {
          setActiveParent(item.name);
          setActiveChild(null);
          setActiveGrandchild(null);
          return true;
        }
        
        // Check children
        if (item.children) {
          for (const child of item.children) {
            if (!child) continue;
            
            if (child.path === pathname) {
              setActiveParent(item.name);
              setActiveChild(child.name);
              setActiveGrandchild(null);
              setOpenSections(prev => ({ ...prev, [item.name]: true }));
              return true;
            }
            
            // Check grandchildren
            if (child.children) {
              for (const grandchild of child.children) {
                if (!grandchild) continue;
                
                if (grandchild.path === pathname) {
                  setActiveParent(item.name);
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
      return false;
    };
    
    // Special handling for Masterpage and Inventorypage
    if (pathname.startsWith('/masterpage')) {
      setActiveParent('Masters');
      setOpenSections(prev => ({ ...prev, Masters: true }));
      setHasOpenSubmenu(true);

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
      setActiveParent('Inventory');
      setOpenSections(prev => ({ ...prev, Inventory: true }));
      setHasOpenSubmenu(true);

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
      // Try to find active items in the menu
      if (!findActiveItems(sidebarMenuItems)) {
        // If not found, reset active states
        setActiveParent(null);
        setActiveChild(null);
        setActiveGrandchild(null);
      }
    }
  }, [pathname]);

  // Reset user interaction flag after navigation
  useEffect(() => {
    // Reset the flag after a short delay to allow sidebar to stay open
    const timer = setTimeout(() => {
      setIsUserInteracted(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [pathname]);

  const menuItems = getFilteredMenuItems();

  // Handle pin click
  const handlePinClick = (item, event) => {
    event.stopPropagation();

    if (isPinned(item.path)) {
      setShowUnpinConfirm(item);
    } else {
      setShowPinConfirm(item);
    }
  };
  
  const confirmPin = (item) => {
    pinModule({
      name: item.name,
      path: item.path,
      icon: item.icon
    });
    setShowPinConfirm(null);
  };

  const confirmUnpin = (item) => {
    unpinModule({
      name: item.name,
      path: item.path,
      icon: item.icon
    });
    setShowUnpinConfirm(null);
  };

  const renderMainMenu = useCallback((items) => {
    return items
      .filter(item => item)
      .map((item, index) => {
        // DIVIDER RENDERING
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
        const isActive = activeParent === item.name;
        const hasValidPath = item.path && item.path !== '#';

        return (
          <div key={item.name}>
            {/* PARENT ITEM */}
            <div
              onClick={(e) => handleParentClick(item, e)}
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

            {/* CHILDREN (shown when parent is open and sidebar not collapsed) */}
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
                        {/* CHILD ITEM */}
                        <div
                          onClick={(e) => handleChildClick(child, item.name, e)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0.5rem 0.2rem',
                            cursor: 'pointer',
                            borderRadius: '6px',
                            margin: '2px 0',
                            backgroundColor: isChildActive ? '#5ba8ffff' : 'transparent',
                            color: isChildActive ? 'white' : '#444',
                            fontWeight: isChildActive ? 600 : 500,
                          }}
                        >
                          {ChildIcon && (
                            <ChildIcon 
                              size={18} 
                              style={{ 
                                marginRight: '5px', 
                                color: isChildActive ? 'white' : '#635bff' 
                              }} 
                            />
                          )}
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
                                color: isChildActive ? 'white' : '#777',
                              }}
                            />
                          )}
                        </div>

                        {/* GRANDCHILDREN (shown when child is open) */}
                        {hasGrandChildren && childIsOpen && (
                          <div style={{ marginLeft: '20px', paddingLeft: '8px' }}>
                            {child.children
                              .filter(grandchild => grandchild)
                              .map((grandchild) => {
                                const GrandIcon = grandchild.icon;
                                const hasPath = grandchild.path && grandchild.path !== '#';
                                const isGrandchildActive = activeGrandchild === grandchild.name;

                                return (
                                  <div
                                    key={grandchild.name}
                                    onClick={(e) => handleGrandchildClick(grandchild, item.name, child.name, e)}
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
  }, [openSections, activeParent, activeChild, activeGrandchild, isCollapsed, searchQuery]);

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
              Prasyst
            </h2>
          )}
          {!isMobile && (
            <button
              onClick={() => {
                setIsUserInteracted(true);
                setIsCollapsed(!isCollapsed);
                if (!isCollapsed) {
                  // Only close sections when manually collapsing
                  setOpenSections({});
                  setHasOpenSubmenu(false);
                }
              }}
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

        {/* SEARCH BOX */}
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

        {/* MENU ITEMS */}
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

      {/* PIN CONFIRMATION MODAL */}
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
            <p>Are you sure you want to pin "{showPinConfirm.name}" to your quick access?</p>
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

      {/* UNPIN CONFIRMATION MODAL */}
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
            <p>Are you sure you want to unpin "{showUnpinConfirm.name}" from your quick access?</p>
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