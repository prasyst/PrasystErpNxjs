
// 'use client';

// import { useCallback, useEffect, useRef, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { usePathname } from 'next/navigation';
// import {
//   MdPushPin, MdOutlinePushPin, MdChevronRight, MdSearch, MdClear, MdMenu,
//   MdClose, MdDashboard, MdOutlineApartment, MdInventory, MdDomain, MdPeople,
//   MdCategory, MdLocalMall, MdCollectionsBookmark, MdBrandingWatermark,
//   MdStraighten, MdBuild, MdAssignment, MdGavel, MdEvent
// } from 'react-icons/md';
// import { FaTruck, FaUserTag, FaBoxes, FaBalanceScale, FaHandshake } from 'react-icons/fa';
// import { AiOutlineNodeIndex } from 'react-icons/ai';
// import { TiTicket } from 'react-icons/ti';
// import { usePin } from '../../app/hooks/usePin';
// import { useRecentPaths } from '../../app/context/RecentPathsContext';
// import axiosInstance from '@/lib/axios';

// const Sidebar = ({ isCollapsed, setIsCollapsed, isMobile, isOpen, onClose }) => {
//   const sidebarRef = useRef(null);
//   const router = useRouter();
//   const pathname = usePathname();
//   const [activeItem, setActiveItem] = useState('');
//   const [openSections, setOpenSections] = useState({});
//   const { pinnedModules, pinModule, unpinModule, isPinned } = usePin();
//   const { addRecentPath } = useRecentPaths();
//   const [showPinConfirm, setShowPinConfirm] = useState(null);
//   const [showUnpinConfirm, setShowUnpinConfirm] = useState(null);
//   const [hasOpenSubmenu, setHasOpenSubmenu] = useState(false);
//   const [activeChild, setActiveChild] = useState(null);
//   const [activeGrandchild, setActiveGrandchild] = useState(null);
//   const [activeParent, setActiveParent] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const searchInputRef = useRef(null);
//   const [activeGreatGrandchild, setActiveGreatGrandchild] = useState(null);
//   const [isSearchFocused, setIsSearchFocused] = useState(false);
//   const [menuItems, setMenuItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [userId, setUserId] = useState(null);
//   const [companyName, setCompanyName] = useState('Prasyst');

//   // Track if user has manually interacted with sidebar
//   const [isUserInteracted, setIsUserInteracted] = useState(false);

//   // Get userId from localStorage - ye useEffect replace karo
// useEffect(() => {
//   // Directly get USER_ID from localStorage
//   const userIdFromStorage = localStorage.getItem('USER_ID');
//   if (userIdFromStorage) {
//     setUserId(userIdFromStorage);
//     console.log('User ID from localStorage:', userIdFromStorage);
//   } else {
//     // Fallback to user object if exists
//     const userData = localStorage.getItem('user');
//     if (userData) {
//       try {
//         const parsedUser = JSON.parse(userData);
//         setUserId(parsedUser.USER_ID || parsedUser.userId || null);
//       } catch (error) {
//         console.error('Error parsing user data:', error);
//       }
//     }
//   }
// }, []);

//   // Fetch company name from API
//   useEffect(() => {
//     const fetchCompanyName = async () => {
//       try {
//         const response = await fetch('/api/company/name');
//         if (response.ok) {
//           const data = await response.json();
//           setCompanyName(data.companyName || 'Prasyst');
//         }
//       } catch (error) {
//         console.error('Failed to fetch company name:', error);
//         const storedName = localStorage.getItem('companyName');
//         if (storedName) {
//           setCompanyName(storedName);
//         }
//       }
//     };

//     fetchCompanyName();
//   }, []);

//  // Fetch menu items from API - temporary fix with hardcoded ID
// useEffect(() => {
//   const fetchMenuItems = async () => {
//     // Temporary: Use hardcoded ID 1 for testing
//     const effectiveUserId = "1";

//     try {
//       setLoading(true);
//       console.log('Fetching menus for user ID:', effectiveUserId);

//       const response = await axiosInstance.post('/MODULE/RetriveWebUserprivs', {
//         "FLAG": "UR",
//         "TBLNAME": "WebUserprivs",
//         "FLDNAME": "User_Id",
//         "ID": effectiveUserId,
//         "ORDERBYFLD": "",
//         "CWHAER": "",
//         "CO_ID": ""
//       });

//       console.log('Menu API Response:', response.data);

//       if (response.data && response.data.DATA && response.data.DATA.length > 0) {
//         const validData = response.data.DATA.filter(item => item.MOD_NAME || item.MOD_DESC);
//         const menuTree = buildMenuTree(validData);
//         setMenuItems(menuTree);
//         console.log('Menu tree built:', menuTree);
//       } else {
//         console.log('No menu data received');
//         setMenuItems([]);
//       }
//     } catch (error) {
//       console.error('Error fetching menu items:', error);
//       setMenuItems([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchMenuItems();
// }, []); // Remove userId dependency for testing

//   // Build menu tree from flat API data - ye function replace karo
// const buildMenuTree = (data) => {
//   const itemMap = {};
//   const rootItems = [];
//   const allItemIds = new Set();

//   // First pass: Create all items and collect all IDs
//   data.forEach(item => {
//     if (!item.MOD_ID) return;
//     allItemIds.add(item.MOD_ID.toString());
//   });

//   // Second pass: Create all items with permissions
//   data.forEach(item => {
//     if (!item.MOD_ID) return;

//     const hasPermission = 
//       item.ADD_PRIV === "1" || 
//       item.EDIT_PRIV === "1" || 
//       item.DELETE_PRIV === "1" || 
//       item.SELECT_PRIV === "1";

//     // Include if has permission OR if it's a parent of a permitted item
//     if (hasPermission || (item.PARENT_ID && allItemIds.has(item.PARENT_ID.toString()))) {
//       itemMap[item.MOD_ID] = {
//         id: item.MOD_ID,
//         name: item.MOD_DESC || item.MOD_NAME || `Module ${item.MOD_ID}`,
//         path: item.MOD_ROUTIG || '#',
//         parentId: item.PARENT_ID === "0" || item.PARENT_ID === 0 || !item.PARENT_ID ? null : item.PARENT_ID.toString(),
//         children: [],
//         icon: getIconForModule(item.MOD_NAME || item.MOD_DESC),
//         permissions: {
//           add: item.ADD_PRIV === "1",
//           edit: item.EDIT_PRIV === "1",
//           delete: item.DELETE_PRIV === "1",
//           view: item.SELECT_PRIV === "1"
//         }
//       };
//     }
//   });

//   // Third pass: Add parent items if they don't exist but have children
//   const additionalParents = new Set();
//   Object.values(itemMap).forEach(item => {
//     if (item.parentId && !itemMap[item.parentId]) {
//       additionalParents.add(item.parentId);
//     }
//   });

