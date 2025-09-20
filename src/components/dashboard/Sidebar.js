'use client';

import { useEffect, useRef, useState } from 'react';
import {
  MdDashboard, MdSearch, MdOutlineApartment, MdClose, MdMenu, MdChevronRight,
  MdDomain, MdMap, MdOutlineGroupWork, MdCategory, MdWarehouse, MdWork,
  MdAccountBox, MdEmojiPeople, MdAccessibility, MdLocalShipping, MdPeople,
  MdPersonAdd, MdClass, MdLocalOffer, MdStars, MdRateReview, MdBuild,
  MdLocalMall, MdCollectionsBookmark, MdStraighten, MdBrandingWatermark,
  MdReceipt, MdGavel, MdAssignment, MdAttachMoney, MdEvent, MdAnalytics,
  MdSettings, MdInventory, MdAccountBalance, MdPayments, MdSummarize,
  MdPushPin, MdOutlinePushPin, MdOutlineInventory,
} from 'react-icons/md';

import { FaBuilding, FaTruck, FaUserTag, FaHandshake, FaBalanceScale, FaBoxOpen, FaBoxes, FaUserTie, FaRupeeSign  } from 'react-icons/fa';
import { FiUser } from 'react-icons/fi';
import { RiFileChartLine, RiAdminLine } from "react-icons/ri";
import { AiOutlineUsergroupAdd, AiOutlineNodeIndex } from 'react-icons/ai';
import { IoIosConstruct } from 'react-icons/io';
import { usePin } from '../../app/hooks/usePin';