//   // Fetch parent items from original data
//   if (additionalParents.size > 0) {
//     data.forEach(item => {
//       if (additionalParents.has(item.MOD_ID.toString()) && !itemMap[item.MOD_ID]) {
//         itemMap[item.MOD_ID] = {
//           id: item.MOD_ID,
//           name: item.MOD_DESC || item.MOD_NAME || `Module ${item.MOD_ID}`,
//           path: item.MOD_ROUTIG || '#',
//           parentId: item.PARENT_ID === "0" || item.PARENT_ID === 0 || !item.PARENT_ID ? null : item.PARENT_ID.toString(),
//           children: [],
//           icon: getIconForModule(item.MOD_NAME || item.MOD_DESC),
//           permissions: {
//             add: false,
//             edit: false,
//             delete: false,
//             view: false
//           }
//         };
//       }
//     });
//   }

//   // Build hierarchy
//   Object.values(itemMap).forEach(item => {
//     if (item.parentId && itemMap[item.parentId]) {
//       itemMap[item.parentId].children.push(item);
//     } else {
//       rootItems.push(item);
//     }
//   });

//   // Sort items
//   const sortItems = (items) => {
//     items.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
//     items.forEach(item => {
//       if (item.children.length > 0) {
//         sortItems(item.children);
//       }
//     });
//   };

//   sortItems(rootItems);
//   console.log('Final Menu Tree:', rootItems);
//   return rootItems;
// };

//   // Get icon based on module name
//   const getIconForModule = (moduleName) => {
//     if (!moduleName) return MdOutlineApartment;

//     const name = moduleName.toLowerCase();
//     const iconMap = {
//       'dashboard': MdDashboard,
//       'masters': MdOutlineApartment,
//       'inventory': MdInventory,
//       'ticketing': TiTicket,
//       'company': MdDomain,
//       'company master': MdDomain,
//       'vendors': FaTruck,
//       'creditors/suppliers': FaUserTag,
//       'customers': MdPeople,
//       'debtors/customers': MdPeople,
//       'products': FaBoxes,
//       'category master': MdCategory,
//       'product group': AiOutlineNodeIndex,
//       'product master': MdLocalMall,
//       'brand master': MdBrandingWatermark,
//       'unit master': MdStraighten,
//       'rackmst': MdBuild,
//       'prod series': MdAssignment,
//       'tax/terms': FaBalanceScale,
//       'tax master': MdGavel,
//       'terms master': MdAssignment,
//       'sales/dispatch': FaBoxes,
//       'sampling & development': FaBoxes,
//       'quality control': MdBuild,
//       'qc master': MdBuild,
//       'stores': FaHandshake,
//       'raw material': MdBuild,
//       'finished goods': MdBuild,
//       'semi finished': MdBuild
//     };

//     // Find matching icon
//     for (const [key, icon] of Object.entries(iconMap)) {
//       if (name.includes(key)) {
//         return icon;
//       }
//     }

//     return MdOutlineApartment; // Default icon
//   };

//   // Main navigation function with recent path tracking
//   const handleNavigationWithTracking = (path, name, isGrandchild = false) => {
//     console.log('Navigating to:', path, 'name:', name, 'isGrandchild:', isGrandchild);

//     if (path && path !== '#') {
//       if (isGrandchild) {
//         addRecentPath(path, name);
//       }
//       router.push(path);
//       setIsUserInteracted(true);
//       if (isMobile && isGrandchild) {
//         onClose();
//       }
//     }
//   };

//   const toggleSection = (name) => {
//     setIsUserInteracted(true);
//     setOpenSections(prev => {
//       const newState = { ...prev };
//       if (newState[name]) {
//         delete newState[name];
//       } else {
//         newState[name] = true;
//       }
//       setHasOpenSubmenu(Object.keys(newState).length > 0);
//       return newState;
//     });
//   };

//   // Handle parent click
//   const handleParentClick = (item, e) => {
//     e.stopPropagation();
//     setIsUserInteracted(true);

//     setActiveParent(item.name);
//     setActiveChild(null);
//     setActiveGrandchild(null);

//     if (item.children && item.children.length > 0) {
//       toggleSection(item.name);
//     }

//     if (item.path && item.path !== '#') {
//       handleNavigationWithTracking(item.path, item.name, false);
//     }
//   };

//   // Handle child click
//   const handleChildClick = (child, parentName, e) => {
//     e.stopPropagation();
//     setIsUserInteracted(true);

//     setActiveParent(parentName);
//     setActiveChild(child.name);
//     setActiveGrandchild(null);
//     setActiveGreatGrandchild(null);

//     if (child.children && child.children.length > 0) {
//       toggleSection(child.name);
//     }

//     if (child.path && child.path !== '#') {
//       handleNavigationWithTracking(child.path, child.name, false);
//     }

//     setOpenSections(prev => ({ ...prev, [parentName]: true }));
//   };

//   // Handle grandchild click
//   const handleGrandchildClick = (grandchild, parentName, childName, e) => {
//     e.stopPropagation();
//     setIsUserInteracted(true);

//     setActiveParent(parentName);
//     setActiveChild(childName);
//     setActiveGrandchild(grandchild.name);

//     setOpenSections(prev => ({
//       ...prev,
//       [parentName]: true,
//       [childName]: true
//     }));

//     if (grandchild.path && grandchild.path !== '#') {
//       handleNavigationWithTracking(grandchild.path, grandchild.name, true);
//     }

//     if (isMobile) onClose();
//   };

//   // Item matches search
//   const itemMatchesSearch = (item, query) => {
//     if (!query.trim()) return true;
//     if (!item || !item.name) return false;

//     const searchLower = query.toLowerCase().trim();
//     const itemNameLower = item.name.toLowerCase();

//     if (itemNameLower.includes(searchLower)) return true;

//     if (item.children) {
//       return item.children.some(child => itemMatchesSearch(child, query));
//     }

//     return false;
//   };

//   // Filter menu tree
//   const filterMenuTree = (items, query) => {
//     if (!query.trim()) return items.filter(item => item);

//     return items
//       .filter(item => {
//         if (!item) return false;
//         return itemMatchesSearch(item, query);
//       })
//       .map(item => {
//         if (!item.children || item.children.length === 0) return item;

//         const filteredChildren = filterMenuTree(item.children, query);

//         if (filteredChildren.length > 0 || itemMatchesSearch(item, query)) {
//           return {
//             ...item,
//             children: filteredChildren
//           };
//         }

//         return item;
//       });
//   };

//   const getFilteredMenuItems = () => {
//     if (!searchQuery.trim()) return menuItems.filter(item => item);
//     return filterMenuTree(menuItems, searchQuery);
//   };

//   const highlightText = (text, query) => {
//     if (!query || !text) return text;

//     const lowerText = text.toLowerCase();
//     const lowerQuery = query.toLowerCase();
//     const index = lowerText.indexOf(lowerQuery);

//     if (index === -1) return text;

//     const before = text.substring(0, index);
//     const match = text.substring(index, index + query.length);
//     const after = text.substring(index + query.length);

//     return (
//       <>
//         {before}
//         <span style={{ backgroundColor: '#ffeb3b', fontWeight: 'bold', borderRadius: '2px' }}>{match}</span>
//         {after}
//       </>
//     );
//   };

//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchQuery(value);

//     if (value.trim()) {
//       const filteredItems = filterMenuTree(menuItems, value);
//       const sectionsToOpen = {};

//       const collectParents = (items, parent = null) => {
//         items.forEach(item => {
//           if (!item) return;

//           if (parent && itemMatchesSearch(item, value)) {
//             sectionsToOpen[parent.name] = true;
//           }

//           if (item.children) {
//             collectParents(item.children, item);
//           }
//         });
//       };

//       collectParents(filteredItems);
//       setOpenSections(prev => ({ ...prev, ...sectionsToOpen }));
//     }
//   };

//   const clearSearch = () => {
//     setSearchQuery('');
//     setOpenSections({});
//     if (searchInputRef.current) {
//       searchInputRef.current.focus();
//     }
//   };

//   const handleSearchFocus = (e) => {
//     e.stopPropagation();
//     setIsSearchFocused(true);
//     setIsUserInteracted(true);

//     if (isMobile) {
//       e.currentTarget.style.borderColor = '#635bff';
//       e.currentTarget.style.boxShadow = '0 0 0 2px rgba(99, 91, 255, 0.1)';
//     }
//   };

//   const handleSearchBlur = (e) => {
//     e.target.style.borderColor = '#ddd';
//     e.target.style.boxShadow = 'none';
//     setIsSearchFocused(false);
//   };

//   // Prevent sidebar close when search input is clicked on mobile
//   useEffect(() => {
//     const handleOutsideClick = (e) => {
//       if (isMobile && isOpen && sidebarRef.current &&
//         !sidebarRef.current.contains(e.target) &&
//         !isSearchFocused) {
//         onClose();
//       }
//     };

//     document.addEventListener('mousedown', handleOutsideClick);
//     document.addEventListener('touchstart', handleOutsideClick);

//     return () => {
//       document.removeEventListener('mousedown', handleOutsideClick);
//       document.removeEventListener('touchstart', handleOutsideClick);
//     };
//   }, [isMobile, isOpen, onClose, isSearchFocused]);

//   // Set active states based on current path
//   useEffect(() => {
//     const findActiveItems = (items) => {
//       for (const item of items) {
//         if (!item) continue;

//         if (item.path === pathname) {
//           setActiveParent(item.name);
//           setActiveChild(null);
//           setActiveGrandchild(null);
//           return true;
//         }

//         if (item.children) {
//           for (const child of item.children) {
//             if (!child) continue;

//             if (child.path === pathname) {
//               setActiveParent(item.name);
//               setActiveChild(child.name);
//               setActiveGrandchild(null);
//               setOpenSections(prev => ({ ...prev, [item.name]: true }));
//               return true;
//             }

//             if (child.children) {
//               for (const grandchild of child.children) {
//                 if (!grandchild) continue;

//                 if (grandchild.path === pathname) {
//                   setActiveParent(item.name);
//                   setActiveChild(child.name);
//                   setActiveGrandchild(grandchild.name);
//                   setOpenSections(prev => ({
//                     ...prev,
//                     [item.name]: true,
//                     [child.name]: true
//                   }));
//                   return true;
//                 }
//               }
//             }
//           }
//         }
//       }
//       return false;
//     };

//     if (!findActiveItems(menuItems)) {
//       setActiveParent(null);
//       setActiveChild(null);
//       setActiveGrandchild(null);
//     }
//   }, [pathname, menuItems]);

//   // Reset user interaction flag after navigation
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsUserInteracted(false);
//     }, 100);
//     return () => clearTimeout(timer);
//   }, [pathname]);

//   const filteredMenuItems = getFilteredMenuItems();

//   const handlePinClick = (item, event) => {
//     event.stopPropagation();

//     if (isPinned(item.path)) {
//       setShowUnpinConfirm(item);
//     } else {
//       setShowPinConfirm(item);
//     }
//   };

//   const confirmPin = (item) => {
//     pinModule({
//       name: item.name,
//       path: item.path,
//       icon: item.icon
//     });
//     setShowPinConfirm(null);
//   };

//   const confirmUnpin = (item) => {
//     unpinModule({
//       name: item.name,
//       path: item.path,
//       icon: item.icon
//     });
//     setShowUnpinConfirm(null);
//   };

//   const handleMobileMenuToggle = () => {
//     if (isMobile) {
//       onClose();
//     }
//   };

//   const renderMainMenu = useCallback((items) => {
//     return items
//       .filter(item => item && item.name)
//       .map((item, index) => {
//         const IconComponent = item.icon;
//         const hasChildren = item.children && item.children.length > 0;
//         const isOpen = openSections[item.name] || (searchQuery.trim() && hasChildren);
//         const isActive = activeParent === item.name;

//         return (
//           <div key={item.id || index}>
//             <div
//               onClick={(e) => handleParentClick(item, e)}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.backgroundColor = isActive ? '#5ba8ffff' : '#f0f2ff';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.backgroundColor = isActive ? '#5ba8ffff' : 'transparent';
//               }}
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 padding: '0.45rem 0.2rem',
//                 cursor: 'pointer',
//                 backgroundColor: isActive ? '#5ba8ffff' : 'transparent',
//                 color: isActive ? 'white' : '#333',
//                 transition: 'all 0.2s ease',
//                 margin: '0.10rem 0.4rem',
//                 borderRadius: '6px',
//                 border: searchQuery.trim() ? '1px solid #e0e0e0' : 'none',
//               }}
//             >
//               {IconComponent && (
//                 <IconComponent
//                   size={20}
//                   style={{
//                     marginRight: isCollapsed ? 0 : '12px',
//                     minWidth: '24px',
//                     color: isActive ? 'white' : '#635bff',
//                   }}
//                 />
//               )}
//               {!isCollapsed && (
//                 <>
//                   <span style={{
//                     flex: 1,
//                     fontWeight: isActive ? 600 : 500,
//                   }}>
//                     {searchQuery.trim() ? highlightText(item.name, searchQuery) : item.name}
//                   </span>
//                   {hasChildren && (
//                     <MdChevronRight
//                       size={18}
//                       style={{
//                         transform: isOpen ? 'rotate(90deg)' : 'rotate(0)',
//                         transition: 'transform 0.25s ease',
//                         color: isActive ? 'white' : '#777',
//                       }}
//                     />
//                   )}
//                 </>
//               )}
//             </div>