const iconMap = {
  MdDashboard,
  MdSearch,
  MdOutlineApartment,
  MdDomain,
  MdMap,
  MdOutlineGroupWork,
  MdCategory,
  MdWarehouse,
  MdWork,
  MdAccountBox,
  MdEmojiPeople,
  MdAccessibility,
  MdLocalShipping,
  MdPeople,
  MdPersonAdd,
  MdClass,
  MdLocalOffer,
  MdStars,
  MdRateReview,
  MdBuild,
  MdLocalMall,
  MdCollectionsBookmark,
  MdStraighten,
  MdBrandingWatermark,
  MdReceipt,
  MdGavel,
  MdAssignment,
  MdAttachMoney,
  MdEvent,
  MdAnalytics,
  MdSettings,
  MdInventory,
  MdAccountBalance,
  MdPayments,
  MdSummarize,
  FaBuilding,
  FaTruck,
  FaUserTag,
  FaHandshake,
  FaBalanceScale,
  FaBoxOpen,
  FaBoxes,
  FaUserTie,
  FiUser,
  AiOutlineUsergroupAdd,
  AiOutlineNodeIndex
};

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const sidebarRef = useRef(null);
  const megaMenuRef = useRef(null);
  const [activeItem, setActiveItem] = useState('');
  const [hoveredItems, setHoveredItems] = useState([]);
  const [openMegaMenu, setOpenMegaMenu] = useState(null);
  const [megaMenuPosition, setMegaMenuPosition] = useState({ top: 0, left: 0 });
  const [megaMenuLevels, setMegaMenuLevels] = useState([]);
  const { pinnedModules, pinModule, unpinModule, isPinned } = usePin();
  const [showPinConfirm, setShowPinConfirm] = useState(null);
  const [showUnpinConfirm, setShowUnpinConfirm] = useState(null);

  // Sample menu structure with multiple nested levels
  const menuItems = [
    { name: 'Dashboard', icon: MdDashboard, path: '/dashboard', },
    { name: 'SalesDash', icon: FaRupeeSign  , path: '/dashboard/sales-dashboard', },
    { name: 'Stock Enquiry', icon: MdSearch, path: '/dashboard/stock-enquiry-table' },
    {
      name: 'Masters',
      icon: MdOutlineApartment,
      children: [
        {
          name: 'Company',
          icon: FaBuilding,
          // path: '/masters/company',
          children: [

            { name: 'Company', icon: MdDomain, path: '/masters/company/company' },
            { name: 'Company Area', icon: MdMap, path: '#' },
            { name: 'Company Division', icon: MdOutlineGroupWork, path: '#' },
            { name: 'Stock Type', icon: MdCategory, path: '#' },
            { name: 'Stock Location', icon: MdWarehouse, path: '#' },
            { name: 'Department', icon: MdWork, path: '#' },
            { name: 'Designation', icon: MdAccountBox, path: '#' },
            { name: 'SalesPerson', icon: MdEmojiPeople, path: '#' },
            { name: 'Employee', icon: MdAccessibility, path: '#' },
          ],
        },
        ,
        {
          name: 'Location',
          icon: FaTruck,
          path: '#',
          // children: [
          //   { name: 'Broker', icon: FaHandshake, path: '#' },

          // ],
        },
        {
          name: 'Vendors',
          icon: FaTruck,
          // path: '/masters/vendors',
          children: [
            { name: 'Broker', icon: FaHandshake, path: '#' },
            { name: 'Transporter', icon: MdLocalShipping, path: '#' },
            { name: 'Creditors/Suppliers', icon: FaUserTag, path: '/masters/vendors' },
          ],
        },
        {
          name: 'Customers',
          icon: MdPeople,
          // path: '/masters/customers',
          children: [
            { name: 'Debtors/Customers', icon: MdPeople, path: '/masters/customers' },
            { name: 'Category (For Rate)', icon: MdCategory, path: '#' },
            { name: 'Customer Group', icon: AiOutlineUsergroupAdd, path: '#' },
            { name: 'Consignee', icon: MdPersonAdd, path: '#' },
            { name: 'Party Class Master', icon: MdClass, path: '#' },
            { name: 'Party Wise Rate List', icon: MdLocalOffer, path: '#' },
            { name: 'Party Brand Broker', icon: MdStars, path: '#' },
            { name: 'Party Rating Update', icon: MdRateReview, path: '#' },
            { name: 'Party Brand Parameter', icon: MdBuild, path: '#' },
          ],
        },
        ,
        {
          name: 'Process',
          icon: FaTruck,
          path: '#',
          // children: [
          //   { name: 'Broker', icon: FaHandshake, path: '#' },

          // ],
        },
        {
          name: 'Products',
          icon: FaBoxOpen,
          // path: '/masters/products',
          children: [
            { name: 'Category Master', icon: MdCategory, path: '/masters/products/category' },
            { name: 'Product Group', icon: AiOutlineNodeIndex, path: '/masters/products/productgrp' },
            { name: 'Product Master', icon: MdLocalMall, path: '/masters/products/product' },
            { name: 'Style Master', icon: MdCollectionsBookmark, path: '#' },
            { name: 'Type Master', icon: MdCategory, path: '/masters/products/type' },
            { name: 'Shade Master', icon: MdBrandingWatermark, path: '/masters/products/shade' },
            { name: 'Pattern Master', icon: MdCollectionsBookmark, path: '/masters/products/pattern' },
            { name: 'Brand Master', icon: MdBrandingWatermark, path: '/masters/products/brand' },
            { name: 'Unit Master', icon: MdStraighten, path: '/masters/products/unit' },
            { name: 'Web Collection', icon: MdCollectionsBookmark, path: '/masters/products/webcollection' },
            { name: 'Quality', icon: MdBrandingWatermark, path: '/masters/products/quality' },
            { name: 'RackMst', icon: MdBuild, path: '/masters/products/rack' },
            { name: 'Prod Series', icon: MdAssignment, path: '/masters/products/prodseries' },
          ],
        },
        {
          name: 'GST/SAC Code',
          icon: MdReceipt,
          // path: '/masters/gst-sac',
          children: [
            { name: 'GST Codes', icon: MdReceipt, path: '#' },
          ],
        },
        {
          name: 'Tax/Terms',
          icon: FaBalanceScale,
          // path: '/masters/tax-terms',
          children: [
            { name: 'Tax Group', icon: MdGavel, path: '#' },
            { name: 'Tax Master', icon: MdGavel, path: '/masters/taxterms/taxmaster' },
            { name: 'Term Group', icon: MdGavel, path: '#' },
            { name: 'Terms Master', icon: MdAssignment, path: '/masters/taxterms/termmaster' },
            { name: 'Discount Pattern', icon: MdLocalOffer, path: '#' },
            { name: 'Discount Sequence', icon: MdAssignment, path: '#' },
            { name: 'Pattern Master', icon: MdCollectionsBookmark, path: '#' },
            { name: 'Cash Discount Terms', icon: MdAttachMoney, path: '#' },
            { name: 'Excise Tariff Master', icon: MdReceipt, path: '#' },
            { name: 'Excise Tariff Group', icon: MdReceipt, path: '#' },
          ],
        },
        ,
        {
          name: 'Other Misc',
          icon: FaTruck,
          path: '#',
          children: [
            { name: 'Broker', icon: FaHandshake, path: '#' },

          ],
        },
        ,
        {
          name: 'TDS Master',
          icon: FaTruck,
          path: '#',
          children: [
            { name: 'Broker', icon: FaHandshake, path: '#' },

          ],
        },
        ,
        {
          name: 'QC Master',
          icon: FaTruck,
          path: '#',
          children: [
            { name: 'Broker', icon: FaHandshake, path: '#' },

          ],
        },
        {
          name: 'Season',
          icon: MdEvent,
          path: '/masters/season',
          children: [
            { name: 'Season Master', icon: MdEvent, path: '/masters/season/season' },
          ],
        },

        {
          name: 'Managers',
          icon: FaTruck,
          path: '#',
          children: [
            { name: 'Broker', icon: FaHandshake, path: '#' },

          ],
        }
        ,
        {
          name: 'WareHouse Management',
          icon: FaTruck,
          path: '#',
          children: [
            { name: 'Broker', icon: FaHandshake, path: '#' },

          ],
        },
        ,
        {
          name: 'Port Master',
          icon: FaTruck,
          path: '#',
          children: [
            { name: 'Broker', icon: FaHandshake, path: '#' },

          ],
        }
        ,
        {
          name: 'Pay ment term',
          icon: FaTruck,
          path: '#',
          children: [
            { name: 'Broker', icon: FaHandshake, path: '#' },

          ],
        },
        {
          name: 'Rate term',
          icon: FaTruck,
          path: '#',
          children: [
            { name: 'Broker', icon: FaHandshake, path: '#' },

          ],
        },
        {
          name: 'Approval Settings',
          icon: FaTruck,
          path: '#',
          children: [
            { name: 'Broker', icon: FaHandshake, path: '#' },

          ],
        },
        {
          name: 'Approval',
          icon: FaTruck,
          path: '#',
          children: [
            { name: 'Broker', icon: FaHandshake, path: '#' },

          ],
        },
        {
          name: 'TransApproval',
          icon: FaTruck,
          path: '#',
          children: [
            { name: 'Broker', icon: FaHandshake, path: '#' },

          ],
        },
        {
          name: 'TransApproval Setting',
          icon: FaTruck,
          path: '#',
          children: [
            { name: 'Broker', icon: FaHandshake, path: '#' },

          ],
        },

      ],
    },
    {
      name: 'Inventory',
      icon: MdInventory,
      children: [
        { name: 'Stock Management', icon: FaBoxes, path: '#' },
        {
          name: 'Sales', icon: FaBoxes, path: '#',
          children: [

            { name: 'Sales Offline', icon: FaBoxes, path: '/inverntory/inventory-offline/' },


          ],
        },
        { name: 'Inventory Reports', icon: MdSummarize, path: '#' },
        { name: 'Stock Adjustment', icon: MdBuild, path: '#' },
        { name: 'Inventory Valuation', icon: MdAttachMoney, path: '#' },
      ],
    },
    {
      name: 'Accounts',
      icon: MdAccountBalance,
      children: [
        { name: 'General Ledger', icon: MdAssignment, path: '#' },
        { name: 'Accounts Payable', icon: MdPayments, path: '#' },
        { name: 'Accounts Receivable', icon: MdReceipt, path: '#' },
        { name: 'Financial Reports', icon: MdAnalytics, path: '#' },
      ],
    },
    {
      name: 'Inventory Report',
      icon: MdOutlineInventory,
      children: [
        { name: 'General Ledger', icon: MdAssignment, path: '#' },
        { name: 'Accounts Payable', icon: MdPayments, path: '#' },
        { name: 'Accounts Receivable', icon: MdReceipt, path: '#' },
        { name: 'Financial Reports', icon: MdAnalytics, path: '#' },
      ],
    },
    {
      name: 'Accounts Report',
      icon: RiFileChartLine,
      children: [
        { name: 'General Ledger', icon: MdAssignment, path: '#' },
        { name: 'Accounts Payable', icon: MdPayments, path: '#' },
        { name: 'Accounts Receivable', icon: MdReceipt, path: '#' },
        { name: 'Financial Reports', icon: MdAnalytics, path: '#' },
      ],
    },
    {
      name: 'HR & Operation',
      icon: FaUserTie,
      children: [
        { name: 'Employee Management', icon: MdPeople, path: '#' },
        { name: 'Payroll Processing', icon: MdPayments, path: '#' },
        { name: 'Attendance Tracking', icon: MdEvent, path: '#' },
        { name: 'HR Reports', icon: MdSummarize, path: '#' },
      ],
    },
    {
      name: 'Administrator',
      icon: RiAdminLine,
      children: [
        { name: 'Employee Management', icon: MdPeople, path: '#' },
        { name: 'Payroll Processing', icon: MdPayments, path: '#' },
        { name: 'Attendance Tracking', icon: MdEvent, path: '#' },
        { name: 'HR Reports', icon: MdSummarize, path: '#' },
      ],
    },
    ,
    {
      name: 'Utility',
      icon: IoIosConstruct,
      children: [
        { name: 'Employee Management', icon: MdPeople, path: '#' },
        { name: 'Payroll Processing', icon: MdPayments, path: '#' },
        { name: 'Attendance Tracking', icon: MdEvent, path: '#' },
        { name: 'HR Reports', icon: MdSummarize, path: '#' },
      ],
    },
    {
      name: 'Reports',
      icon: MdAnalytics,
      children: [
        { name: 'Sales Reports', icon: MdLocalMall, path: '#' },
        { name: 'Purchase Reports', icon: FaTruck, path: '#' },
        { name: 'Inventory Reports', icon: MdInventory, path: '#' },
        { name: 'Financial Reports', icon: MdAccountBalance, path: '#' },
      ],
    },
    {
      name: 'Settings',
      icon: MdSettings,
      children: [
        { name: 'User Management', icon: MdPeople, path: '#' },
        { name: 'System Configuration', icon: MdBuild, path: '#' },
        { name: 'Preferences', icon: MdSettings, path: '#' },
        { name: 'Backup & Restore', icon: MdAssignment, path: '#' },
      ],
    },
  ];


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        megaMenuRef.current &&
        !megaMenuRef.current.contains(event.target)
      ) {
        closeMegaMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  // Handle main menu hover
  const handleMainMenuHover = (item, event) => {
    if (item.children && item.children.length > 0) {
      const rect = event.currentTarget.getBoundingClientRect();

      // Fixed top position for all mega menus (100px from top)
      const fixedTop = 100;

      setMegaMenuPosition({
        top: fixedTop,
        left: isCollapsed ? 80 : 260
      });
      setOpenMegaMenu(item.name);
      setHoveredItems([item]);
      setMegaMenuLevels([item.children]);
    } else {
      // Close mega menu if the item has no children
      closeMegaMenu();
    }
  };

  // Handle submenu hover
  const handleSubMenuHover = (subItem, levelIndex, event) => {
    // Clear all levels beyond the current one
    const newHoveredItems = hoveredItems.slice(0, levelIndex + 1);
    const newLevels = megaMenuLevels.slice(0, levelIndex + 1);

    if (subItem.children && subItem.children.length > 0) {
      newHoveredItems[levelIndex + 1] = subItem;
      newLevels[levelIndex + 1] = subItem.children;
    }

    setHoveredItems(newHoveredItems);
    setMegaMenuLevels(newLevels);
  };

  // Close mega menu
  const closeMegaMenu = () => {
    setOpenMegaMenu(null);
    setHoveredItems([]);
    setMegaMenuLevels([]);
  };

  // Handle navigation
  const handleNavigation = (path) => {
    if (path && path !== '#') {
      setActiveItem(path);
      closeMegaMenu();
      if (typeof window !== 'undefined') {
        window.location.href = path;
      }
    }
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

  // Close mega menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        megaMenuRef.current &&
        !megaMenuRef.current.contains(event.target)
      ) {
        closeMegaMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
      icon: item.icon // Store the string identifier instead of the component
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

  const renderMenuLevel = (items, levelIndex, title = null) => {
    return (
      <div key={levelIndex} style={{
        width: '250px',
        borderRight: levelIndex < megaMenuLevels.length - 1 ? '1px solid #f0f0f0' : 'none',
        padding: '0.5rem 0',
        overflowY: 'auto',
        backgroundColor: levelIndex === 0 ? '#fafbfc' : '#fff',
      }}>
        {title && (
          <div style={{
            padding: '0.75rem 1rem',
            fontWeight: '600',
            color: '#1b69e7',
            fontSize: '0.9rem',
            borderBottom: '1px solid #e8f0fe',
            marginBottom: '0.5rem',
            backgroundColor: '#fff',
          }}>
            {title}
          </div>
        )}

        {items.map((item, index) => {
          const IconComponent = iconMap[item.icon];
          const hasChildren = item.children && item.children.length > 0;
          const isActive = activeItem === item.path;
          const isHovered = hoveredItems[levelIndex + 1]?.name === item.name;
          const hasValidPath = item.path && item.path !== '#';

          return (
            <div key={`${item.name}-${levelIndex}-${index}`}>
              <div
                onMouseEnter={(e) => hasChildren && handleSubMenuHover(item, levelIndex, e)}
                onClick={(e) => {
                  e.preventDefault();
                  if (hasValidPath) {
                    handleNavigation(item.path);
                  } else if (hasChildren) {
                    handleSubMenuHover(item, levelIndex, e);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.18rem 0.8rem',
                  cursor: hasValidPath || hasChildren ? 'pointer' : 'default',
                  backgroundColor: isActive ? '#e8f0fe' : isHovered ? '#f0f8ff' : 'transparent',
                  borderLeft: isActive ? '4px solid #1b69e7' : isHovered ? '4px solid #a0c4ff' : '4px solid transparent',
                  transition: 'all 0.2s ease',
                  margin: '0.1rem 0',
                  borderRadius: '0 4px 4px 0',
                  position: 'relative',
                }}
              >
                {IconComponent && (
                  <IconComponent
                    size={18}
                    style={{
                      marginRight: '0.75rem',
                      color: isActive ? '#1b69e7' : isHovered ? '#1b69e7' : '#555',
                      transition: 'color 0.2s ease'
                    }}
                  />
                )}
                <span style={{
                  flex: 1,
                  fontSize: '0.85rem',
                  color: isActive ? '#1b69e7' : isHovered ? '#1b69e7' : '#333',
                  fontWeight: isActive ? '600' : isHovered ? '500' : '400',
                  transition: 'all 0.2s ease'
                }}>
                  {item.name}
                </span>

                {hasValidPath && (
                  <div
                    style={{
                      marginLeft: '0.5rem',
                      cursor: 'pointer',
                      color: isPinned(item.path) ? '#1b69e7' : '#999',
                      transition: 'color 0.2s ease'
                    }}
                    onClick={(e) => handlePinClick(item, e)}
                    onMouseEnter={(e) => e.stopPropagation()}
                  >
                    {/* {isPinned(item.path) ? <MdPushPin size={20} /> : <MdOutlinePushPin size={20} />} */}
                  </div>
                )}

                {hasChildren && (
                  <MdChevronRight
                    size={16}
                    style={{
                      color: isHovered ? '#1b69e7' : '#777',
                      transition: 'color 0.2s ease',
                      marginLeft: '0.5rem'
                    }}
                  />
                )}
              </div>

              {/* Add divider after each menu item except the last one */}
              {index < items.length - 1 && (
                <div style={{
                  height: '1px',
                  backgroundColor: '#e8f0fe',
                  margin: '0.1rem 0.8rem',
                }} />
              )}
            </div>
          );
        })}
      </div>
    );
  };
  // Render mega menu with all levels
  const renderMegaMenu = () => {
    if (!openMegaMenu || megaMenuLevels.length === 0) return null;

    try {
      return (
        <div
          ref={megaMenuRef}
          style={{
            position: 'fixed',
            top: `${megaMenuPosition.top}px`,
            left: `${megaMenuPosition.left}px`,
            backgroundColor: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            zIndex: 1001,
            display: 'flex',
            minHeight: '400px',
            maxHeight: '600px',
            minWidth: `${250 * Math.min(megaMenuLevels.length, 4)}px`,
            maxWidth: '1000px',
            overflow: 'hidden',
          }}
          onMouseLeave={closeMegaMenu}
        >
          {megaMenuLevels.map((level, index) =>
            renderMenuLevel(
              level,
              index,
              index === 0 ? hoveredItems[0]?.name : null
            )
          )}
        </div>
      );
    } catch (error) {
      console.error('Error rendering mega menu:', error);
      return null;
    }
  };

  // Render main menu items
  const renderMainMenu = (items) => {
    return items.map((item, index) => {
      const IconComponent = item.icon;
      const hasChildren = item.children && item.children.length > 0;
      const isActive = activeItem === item.path;
      const isHovered = hoveredItems[0]?.name === item.name;

      return (
        <li key={`${item.name}-${index}`} style={{ marginBottom: '0.2rem' }}>
          <div
            onClick={(e) => {
              e.preventDefault();
              // Always navigate if there's a valid path, even if the item has children
              if (item.path && item.path !== '#') {
                handleNavigation(item.path);
              } else if (hasChildren) {
                // If no path but has children, just open the mega menu (handled by onMouseEnter)
                handleMainMenuHover(item, e);
              }
            }}
            onMouseEnter={(e) => {
              if (hasChildren) {
                handleMainMenuHover(item, e);
              } else {
                // Close mega menu if the item has no children
                closeMegaMenu();
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.5rem 0.8rem',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              userSelect: 'none',
              backgroundColor: isActive ? '#e8f0fe' : isHovered ? '#f0f8ff' : 'transparent',
              color: isActive ? '#1b69e7' : '#333',
              fontSize: '0.85rem',
              fontWeight: isActive ? '600' : '500',
              border: isActive ? '1px solid #1b69e7' : '1px solid transparent',
            }}
          >
            {IconComponent && (
              <span style={{
                fontSize: '1.1rem',
                minWidth: '24px',
                display: 'flex',
                justifyContent: 'center',
                marginRight: isCollapsed ? 0 : '0.75rem',
                // color: isActive ? '#1b69e7' : isHovered ? '#1b69e7' : '#555',
                color: '#635bff',
                transition: 'color 0.2s ease'
              }}>
                <IconComponent size={20} />
              </span>
            )}
            {!isCollapsed && (
              <>
                <span style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  flex: 1,
                }}>
                  {item.name}
                </span>
                {hasChildren && (
                  <span style={{
                    color: isHovered ? '#1b69e7' : '#777',
                    transition: 'color 0.2s ease'
                  }}>
                    <MdChevronRight size={16} />
                  </span>
                )}
              </>
            )}
          </div>
        </li>
      );
    });
  };

  return (
    <>
      <div
        ref={sidebarRef}
        onMouseLeave={() => {
          setTimeout(() => {
            if (megaMenuRef.current && !megaMenuRef.current.matches(':hover')) {
              closeMegaMenu();
            }
          }, 150);
        }}
        style={{
          backgroundColor: '#fff',
          color: '#333',
          height: '100vh',
          position: 'fixed',
          borderRight: '1px solid #e0e0e0',
          left: 0,
          top: 0,
          width: isCollapsed ? '70px' : '260px',
          transition: 'width 0.3s ease',
          padding: '0.8rem 0.6rem',
          overflow: 'hidden',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '2px 0 15px rgba(0,0,0,0.05)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          padding: '0 0.5rem',
        }}>
          {!isCollapsed && (
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
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              background: 'none',
              border: 'none',
              color: '#555',
              fontSize: '1.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              marginLeft: !isCollapsed ? 'auto' : 0,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {isCollapsed ? <MdMenu color={'#635bff'} size={22} /> : <MdClose size={22} />}
          </button>
        </div>

        {/* Menu Items */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          maxHeight: 'calc(100vh - 100px)',
          paddingRight: '4px',
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

      {/* Mega Menu */}
      {renderMegaMenu()}

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