//             {hasChildren && isOpen && !isCollapsed && (
//               <div style={{ marginLeft: '10px', borderLeft: '2px solid #e0e0e0', paddingLeft: '12px' }}>
//                 {item.children
//                   .filter(child => child && child.name)
//                   .map((child) => {
//                     const ChildIcon = child.icon;
//                     const childIsOpen = openSections[child.name] || (searchQuery.trim() && child.children);
//                     const hasGrandChildren = child.children && child.children.length > 0;
//                     const isChildActive = activeChild === child.name;

//                     return (
//                       <div key={child.id}>
//                         <div
//                           onClick={(e) => handleChildClick(child, item.name, e)}
//                           onMouseEnter={(e) => {
//                             e.currentTarget.style.backgroundColor = isChildActive ? '#5ba8ffff' : '#f0f2ff';
//                           }}
//                           onMouseLeave={(e) => {
//                             e.currentTarget.style.backgroundColor = isChildActive ? '#5ba8ffff' : 'transparent';
//                           }}
//                           style={{
//                             display: 'flex',
//                             alignItems: 'center',
//                             padding: '0.5rem 0.2rem',
//                             cursor: 'pointer',
//                             borderRadius: '6px',
//                             margin: '2px 0',
//                             backgroundColor: isChildActive ? '#5ba8ffff' : 'transparent',
//                             color: isChildActive ? 'white' : '#444',
//                             fontWeight: isChildActive ? 600 : 500,
//                             transition: 'all 0.2s ease',
//                           }}
//                         >
//                           {ChildIcon && (
//                             <ChildIcon
//                               size={18}
//                               style={{
//                                 marginRight: '5px',
//                                 color: isChildActive ? 'white' : '#635bff',
//                                 transition: 'color 0.2s ease',
//                               }}
//                             />
//                           )}
//                           <span style={{ flex: 1, fontSize: '0.9rem' }}>
//                             {searchQuery.trim() ? highlightText(child.name, searchQuery) : child.name}
//                           </span>

//                           {hasGrandChildren && (
//                             <MdChevronRight
//                               size={16}
//                               style={{
//                                 transform: childIsOpen ? 'rotate(90deg)' : 'rotate(0)',
//                                 transition: 'transform 0.2s',
//                                 color: isChildActive ? 'white' : '#777',
//                               }}
//                             />
//                           )}
//                         </div>

//                         {hasGrandChildren && childIsOpen && (
//                           <div style={{ marginLeft: '8px', paddingLeft: '8px' }}>
//                             {child.children
//                               .filter(grandchild => grandchild && grandchild.name)
//                               .map((grandchild) => {
//                                 const GrandIcon = grandchild.icon;
//                                 const hasPath = grandchild.path && grandchild.path !== '#';
//                                 const isGrandchildActive = activeGrandchild === grandchild.name;

//                                 return (
//                                   <div key={grandchild.id}>
//                                     <div
//                                       onClick={(e) => handleGrandchildClick(grandchild, item.name, child.name, e)}
//                                       style={{
//                                         display: 'flex',
//                                         alignItems: 'center',
//                                         padding: '0.35rem 0.1rem',
//                                         cursor: 'pointer',
//                                         backgroundColor: isGrandchildActive ? '#5ba8ffff' : 'transparent',
//                                         color: isGrandchildActive ? 'white' : '#333',
//                                         borderRadius: '6px',
//                                         margin: '2px 0',
//                                         fontWeight: isGrandchildActive ? 600 : 500,
//                                       }}
//                                     >
//                                       {GrandIcon && (
//                                         <GrandIcon size={16} style={{ marginRight: '6px', color: isGrandchildActive ? 'white' : '#635bff' }} />
//                                       )}
//                                       <span style={{ flex: 1, fontSize: '0.88rem' }}>
//                                         {searchQuery.trim() ? highlightText(grandchild.name, searchQuery) : grandchild.name}
//                                       </span>
//                                       {hasPath && (
//                                         <div
//                                           onClick={(e) => handlePinClick(grandchild, e)}
//                                           style={{
//                                             marginLeft: 'auto',
//                                             color: isPinned(grandchild.path) ? '#635bff' : '#aaa',
//                                             padding: '2px',
//                                             borderRadius: '4px',
//                                           }}
//                                           onMouseEnter={(e) => {
//                                             e.currentTarget.style.backgroundColor = '#f0f2ff';
//                                           }}
//                                           onMouseLeave={(e) => {
//                                             e.currentTarget.style.backgroundColor = 'transparent';
//                                           }}
//                                         >
//                                           {isPinned(grandchild.path) ? (
//                                             <MdPushPin size={15} />
//                                           ) : (
//                                             <MdOutlinePushPin size={15} />
//                                           )}
//                                         </div>
//                                       )}
//                                     </div>
//                                   </div>
//                                 );
//                               })}
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//               </div>
//             )}
//           </div>
//         );
//       });
//   }, [openSections, activeParent, activeChild, activeGrandchild, isCollapsed, searchQuery]);

//   // Loading state
//   if (loading) {
//     return (
//       <div
//         ref={sidebarRef}
//         style={{
//           backgroundColor: '#fff',
//           height: '100vh',
//           position: 'fixed',
//           borderRight: '1px solid #e0e0e0',
//           left: 0,
//           top: 0,
//           width: isMobile ? (isOpen ? '270px' : '0') : (isCollapsed ? '77px' : '240px'),
//           transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
//           padding: isMobile ? (isOpen ? '0.8rem 0.6rem' : '0') : '0.8rem 0.6rem',
//           overflow: 'hidden',
//           zIndex: 1000,
//           display: 'flex',
//           flexDirection: 'column',
//           opacity: isMobile ? (isOpen ? 1 : 0) : 1,
//           visibility: isMobile ? (isOpen ? 'visible' : 'hidden') : 'visible',
//         }}
//       >
//         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
//           <div>Loading menus...</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div
//         ref={sidebarRef}
//         onClick={(e) => {
//           if (!e.target.closest('input') && isMobile && isOpen && !isSearchFocused) {
//             onClose();
//           }
//         }}
//         onTouchStart={(e) => e.stopPropagation()}
//         style={{
//           backgroundColor: '#fff',
//           color: '#0e0d0dff',
//           height: '100vh',
//           position: 'fixed',
//           borderRight: '1px solid #e0e0e0',
//           left: 0,
//           top: 0,
//           width: isMobile
//             ? (isOpen ? '270px' : '0')
//             : (isCollapsed ? '77px' : '240px'),
//           transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
//           padding: isMobile ? (isOpen ? '0.8rem 0.6rem' : '0') : '0.8rem 0.6rem',
//           overflow: 'hidden',
//           zIndex: 1000,
//           display: 'flex',
//           flexDirection: 'column',
//           boxShadow: isMobile ? '2px 0 15px rgba(0,0,0,0.1)' : '2px 0 15px rgba(0,0,0,0.05)',
//           opacity: isMobile ? (isOpen ? 1 : 0) : 1,
//           visibility: isMobile ? (isOpen ? 'visible' : 'hidden') : 'visible',
//         }}
//       >
//         {/* HEADER */}
//         <div style={{
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: isCollapsed && !isMobile ? 'center' : 'space-between',
//           marginBottom: '1rem',
//           padding: '0 0.5rem',
//           minHeight: '40px',
//         }}>
//           {(!isCollapsed || isMobile) && (
//             <h2 style={{
//               fontSize: '1.3rem',
//               fontWeight: '700',
//               margin: 0,
//               whiteSpace: 'nowrap',
//               color: '#1b69e7',
//               letterSpacing: '0.5px',
//             }}>
//               {companyName}
//             </h2>
//           )}

//           {isMobile && isOpen && (
//             <button
//               onClick={handleMobileMenuToggle}
//               style={{
//                 background: 'none',
//                 border: 'none',
//                 cursor: 'pointer',
//                 color: '#635bff',
//                 padding: '0.25rem',
//                 borderRadius: '4px',
//                 transition: 'background-color 0.2s',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: '40px',
//                 height: '40px',
//               }}
//               title="Close sidebar"
//               onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f2ff'}
//               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
//             >
//               <MdClose size={24} />
//             </button>
//           )}

//           {!isMobile && (
//             <button
//               onClick={() => {
//                 setIsUserInteracted(true);
//                 setIsCollapsed(!isCollapsed);
//                 if (!isCollapsed && !activeChild && !activeGrandchild) {
//                   setOpenSections({});
//                   setHasOpenSubmenu(false);
//                 }
//               }}
//               style={{
//                 background: 'none',
//                 border: 'none',
//                 cursor: 'pointer',
//                 color: '#635bff',
//                 padding: '0.25rem',
//                 borderRadius: '4px',
//                 transition: 'background-color 0.2s',
//               }}
//               title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
//               onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f2ff'}
//               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
//             >
//               <MdMenu size={24} />
//             </button>
//           )}
//         </div>

//         {/* SEARCH BOX */}
//         {(!isCollapsed || isMobile) && (
//           <div style={{
//             marginBottom: '1rem',
//             padding: '0 0.5rem',
//           }}>
//             <div style={{
//               position: 'relative',
//               display: 'flex',
//               alignItems: 'center',
//             }}>
//               <div
//                 onClick={(e) => {
//                   e.preventDefault();
//                   e.stopPropagation();
//                   if (searchInputRef.current) {
//                     searchInputRef.current.focus();
//                     setIsUserInteracted(true);
//                   }
//                 }}
//                 style={{
//                   position: 'absolute',
//                   left: '10px',
//                   color: '#999',
//                   zIndex: 1,
//                   cursor: 'pointer',
//                   padding: '2px',
//                   borderRadius: '4px',
//                 }}
//                 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f2ff'}
//                 onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
//                 title="Click to search"
//               >
//                 <MdSearch size={20} />
//               </div>

//               <input
//                 ref={searchInputRef}
//                 type="text"
//                 placeholder="Search menus..."
//                 value={searchQuery}
//                 onChange={handleSearchChange}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setIsUserInteracted(true);
//                 }}
//                 onFocus={handleSearchFocus}
//                 onBlur={handleSearchBlur}
//                 onKeyDown={(e) => {
//                   e.stopPropagation();
//                   setIsUserInteracted(true);
//                 }}
//                 onTouchStart={(e) => {
//                   e.stopPropagation();
//                   setIsUserInteracted(true);
//                   handleSearchFocus(e);
//                 }}
//                 onTouchEnd={(e) => {
//                   e.stopPropagation();
//                 }}
//                 style={{
//                   width: '100%',
//                   padding: '0.5rem 0.5rem 0.5rem 2.5rem',
//                   border: '1px solid #ddd',
//                   borderRadius: '6px',
//                   fontSize: '0.9rem',
//                   outline: 'none',
//                   transition: 'all 0.2s',
//                   backgroundColor: '#f8f9fa',
//                   WebkitUserSelect: 'text',
//                   userSelect: 'text',
//                 }}
//                 autoCapitalize="off"
//                 autoCorrect="off"
//                 spellCheck="false"
//                 enterKeyHint="search"
//               />
//               {searchQuery && (
//                 <MdClear
//                   size={18}
//                   onClick={(e) => {
//                     e.preventDefault();
//                     e.stopPropagation();
//                     clearSearch();
//                   }}
//                   onTouchStart={(e) => e.stopPropagation()}
//                   style={{
//                     position: 'absolute',
//                     right: '10px',
//                     color: '#999',
//                     cursor: 'pointer',
//                     zIndex: 1,
//                     padding: '2px',
//                     borderRadius: '4px',
//                   }}
//                   onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f2ff'}
//                   onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
//                   title="Clear search"
//                 />
//               )}
//             </div>
//           </div>
//         )}

//         {/* MENU ITEMS */}
//         <div style={{
//           flex: 1,
//           overflowY: 'auto',
//           overflowX: 'hidden',
//           maxHeight: 'calc(100vh - 180px)',
//           paddingRight: '4px',
//           visibility: isMobile ? (isOpen ? 'visible' : 'hidden') : 'visible',
//         }}>
//           <style>
//             {`
//               ::-webkit-scrollbar {
//                 width: 0px; 
//               }
//             `}
//           </style>

//           {searchQuery.trim() && filteredMenuItems.length === 0 && (
//             <div style={{
//               textAlign: 'center',
//               padding: '2rem 1rem',
//               color: '#666',
//               fontStyle: 'italic',
//             }}>
//               No menu items found for "{searchQuery}"
//             </div>
//           )}

//           {filteredMenuItems.length === 0 && !loading && (
//             <div style={{
//               textAlign: 'center',
//               padding: '2rem 1rem',
//               color: '#666',
//               fontStyle: 'italic',
//             }}>
//               No menus available for your account
//             </div>
//           )}

//           <ul style={{
//             listStyle: 'none',
//             padding: 0,
//             margin: 0,
//           }}>
//             {renderMainMenu(filteredMenuItems)}
//           </ul>
//         </div>
//       </div>

//       {/* PIN CONFIRMATION MODALS */}
//       {showPinConfirm && (
//         <div style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: 'rgba(0,0,0,0.5)',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           zIndex: 2000,
//         }}>
//           <div style={{
//             backgroundColor: 'white',
//             padding: '1.5rem',
//             borderRadius: '8px',
//             maxWidth: '400px',
//             width: '90%',
//             textAlign: 'center',
//           }}>
//             <h3 style={{ marginTop: 0 }}>Pin Module</h3>
//             <p>Are you sure you want to pin "{showPinConfirm.name}" to your quick access?</p>
//             <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
//               <button
//                 onClick={() => setShowPinConfirm(null)}
//                 style={{
//                   padding: '0.5rem 1rem',
//                   border: '1px solid #ccc',
//                   borderRadius: '4px',
//                   backgroundColor: '#f5f5f5',
//                   cursor: 'pointer',
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => confirmPin(showPinConfirm)}
//                 style={{
//                   padding: '0.5rem 1rem',
//                   border: 'none',
//                   borderRadius: '4px',
//                   backgroundColor: '#1b69e7',
//                   color: 'white',
//                   cursor: 'pointer',
//                 }}
//               >
//                 Yes, Pin It
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showUnpinConfirm && (
//         <div style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: 'rgba(0,0,0,0.5)',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           zIndex: 2000,
//         }}>
//           <div style={{
//             backgroundColor: 'white',
//             padding: '1.5rem',
//             borderRadius: '8px',
//             maxWidth: '400px',
//             width: '90%',
//             textAlign: 'center',
//           }}>
//             <h3 style={{ marginTop: 0 }}>Unpin Module</h3>
//             <p>Are you sure you want to unpin "{showUnpinConfirm.name}" from your quick access?</p>
//             <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
//               <button
//                 onClick={() => setShowUnpinConfirm(null)}
//                 style={{
//                   padding: '0.5rem 1rem',
//                   border: '1px solid #ccc',
//                   borderRadius: '4px',
//                   backgroundColor: '#f5f5f5',
//                   cursor: 'pointer',
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => confirmUnpin(showUnpinConfirm)}
//                 style={{
//                   padding: '0.5rem 1rem',
//                   border: 'none',
//                   borderRadius: '4px',
//                   backgroundColor: '#ff4d4f',
//                   color: 'white',
//                   cursor: 'pointer',
//                 }}
//               >
//                 Yes, Unpin It
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Sidebar;






'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import {
  MdPushPin, MdOutlinePushPin, MdChevronRight, MdSearch, MdClear, MdMenu,
  MdClose, MdDashboard, MdOutlineApartment, MdInventory, MdDomain, MdPeople,
  MdCategory, MdLocalMall, MdCollectionsBookmark, MdBrandingWatermark,
  MdStraighten, MdBuild, MdAssignment, MdGavel, MdEvent
} from 'react-icons/md';
import { FaTruck, FaUserTag, FaBoxes, FaBalanceScale, FaHandshake } from 'react-icons/fa';
import { AiOutlineNodeIndex } from 'react-icons/ai';
import { TiTicket } from 'react-icons/ti';
import { usePin } from '../../app/hooks/usePin';
import { useRecentPaths } from '../../app/context/RecentPathsContext';
import axiosInstance from '@/lib/axios';

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
  const [activeGreatGrandchild, setActiveGreatGrandchild] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [companyName, setCompanyName] = useState('Prasyst');

  // Track if user has manually interacted with sidebar
  const [isUserInteracted, setIsUserInteracted] = useState(false);

  // Get userId from localStorage - ye useEffect replace karo
  useEffect(() => {
    // Directly get USER_ID from localStorage
    const userIdFromStorage = localStorage.getItem('USER_ID');
    if (userIdFromStorage) {
      setUserId(userIdFromStorage);
      console.log('User ID from localStorage:', userIdFromStorage);
    } else {
      // Fallback to user object if exists
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUserId(parsedUser.USER_ID || parsedUser.userId || null);
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
  }, []);

  // Fetch company name from API
  useEffect(() => {
    const fetchCompanyName = async () => {
      try {
        const response = await fetch('/api/company/name');
        if (response.ok) {
          const data = await response.json();
          setCompanyName(data.companyName || 'Prasyst');
        }
      } catch (error) {
        console.error('Failed to fetch company name:', error);
        const storedName = localStorage.getItem('companyName');
        if (storedName) {
          setCompanyName(storedName);
        }
      }
    };

    fetchCompanyName();
  }, []);

  // Fetch menu items from API - temporary fix with hardcoded ID
  useEffect(() => {
    const fetchMenuItems = async () => {
      // Temporary: Use hardcoded ID 1 for testing
      const effectiveUserId = "1";

      try {
        setLoading(true);
        console.log('Fetching menus for user ID:', effectiveUserId);

        const response = await axiosInstance.post('/MODULE/RetriveWebUserprivs', {
          "FLAG": "UR",
          "TBLNAME": "WebUserprivs",
          "FLDNAME": "User_Id",
          "ID": effectiveUserId,
          "ORDERBYFLD": "",
          "CWHAER": "",
          "CO_ID": ""
        });

        console.log('Menu API Response:', response.data);

        if (response.data && response.data.DATA && response.data.DATA.length > 0) {
          const validData = response.data.DATA.filter(item => item.MOD_NAME || item.MOD_DESC);
          const menuTree = buildMenuTree(validData);
          setMenuItems(menuTree);
          console.log('Menu tree built:', menuTree);
        } else {
          console.log('No menu data received');
          setMenuItems([]);
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []); // Remove userId dependency for testing

  // Build menu tree from flat API data
  const buildMenuTree = (data) => {
    const itemMap = {};
    const rootItems = [];
    const allItemIds = new Set();

    // First pass: Create all items and collect all IDs
    data.forEach(item => {
      if (!item.MOD_ID) return;
      allItemIds.add(item.MOD_ID.toString());
    });

    // Second pass: Create all items with permissions
    data.forEach(item => {
      if (!item.MOD_ID) return;

      const hasPermission =
        item.ADD_PRIV === "1" ||
        item.EDIT_PRIV === "1" ||
        item.DELETE_PRIV === "1" ||
        item.SELECT_PRIV === "1";

      // Include if has permission OR if it's a parent of a permitted item
      if (hasPermission || (item.PARENT_ID && allItemIds.has(item.PARENT_ID.toString()))) {
        itemMap[item.MOD_ID] = {
          id: item.MOD_ID,
          name: item.MOD_DESC || item.MOD_NAME || `Module ${item.MOD_ID}`,
          path: item.MOD_ROUTIG || '#',
          parentId: item.PARENT_ID === "0" || item.PARENT_ID === 0 || !item.PARENT_ID ? null : item.PARENT_ID.toString(),
          children: [],
          icon: getIconForModule(item.MOD_NAME || item.MOD_DESC),
          permissions: {
            add: item.ADD_PRIV === "1",
            edit: item.EDIT_PRIV === "1",
            delete: item.DELETE_PRIV === "1",
            view: item.SELECT_PRIV === "1"
          }
        };
      }
    });

    // Third pass: Add parent items if they don't exist but have children
    const additionalParents = new Set();
    Object.values(itemMap).forEach(item => {
      if (item.parentId && !itemMap[item.parentId]) {
        additionalParents.add(item.parentId);
      }
    });

    // Fetch parent items from original data
    if (additionalParents.size > 0) {
      data.forEach(item => {
        if (additionalParents.has(item.MOD_ID.toString()) && !itemMap[item.MOD_ID]) {
          itemMap[item.MOD_ID] = {
            id: item.MOD_ID,
            name: item.MOD_DESC || item.MOD_NAME || `Module ${item.MOD_ID}`,
            path: item.MOD_ROUTIG || '#',
            parentId: item.PARENT_ID === "0" || item.PARENT_ID === 0 || !item.PARENT_ID ? null : item.PARENT_ID.toString(),
            children: [],
            icon: getIconForModule(item.MOD_NAME || item.MOD_DESC),
            permissions: {
              add: false,
              edit: false,
              delete: false,
              view: false
            }
          };
        }
      });
    }

    // Build hierarchy
    Object.values(itemMap).forEach(item => {
      if (item.parentId && itemMap[item.parentId]) {
        itemMap[item.parentId].children.push(item);
      } else {
        rootItems.push(item);
      }
    });

    // Sort items by MOD_ID (increasing order) - API response ke according
    const sortItemsById = (items) => {
      items.sort((a, b) => (parseInt(a.id) || 0) - (parseInt(b.id) || 0));
      items.forEach(item => {
        if (item.children.length > 0) {
          sortItemsById(item.children);
        }
      });
    };

    sortItemsById(rootItems);
    console.log('Final Menu Tree (ID sorted):', rootItems);
    return rootItems;
  };

  // Get icon based on module name
  const getIconForModule = (moduleName) => {
    if (!moduleName) return MdOutlineApartment;

    const name = moduleName.toLowerCase();
    const iconMap = {
      'dashboard': MdDashboard,
      'masters': MdOutlineApartment,
      'inventory': MdInventory,
      'ticketing': TiTicket,
      'company': MdDomain,
      'company master': MdDomain,
      'vendors': FaTruck,
      'creditors/suppliers': FaUserTag,
      'customers': MdPeople,
      'debtors/customers': MdPeople,
      'products': FaBoxes,
      'category master': MdCategory,
      'product group': AiOutlineNodeIndex,
      'product master': MdLocalMall,
      'brand master': MdBrandingWatermark,
      'unit master': MdStraighten,
      'rackmst': MdBuild,
      'prod series': MdAssignment,
      'tax/terms': FaBalanceScale,
      'tax master': MdGavel,
      'terms master': MdAssignment,
      'sales/dispatch': FaBoxes,
      'sampling & development': FaBoxes,
      'quality control': MdBuild,
      'qc master': MdBuild,
      'stores': FaHandshake,
      'raw material': MdBuild,
      'finished goods': MdBuild,
      'semi finished': MdBuild
    };

    // Find matching icon
    for (const [key, icon] of Object.entries(iconMap)) {
      if (name.includes(key)) {
        return icon;
      }
    }

    return MdOutlineApartment; // Default icon
  };

  // Main navigation function with recent path tracking
  const handleNavigationWithTracking = (path, name, isGrandchild = false) => {
    console.log('Navigating to:', path, 'name:', name, 'isGrandchild:', isGrandchild);

    if (path && path !== '#') {
      if (isGrandchild) {
        addRecentPath(path, name);
      }
      router.push(path);
      setIsUserInteracted(true);
      if (isMobile && isGrandchild) {
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

    setActiveParent(item.name);
    setActiveChild(null);
    setActiveGrandchild(null);

    const itemNameLower = item.name.toLowerCase().trim();
    // if (itemNameLower === 'ticketing' || itemNameLower.includes('ticket')) {
    //   handleNavigationWithTracking('/ticketpage', item.name, false);

    //   // Close mobile sidebar if open
    //   if (isMobile) onClose();

    //   return; // Important: Stop further execution for Ticketing
    // }

    if (item.children && item.children.length > 0) {
      toggleSection(item.name);
    }

    if (item.path && item.path !== '#') {
      handleNavigationWithTracking(item.path, item.name, false);
    }
  };

  // Handle child click
  const handleChildClick = (child, parentName, e) => {
    e.stopPropagation();
    setIsUserInteracted(true);

    setActiveParent(parentName);
    setActiveChild(child.name);
    setActiveGrandchild(null);
    setActiveGreatGrandchild(null);

    if (child.children && child.children.length > 0) {
      toggleSection(child.name);
    }

    if (child.path && child.path !== '#') {
      handleNavigationWithTracking(child.path, child.name, false);
    }

    setOpenSections(prev => ({ ...prev, [parentName]: true }));
  };

  // Handle grandchild click
  const handleGrandchildClick = (grandchild, parentName, childName, e) => {
    e.stopPropagation();
    setIsUserInteracted(true);

    setActiveParent(parentName);
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

    if (isMobile) onClose();
  };

  // Item matches search
  const itemMatchesSearch = (item, query) => {
    if (!query.trim()) return true;
    if (!item || !item.name) return false;

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
    if (!searchQuery.trim()) return menuItems.filter(item => item);
    return filterMenuTree(menuItems, searchQuery);
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
      const filteredItems = filterMenuTree(menuItems, value);
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
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleSearchFocus = (e) => {
    e.stopPropagation();
    setIsSearchFocused(true);
    setIsUserInteracted(true);

    if (isMobile) {
      e.currentTarget.style.borderColor = '#635bff';
      e.currentTarget.style.boxShadow = '0 0 0 2px rgba(99, 91, 255, 0.1)';
    }
  };

  const handleSearchBlur = (e) => {
    e.target.style.borderColor = '#ddd';
    e.target.style.boxShadow = 'none';
    setIsSearchFocused(false);
  };

  // Prevent sidebar close when search input is clicked on mobile
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isMobile && isOpen && sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        !isSearchFocused) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isMobile, isOpen, onClose, isSearchFocused]);

  // Set active states based on current path
  useEffect(() => {
    const findActiveItems = (items) => {
      for (const item of items) {
        if (!item) continue;

        if (item.path === pathname) {
          setActiveParent(item.name);
          setActiveChild(null);
          setActiveGrandchild(null);
          return true;
        }

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

    if (!findActiveItems(menuItems)) {
      setActiveParent(null);
      setActiveChild(null);
      setActiveGrandchild(null);
    }
  }, [pathname, menuItems]);

  // Reset user interaction flag after navigation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsUserInteracted(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [pathname]);

  const filteredMenuItems = getFilteredMenuItems();

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

  const handleMobileMenuToggle = () => {
    if (isMobile) {
      onClose();
    }
  };

  const renderMainMenu = useCallback((items) => {
    return items
      .filter(item => item && item.name)
      .map((item, index) => {
        const IconComponent = item.icon;
        const hasChildren = item.children && item.children.length > 0;
        const isOpen = openSections[item.name] || (searchQuery.trim() && hasChildren);
        const isActive = activeParent === item.name;

        return (
          <div key={item.id || index}>
            <div
              onClick={(e) => handleParentClick(item, e)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isActive ? '#635BFF' : '#f0f2ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isActive ? '#635BFF' : 'transparent';
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.45rem 0.2rem',
                cursor: 'pointer',
                backgroundColor: isActive ? '#635bff' : 'transparent',
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

            {hasChildren && isOpen && !isCollapsed && (
              <div style={{ marginLeft: '10px', borderLeft: '2px solid #e0e0e0', paddingLeft: '12px' }}>
                {item.children
                  .filter(child => child && child.name)
                  .map((child) => {
                    const ChildIcon = child.icon;
                    const childIsOpen = openSections[child.name] || (searchQuery.trim() && child.children);
                    const hasGrandChildren = child.children && child.children.length > 0;
                    const isChildActive = activeChild === child.name;

                    return (
                      <div key={child.id}>
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
                            padding: '0.5rem 0.2rem',
                            cursor: 'pointer',
                            borderRadius: '6px',
                            margin: '2px 0',
                            backgroundColor: isChildActive ? '#5ba8ffff' : 'transparent',
                            color: isChildActive ? 'white' : '#444',
                            fontWeight: isChildActive ? 600 : 500,
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {ChildIcon && (
                            <ChildIcon
                              size={18}
                              style={{
                                marginRight: '5px',
                                color: isChildActive ? 'white' : '#635bff',
                                transition: 'color 0.2s ease',
                              }}
                            />
                          )}
                          <span style={{ flex: 1, fontSize: '0.9rem' }}>
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
                          <div style={{ marginLeft: '8px', paddingLeft: '8px' }}>
                            {child.children
                              .filter(grandchild => grandchild && grandchild.name)
                              .map((grandchild) => {
                                const GrandIcon = grandchild.icon;
                                const hasPath = grandchild.path && grandchild.path !== '#';
                                const isGrandchildActive = activeGrandchild === grandchild.name;

                                return (
                                  <div key={grandchild.id}>
                                    <div
                                      onClick={(e) => handleGrandchildClick(grandchild, item.name, child.name, e)}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '0.35rem 0.1rem',
                                        cursor: 'pointer',
                                        backgroundColor: isGrandchildActive ? '#5ba8ffff' : 'transparent',
                                        color: isGrandchildActive ? 'white' : '#333',
                                        borderRadius: '6px',
                                        margin: '2px 0',
                                        fontWeight: isGrandchildActive ? 600 : 500,
                                      }}
                                    >
                                      {GrandIcon && (
                                        <GrandIcon size={16} style={{ marginRight: '6px', color: isGrandchildActive ? 'white' : '#635bff' }} />
                                      )}
                                      <span style={{ flex: 1, fontSize: '0.88rem' }}>
                                        {searchQuery.trim() ? highlightText(grandchild.name, searchQuery) : grandchild.name}
                                      </span>
                                      {hasPath && (
                                        <div
                                          onClick={(e) => handlePinClick(grandchild, e)}
                                          style={{
                                            marginLeft: 'auto',
                                            color: isPinned(grandchild.path) ? '#635bff' : '#aaa',
                                            padding: '2px',
                                            borderRadius: '4px',
                                          }}
                                          onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#f0f2ff';
                                          }}
                                          onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
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

  // Loading state
  if (loading) {
    return (
      <div
        ref={sidebarRef}
        style={{
          backgroundColor: '#fff',
          height: '100vh',
          position: 'fixed',
          borderRight: '1px solid #e0e0e0',
          left: 0,
          top: 0,
          width: isMobile ? (isOpen ? '270px' : '0') : (isCollapsed ? '77px' : '240px'),
          transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          padding: isMobile ? (isOpen ? '0.8rem 0.6rem' : '0') : '0.8rem 0.6rem',
          overflow: 'hidden',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          opacity: isMobile ? (isOpen ? 1 : 0) : 1,
          visibility: isMobile ? (isOpen ? 'visible' : 'hidden') : 'visible',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <div>Loading menus...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={sidebarRef}
        onClick={(e) => {
          if (!e.target.closest('input') && isMobile && isOpen && !isSearchFocused) {
            onClose();
          }
        }}
        onTouchStart={(e) => e.stopPropagation()}
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
              color: '#635bff',
              letterSpacing: '0.5px',
            }}>
              {companyName}
            </h2>
          )}

          {isMobile && isOpen && (
            <button
              onClick={handleMobileMenuToggle}
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
              onClick={() => {
                setIsUserInteracted(true);
                setIsCollapsed(!isCollapsed);
                if (!isCollapsed && !activeChild && !activeGrandchild) {
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
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (searchInputRef.current) {
                    searchInputRef.current.focus();
                    setIsUserInteracted(true);
                  }
                }}
                style={{
                  position: 'absolute',
                  left: '10px',
                  color: '#999',
                  zIndex: 1,
                  cursor: 'pointer',
                  padding: '2px',
                  borderRadius: '4px',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f2ff'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                title="Click to search"
              >
                <MdSearch size={20} />
              </div>

              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search menus..."
                value={searchQuery}
                onChange={handleSearchChange}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsUserInteracted(true);
                }}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  setIsUserInteracted(true);
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  setIsUserInteracted(true);
                  handleSearchFocus(e);
                }}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                }}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.5rem 0.5rem 2.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: '#f8f9fa',
                  WebkitUserSelect: 'text',
                  userSelect: 'text',
                }}
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck="false"
                enterKeyHint="search"
              />
              {searchQuery && (
                <MdClear
                  size={18}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    clearSearch();
                  }}
                  onTouchStart={(e) => e.stopPropagation()}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    color: '#999',
                    cursor: 'pointer',
                    zIndex: 1,
                    padding: '2px',
                    borderRadius: '4px',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f2ff'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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
          <style>
            {`
              ::-webkit-scrollbar {
                width: 0px; 
              }
            `}
          </style>

          {searchQuery.trim() && filteredMenuItems.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '2rem 1rem',
              color: '#666',
              fontStyle: 'italic',
            }}>
              No menu items found for "{searchQuery}"
            </div>
          )}

          {filteredMenuItems.length === 0 && !loading && (
            <div style={{
              textAlign: 'center',
              padding: '2rem 1rem',
              color: '#666',
              fontStyle: 'italic',
            }}>
              No menus available for your account
            </div>
          )}

          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
          }}>
            {renderMainMenu(filteredMenuItems)}
          </ul>
        </div>
      </div>

      {/* PIN CONFIRMATION MODALS */}
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