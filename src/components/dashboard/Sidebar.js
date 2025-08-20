// 'use client'

// import Link from 'next/link';
// import { useEffect, useRef, useState } from 'react';
// import { useTheme } from '../../../src/app/context/ThemeContext';
// import {
//   MdDashboard, MdSearch, MdShoppingCart, MdInventory, MdPeople,
//   MdAnalytics, MdSettings, MdMenu, MdClose, MdExpandMore, MdExpandLess,
//   MdBusiness, MdMap, MdBuild, MdLocalShipping, MdPeopleAlt, MdAllInbox,
//   MdReceipt, MdGavel, MdEvent, MdCategory, MdOutlineGroupWork, MdPersonAdd,
//   MdLocalOffer, MdClass, MdStars, MdRateReview, MdWork, MdAccountBox,
//   MdDomain, MdWarehouse, MdLocalMall, MdCollectionsBookmark, MdAttachMoney,
//   MdAssignment, MdAccessibility, MdEmojiPeople, MdBrandingWatermark,
//   MdStraighten, MdLibraryBooks, MdOutlineApartment
// } from 'react-icons/md';

// import { FaBoxOpen, FaBuilding, FaTruck, FaUserTag, FaHandshake, FaBalanceScale } from 'react-icons/fa';
// import { AiOutlineUsergroupAdd, AiOutlineNodeIndex } from 'react-icons/ai';

// const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
//   const { theme } = useTheme();
//   const sidebarRef = useRef(null);

//   const [openMenus, setOpenMenus] = useState({
//     Masters: false,
//     Company: false,
//   });

//   const toggleMenu = (name, parentName = null) => {
//     setOpenMenus((prev) => {
//       const newState = { ...prev };
//       if (parentName === 'Masters') {
//         Object.keys(newState).forEach((key) => {
//           if (
//             key !== name &&
//             menuItems.find(item => item.name === 'Masters')?.children?.some(child => child.name === key)
//           ) {
//             newState[key] = false;
//           }
//         });
//       }
//       newState[name] = !prev[name];
//       return newState;
//     });
//   };

//   const menuItems = [
//     { name: 'Dashboard', icon: MdDashboard, path: '/dashboard' },
// { name: 'Stock Enquiry', icon: MdSearch, path: '/dashboard/stock-enquiry-table' },
//     {
//       name: 'Masters',
//       icon: MdOutlineApartment,
//       children: [
//         {
//           name: 'Company',
//           icon: FaBuilding,
//           path: '/masters/company',
//           children: [
//             { name: 'Company', icon: MdDomain, path: '/masters/company/company' },
//             { name: 'Company Area', icon: MdMap, path: '/masters/company/area' },
//             { name: 'Company Division', icon: MdOutlineGroupWork, path: '/masters/company/division' },
//             { name: 'Stock Type', icon: MdCategory, path: '/masters/company/stock-type' },
//             { name: 'Stock Location', icon: MdWarehouse, path: '/masters/company/stock-location' },
//             { name: 'Department', icon: MdWork, path: '/masters/company/department' },
//             { name: 'Designation', icon: MdAccountBox, path: '/masters/company/designation' },
//             { name: 'SalesPerson', icon: MdEmojiPeople, path: '/masters/company/salesperson' },
//             { name: 'Employee', icon: MdAccessibility, path: '/masters/company/employee' },
//           ],
//         },
//         {
//           name: 'Vendors',
//           icon: FaTruck,
//           path: '/masters/vendors',
//           children: [
//             { name: 'Broker', icon: FaHandshake, path: '/masters/vendors/broker' },
//             { name: 'Transporter', icon: MdLocalShipping, path: '/masters/vendors/transporter' },
//             { name: 'Creditors/Suppliers', icon: FaUserTag, path: '/masters/vendors/creditors' },
//           ],
//         },
//         {
//           name: 'Customers',
//           icon: MdPeopleAlt,
//           path: '/masters/customers',
//           children: [
//             { name: 'Debtors/Customers', icon: MdPeople, path: '/masters/customers/debtors' },
//             { name: 'Category (For Rate)', icon: MdCategory, path: '/masters/customers/category' },
//             { name: 'Customer Group', icon: AiOutlineUsergroupAdd, path: '/masters/customers/group' },
//             { name: 'Consignee', icon: MdPersonAdd, path: '/masters/customers/consignee' },
//             { name: 'Party Class Master', icon: MdClass, path: '/masters/customers/party-class' },
//             { name: 'Party Wise Rate List', icon: MdLocalOffer, path: '/masters/customers/rate-list' },
//             { name: 'Party Brand Broker', icon: MdStars, path: '/masters/customers/brand-broker' },
//             { name: 'Party Rating Update', icon: MdRateReview, path: '/masters/customers/rating' },
//             { name: 'Party Brand Parameter', icon: MdBuild, path: '/masters/customers/brand-parameter' },
//           ],
//         },
//         {
//           name: 'Products',
//           icon: FaBoxOpen,
//           path: '/masters/products',
//           children: [
//             { name: 'Category Master', icon: MdCategory, path: '/masters/products/category' },
//             { name: 'Product Group', icon: AiOutlineNodeIndex, path: '/masters/products/productgrp' },
//             { name: 'Product Master', icon: MdLocalMall, path: '/masters/products/product' },
//             { name: 'Style Master', icon: MdCollectionsBookmark, path: '/masters/products/style' },
//             { name: 'Type Master', icon: MdCategory, path: '/masters/products/type' },
//             { name: 'Shade Master', icon: MdLibraryBooks, path: '/masters/products/shade' },
//             { name: 'Pattern Master', icon: MdLibraryBooks, path: '/masters/products/pattern' },
//             { name: 'Brand Master', icon: MdBrandingWatermark, path: '/masters/products/brand' },
//             { name: 'Unit Master', icon: MdStraighten, path: '/masters/products/unit' },
//             { name: 'Web Collection', icon: MdCollectionsBookmark, path: '/masters/products/webcollection' },
//             { name: 'Quality', icon: MdLibraryBooks, path: '/masters/products/quality' },
//           ],
//         },
//         {
//           name: 'GST/SAC Code',
//           icon: MdReceipt,
//           path: '/masters/gst-sac',
//           children: [
//             { name: 'GST Codes', icon: MdReceipt, path: '/masters/gst-sac/gst' },
//           ],
//         },
//         {
//           name: 'Tax/Terms',
//           icon: FaBalanceScale,
//           path: '/masters/tax-terms',
//           children: [
//             { name: 'Tax Group', icon: MdGavel, path: '/masters/tax-terms/tax-group' },
//             { name: 'Tax Master', icon: MdGavel, path: '/masters/tax-terms/tax-master' },
//             { name: 'Term Group', icon: MdGavel, path: '/masters/tax-terms/term-group' },
//             { name: 'Terms Master', icon: MdAssignment, path: '/masters/tax-terms/terms-master' },
//             { name: 'Discount Pattern', icon: MdLocalOffer, path: '/masters/tax-terms/discount-pattern' },
//             { name: 'Discount Sequence', icon: MdAssignment, path: '/masters/tax-terms/discount-sequence' },
//             { name: 'Pattern Master', icon: MdLibraryBooks, path: '/masters/tax-terms/pattern-master' },
//             { name: 'Cash Discount Terms', icon: MdAttachMoney, path: '/masters/tax-terms/cash-discount' },
//             { name: 'Excise Tariff Master', icon: MdLibraryBooks, path: '/masters/tax-terms/excise-master' },
//             { name: 'Excise Tariff Group', icon: MdLibraryBooks, path: '/masters/tax-terms/excise-group' },
//           ],
//         },
//         {
//           name: 'Season',
//           icon: MdEvent,
//           path: '/masters/season',
//           children: [
//             { name: 'Season Master', icon: MdEvent, path: '/masters/season/list' },
//           ],
//         },
//       ],
//     },

//     { name: 'Orders', icon: MdShoppingCart, path: '/order' },
//     { name: 'Products', icon: MdInventory, path: '/products' },
//     { name: 'Customers', icon: MdPeople, path: '/customers' },
//     { name: 'Reports', icon: MdAnalytics, path: '/reports' },
//     { name: 'Settings', icon: MdSettings, path: '/settings' },
//   ];

//   const renderMenu = (items, level = 0) => {
//     return items.map((item, index) => {
//       const IconComponent = item.icon;
//       const hasChildren = item.children && item.children.length > 0;
//       const isMenuOpen = openMenus[item.name];

//       const menuContent = (
//         <div
//           onClick={() => {
//             if (hasChildren) toggleMenu(item.name, level === 1 ? 'Masters' : null);
//           }}
//           style={{
//             display: 'flex',
//             alignItems: 'center',
//             padding: '0.75rem 0.5rem',
//             borderRadius: '0.5rem',
//             cursor: hasChildren ? 'pointer' : 'default',
//             transition: 'all 0.3s ease',
//             userSelect: 'none',
//           }}
//           className="hover:bg-opacity-20 hover:bg-white"
//         >
//           {IconComponent && (
//             <span style={{
//               fontSize: '1.2rem',
//               minWidth: '24px',
//               display: 'flex',
//               justifyContent: 'center',
//               marginRight: isCollapsed ? 0 : '1rem',
//             }}>
//               <IconComponent size={20} />
//             </span>
//           )}
//           {!isCollapsed && (
//             <>
//               <span style={{
//                 whiteSpace: 'nowrap',
//                 overflow: 'hidden',
//                 textOverflow: 'ellipsis',
//                 flex: 1,
//               }}>
//                 {item.name}
//               </span>
//               {hasChildren && (
//                 <span>
//                   {isMenuOpen ? <MdExpandLess size={18} /> : <MdExpandMore size={18} />}
//                 </span>
//               )}
//             </>
//           )}
//         </div>
//       );

//       return (
//         <li key={item.name + index} style={{ marginBottom: '0.5rem', paddingLeft: `${level * 12}px` }}>
//           {item.path && !hasChildren ? (
//             <Link href={item.path} style={{ textDecoration: 'none', color: 'inherit' }}>
//               {menuContent}
//             </Link>
//           ) : (
//             menuContent
//           )}
//           {hasChildren && isMenuOpen && (
//             <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.25rem' }}>
//               {renderMenu(item.children, level + 1)}
//             </ul>
//           )}
//         </li>
//       );
//     });
//   };

//   return (
//     <div
//       ref={sidebarRef}
//       onMouseLeave={() =>
//         setOpenMenus({
//           Masters: false,
//           Company: false,
//         })
//       }
//       className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}
//       style={{
//         backgroundColor: 'var(--sidebar-bg)',
//         color: 'var(--sidebar-text)',
//         height: '100vh',
//         position: 'fixed',
//         left: 0,
//         top: 0,
//         width: isCollapsed ? '80px' : '250px',
//         transition: 'width 0.3s ease',
//         padding: '1rem',
//         overflow: 'hidden',
//         zIndex: 1000,
//         display: 'flex',
//         flexDirection: 'column',
//       }}
//     >
//       <div style={{
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         marginBottom: '2rem',
//         padding: '0.5rem',
//       }}>
//         {!isCollapsed && (
//           <h2 style={{
//             fontSize: '1.25rem',
//             fontWeight: 'bold',
//             margin: 0,
//             whiteSpace: 'nowrap'
//           }}>
//             StockDash
//           </h2>
//         )}
//         <button
//           onClick={() => setIsCollapsed(!isCollapsed)}
//           style={{
//             background: 'none',
//             border: 'none',
//             color: 'inherit',
//             fontSize: '1.5rem',
//             cursor: 'pointer',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             width: '40px',
//             height: '40px',
//             borderRadius: '50%',
//             marginLeft: !isCollapsed ? 'auto' : 0,
//           }}
//           className="hover:bg-opacity-20 hover:bg-white"
//         >
//           {isCollapsed ? <MdMenu size={20} /> : <MdClose size={20} />}
//         </button>
//       </div>

//       <div
//         style={{
//           flex: 1,
//           overflowY: 'auto',
//           overflowX: 'hidden',
//           maxHeight: 'calc(100vh - 100px)',
//           paddingRight: '4px',
//           scrollbarColor: 'var(--sidebar-text) var(--sidebar-bg)',
//           scrollbarWidth: 'thin',
//         }}
//         className="custom-scrollbar"
//       >
//         <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
//           {renderMenu(menuItems)}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;






// 'use client'

// import Link from 'next/link';
// import { useEffect, useRef, useState } from 'react';
// import { useTheme } from '../../../src/app/context/ThemeContext';
// import {
//   MdDashboard, MdSearch, MdShoppingCart, MdInventory, MdPeople,
//   MdAnalytics, MdSettings, MdMenu, MdClose, MdExpandMore, MdExpandLess,
//   MdBusiness, MdMap, MdBuild, MdLocalShipping, MdPeopleAlt, MdAllInbox,
//   MdReceipt, MdGavel, MdEvent, MdCategory, MdOutlineGroupWork, MdPersonAdd,
//   MdLocalOffer, MdClass, MdStars, MdRateReview, MdWork, MdAccountBox,
//   MdDomain, MdWarehouse, MdLocalMall, MdCollectionsBookmark, MdAttachMoney,
//   MdAssignment, MdAccessibility, MdEmojiPeople, MdBrandingWatermark,
//   MdStraighten, MdLibraryBooks, MdOutlineApartment
// } from 'react-icons/md';

// import { FaBoxOpen, FaBuilding, FaTruck, FaUserTag, FaHandshake, FaBalanceScale } from 'react-icons/fa';
// import { AiOutlineUsergroupAdd, AiOutlineNodeIndex } from 'react-icons/ai';

// const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
//   const { theme } = useTheme();
//   const sidebarRef = useRef(null);

//   const [openMenus, setOpenMenus] = useState({
//     Masters: false,
//     Company: false,
//   });

//   const toggleMenu = (name, parentName = null) => {
//     setOpenMenus((prev) => {
//       const newState = { ...prev };
//       if (parentName === 'Masters') {
//         Object.keys(newState).forEach((key) => {
//           if (
//             key !== name &&
//             menuItems.find(item => item.name === 'Masters')?.children?.some(child => child.name === key)
//           ) {
//             newState[key] = false;
//           }
//         });
//       }
//       newState[name] = !prev[name];
//       return newState;
//     });
//   };

//   const menuItems = [
//     { name: 'Dashboard', icon: MdDashboard, path: '/dashboard' },
// { name: 'Stock Enquiry', icon: MdSearch, path: '/dashboard/stock-enquiry-table' },
//     {
//       name: 'Masters',
//       icon: MdOutlineApartment,
//       children: [
//         {
//           name: 'Company',
//           icon: FaBuilding,
//           path: '/masters/company',
//           children: [
//             { name: 'Company', icon: MdDomain, path: '/masters/company' },
//             { name: 'Company Area', icon: MdMap, path: '/masters/company/area' },
//             { name: 'Company Division', icon: MdOutlineGroupWork, path: '/masters/company/division' },
//             { name: 'Stock Type', icon: MdCategory, path: '/masters/company/stock-type' },
//             { name: 'Stock Location', icon: MdWarehouse, path: '/masters/company/stock-location' },
//             { name: 'Department', icon: MdWork, path: '/masters/company/department' },
//             { name: 'Designation', icon: MdAccountBox, path: '/masters/company/designation' },
//             { name: 'SalesPerson', icon: MdEmojiPeople, path: '/masters/company/salesperson' },
//             { name: 'Employee', icon: MdAccessibility, path: '/masters/company/employee' },
//           ],
//         },
//         {
//           name: 'Vendors',
//           icon: FaTruck,
//           path: '/masters/vendors',
//           children: [
//             { name: 'Broker', icon: FaHandshake, path: '/masters/vendors/broker' },
//             { name: 'Transporter', icon: MdLocalShipping, path: '/masters/vendors/transporter' },
//             { name: 'Creditors/Suppliers', icon: FaUserTag, path: '/masters/vendors/creditors' },
//           ],
//         },
//         {
//           name: 'Customers',
//           icon: MdPeopleAlt,
//           path: '/masters/customers',
//           children: [
//             { name: 'Debtors/Customers', icon: MdPeople, path: '/masters/customers/debtors' },
//             { name: 'Category (For Rate)', icon: MdCategory, path: '/masters/customers/category' },
//             { name: 'Customer Group', icon: AiOutlineUsergroupAdd, path: '/masters/customers/group' },
//             { name: 'Consignee', icon: MdPersonAdd, path: '/masters/customers/consignee' },
//             { name: 'Party Class Master', icon: MdClass, path: '/masters/customers/party-class' },
//             { name: 'Party Wise Rate List', icon: MdLocalOffer, path: '/masters/customers/rate-list' },
//             { name: 'Party Brand Broker', icon: MdStars, path: '/masters/customers/brand-broker' },
//             { name: 'Party Rating Update', icon: MdRateReview, path: '/masters/customers/rating' },
//             { name: 'Party Brand Parameter', icon: MdBuild, path: '/masters/customers/brand-parameter' },
//           ],
//         },
//         {
//           name: 'Products',
//           icon: FaBoxOpen,
//           path: '/masters/products',
//           children: [
//             { name: 'Category Master', icon: MdCategory, path: '/masters/products/category' },
//             { name: 'Product Group', icon: AiOutlineNodeIndex, path: '/masters/products/productgrp' },
//             { name: 'Product Master', icon: MdLocalMall, path: '/masters/products/product' },
//             { name: 'Style Master', icon: MdCollectionsBookmark, path: '/masters/products/style' },
//             { name: 'Type Master', icon: MdCategory, path: '/masters/products/type' },
//             { name: 'Shade Master', icon: MdLibraryBooks, path: '/masters/products/shade' },
//             { name: 'Pattern Master', icon: MdLibraryBooks, path: '/masters/products/pattern' },
//             { name: 'Brand Master', icon: MdBrandingWatermark, path: '/masters/products/brand' },
//             { name: 'Unit Master', icon: MdStraighten, path: '/masters/products/unit' },
//             { name: 'Web Collection', icon: MdCollectionsBookmark, path: '/masters/products/webcollection' },
//             { name: 'Quality', icon: MdLibraryBooks, path: '/masters/products/quality' },
//           ],
//         },
//         {
//           name: 'GST/SAC Code',
//           icon: MdReceipt,
//           path: '/masters/gst-sac',
//           children: [
//             { name: 'GST Codes', icon: MdReceipt, path: '/masters/gst-sac/gst' },
//           ],
//         },
//         {
//           name: 'Tax/Terms',
//           icon: FaBalanceScale,
//           path: '/masters/tax-terms',
//           children: [
//             { name: 'Tax Group', icon: MdGavel, path: '/masters/tax-terms/tax-group' },
//             { name: 'Tax Master', icon: MdGavel, path: '/masters/tax-terms/tax-master' },
//             { name: 'Term Group', icon: MdGavel, path: '/masters/tax-terms/term-group' },
//             { name: 'Terms Master', icon: MdAssignment, path: '/masters/tax-terms/terms-master' },
//             { name: 'Discount Pattern', icon: MdLocalOffer, path: '/masters/tax-terms/discount-pattern' },
//             { name: 'Discount Sequence', icon: MdAssignment, path: '/masters/tax-terms/discount-sequence' },
//             { name: 'Pattern Master', icon: MdLibraryBooks, path: '/masters/tax-terms/pattern-master' },
//             { name: 'Cash Discount Terms', icon: MdAttachMoney, path: '/masters/tax-terms/cash-discount' },
//             { name: 'Excise Tariff Master', icon: MdLibraryBooks, path: '/masters/tax-terms/excise-master' },
//             { name: 'Excise Tariff Group', icon: MdLibraryBooks, path: '/masters/tax-terms/excise-group' },
//           ],
//         },
//         {
//           name: 'Season',
//           icon: MdEvent,
//           path: '/masters/season',
//           children: [
//             { name: 'Season Master', icon: MdEvent, path: '/masters/season/list' },
//           ],
//         },
//       ],
//     },

//     // { name: 'Orders', icon: MdShoppingCart, path: '/order' },
//     // { name: 'Products', icon: MdInventory, path: '/products' },
//     { name: 'Customers', icon: MdPeople, path: '#' },
//     { name: 'Reports', icon: MdAnalytics, path: '#' },
//     { name: 'Settings', icon: MdSettings, path: '#' },
//   ];

//   const renderMenu = (items, level = 0) => {
//     return items.map((item, index) => {
//       const IconComponent = item.icon;
//       const hasChildren = item.children && item.children.length > 0;
//       const isMenuOpen = openMenus[item.name];

//       const menuContent = (
//         <div
//           onClick={() => {
//             if (hasChildren) toggleMenu(item.name, level === 1 ? 'Masters' : null);
//           }}
//           style={{
//             display: 'flex',
//             alignItems: 'center',
//             padding: '0.75rem 0.5rem',
//             borderRadius: '0.5rem',
//             cursor: hasChildren ? 'pointer' : 'default',
//             transition: 'all 0.3s ease',
//             userSelect: 'none',
//           }}
//           className="hover:bg-opacity-20 hover:bg-white"
//         >
//           {IconComponent && (
//             <span style={{
//               fontSize: '1.2rem',
//               minWidth: '24px',
//               display: 'flex',
//               justifyContent: 'center',
//               marginRight: isCollapsed ? 0 : '1rem',
//             }}>
//               <IconComponent size={24} />
//             </span>
//           )}
//           {!isCollapsed && (
//             <>
//               <span style={{
//                 whiteSpace: 'nowrap',
//                 overflow: 'hidden',
//                 textOverflow: 'ellipsis',
//                 flex: 1,
//               }}>
//                 {item.name}
//               </span>
//               {hasChildren && (
//                 <span>
//                   {isMenuOpen ? <MdExpandLess size={18} /> : <MdExpandMore size={18} />}
//                 </span>
//               )}
//             </>
//           )}
//         </div>
//       );

//       return (
//         <li key={item.name + index} style={{ marginBottom: '0.5rem', paddingLeft: `${level * 12}px` }}>
//           {item.path && !hasChildren ? (
//             <Link href={item.path} style={{ textDecoration: 'none', color: 'inherit' }}>
//               {menuContent}
//             </Link>
//           ) : (
//             menuContent
//           )}
//           {hasChildren && isMenuOpen && (
//             <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.25rem' }}>
//               {renderMenu(item.children, level + 1)}
//             </ul>
//           )}
//         </li>
//       );
//     });
//   };

//   return (
//     <div
//       ref={sidebarRef}
//       onMouseLeave={() =>
//         setOpenMenus({
//           Masters: false,
//           Company: false,
//         })
//       }
//       className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}
//       style={{
//         backgroundColor: '#fff',
//         color: '#1b69e7ff',
//          fontSize: '1rem',
//             fontWeight: '490',
//         height: '100vh',
//         position: 'fixed',
//         border: '1px solid #edeff0',
//         left: 0,
//         top: 0,
//         width: isCollapsed ? '80px' : '250px',
//         transition: 'width 0.3s ease',
//         padding: '1rem',
//         overflow: 'hidden',
//         zIndex: 1000,
//         display: 'flex',
//         flexDirection: 'column',
//       }}
//     >
//       <div style={{
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         marginBottom: '2rem',
//         padding: '0.5rem',
//       }}>
//         {!isCollapsed && (
//           <h2 style={{
//             fontSize: '1.25rem',
//             fontWeight: 'bold',
//             margin: 0,
//             whiteSpace: 'nowrap'
//           }}>
//             Prasyst
//           </h2>
//         )}
//         <button
//           onClick={() => setIsCollapsed(!isCollapsed)}
//           style={{
//             background: 'none',
//             border: 'none',
//             color: 'inherit',
//             fontSize: '1.5rem',
//             cursor: 'pointer',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             width: '40px',
//             height: '40px',
//             borderRadius: '50%',
//             marginLeft: !isCollapsed ? 'auto' : 0,
//           }}
//           className="hover:bg-opacity-20 hover:bg-white"
//         >
//           {isCollapsed ? <MdMenu size={25} /> : <MdClose size={25} />}
//         </button>
//       </div>

//       <div
//         style={{
//           flex: 1,
//           overflowY: 'auto',
//           overflowX: 'hidden',
//           maxHeight: 'calc(100vh - 100px)',
//           paddingRight: '4px',
//           scrollbarColor: '#edeff0',
//           scrollbarWidth: 'thin',
//         }}
//         className="custom-scrollbar"
//       >
//         <ul style={{ listStyle: 'none', padding: 0, margin: 0, }}>
//           {renderMenu(menuItems)}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;



'use client'

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../../src/app/context/ThemeContext';
import {
  MdDashboard, MdSearch, MdShoppingCart, MdInventory, MdPeople,
  MdAnalytics, MdSettings, MdMenu, MdClose, MdExpandMore, MdExpandLess,
  MdBusiness, MdMap, MdBuild, MdLocalShipping, MdPeopleAlt, MdAllInbox,
  MdReceipt, MdGavel, MdEvent, MdCategory, MdOutlineGroupWork, MdPersonAdd,
  MdLocalOffer, MdClass, MdStars, MdRateReview, MdWork, MdAccountBox,
  MdDomain, MdWarehouse, MdLocalMall, MdCollectionsBookmark, MdAttachMoney,
  MdAssignment, MdAccessibility, MdEmojiPeople, MdBrandingWatermark,
  MdStraighten, MdLibraryBooks, MdOutlineApartment
} from 'react-icons/md';

import { FaBoxOpen, FaBuilding, FaTruck, FaUserTag, FaHandshake, FaBalanceScale } from 'react-icons/fa';
import { AiOutlineUsergroupAdd, AiOutlineNodeIndex } from 'react-icons/ai';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { theme } = useTheme();
  const sidebarRef = useRef(null);
  const [activeItem, setActiveItem] = useState('');
  const [hoveredItem, setHoveredItem] = useState('');

  const [openMenus, setOpenMenus] = useState({
    Masters: false,
    Company: false,
  });

  const toggleMenu = (name, parentName = null) => {
    setOpenMenus((prev) => {
      const newState = { ...prev };
      if (parentName === 'Masters') {
        Object.keys(newState).forEach((key) => {
          if (
            key !== name &&
            menuItems.find(item => item.name === 'Masters')?.children?.some(child => child.name === key)
          ) {
            newState[key] = false;
          }
        });
      }
      newState[name] = !prev[name];
      return newState;
    });
  };

  const menuItems = [
    { name: 'Dashboard', icon: MdDashboard, path: '/dashboard' },
    { name: 'Stock Enquiry', icon: MdSearch, path: '/dashboard/stock-enquiry-table' },
    {
      name: 'Masters',
      icon: MdOutlineApartment,
      children: [
        {
          name: 'Company',
          icon: FaBuilding,
          path: '/masters/company',
          children: [
            { name: 'Company', icon: MdDomain, path: '/masters/company' },
            { name: 'Company Area', icon: MdMap, path: '/masters/company/area' },
            { name: 'Company Division', icon: MdOutlineGroupWork, path: '/masters/company/division' },
            { name: 'Stock Type', icon: MdCategory, path: '/masters/company/stock-type' },
            { name: 'Stock Location', icon: MdWarehouse, path: '/masters/company/stock-location' },
            { name: 'Department', icon: MdWork, path: '/masters/company/department' },
            { name: 'Designation', icon: MdAccountBox, path: '/masters/company/designation' },
            { name: 'SalesPerson', icon: MdEmojiPeople, path: '/masters/company/salesperson' },
            { name: 'Employee', icon: MdAccessibility, path: '/masters/company/employee' },
          ],
        },
        {
          name: 'Vendors',
          icon: FaTruck,
          path: '/masters/vendors',
          children: [
            { name: 'Broker', icon: FaHandshake, path: '/masters/vendors/broker' },
            { name: 'Transporter', icon: MdLocalShipping, path: '/masters/vendors/transporter' },
            { name: 'Creditors/Suppliers', icon: FaUserTag, path: '/masters/vendors/creditors' },
          ],
        },
        {
          name: 'Customers',
          icon: MdPeopleAlt,
          path: '/masters/customers',
          children: [
            { name: 'Debtors/Customers', icon: MdPeople, path: '/masters/customers/debtors' },
            { name: 'Category (For Rate)', icon: MdCategory, path: '/masters/customers/category' },
            { name: 'Customer Group', icon: AiOutlineUsergroupAdd, path: '/masters/customers/group' },
            { name: 'Consignee', icon: MdPersonAdd, path: '/masters/customers/consignee' },
            { name: 'Party Class Master', icon: MdClass, path: '/masters/customers' },
            { name: 'Party Wise Rate List', icon: MdLocalOffer, path: '/masters/customers/rate-list' },
            { name: 'Party Brand Broker', icon: MdStars, path: '/masters/customers/brand-broker' },
            { name: 'Party Rating Update', icon: MdRateReview, path: '/masters/customers/rating' },
            { name: 'Party Brand Parameter', icon: MdBuild, path: '/masters/customers/brand-parameter' },
          ],
        },
        {
          name: 'Products',
          icon: FaBoxOpen,
          path: '/masters/products',
          children: [
            { name: 'Category Master', icon: MdCategory, path: '/masters/products/category' },
            { name: 'Product Group', icon: AiOutlineNodeIndex, path: '/masters/products/productgrp' },
            { name: 'Product Master', icon: MdLocalMall, path: '/masters/products/product' },
            { name: 'Style Master', icon: MdCollectionsBookmark, path: '/masters/products/style' },
            { name: 'Type Master', icon: MdCategory, path: '/masters/products/type' },
            { name: 'Shade Master', icon: MdLibraryBooks, path: '/masters/products/shade' },
            { name: 'Pattern Master', icon: MdLibraryBooks, path: '/masters/products/pattern' },
            { name: 'Brand Master', icon: MdBrandingWatermark, path: '/masters/products/brand' },
            { name: 'Unit Master', icon: MdStraighten, path: '/masters/products/unit' },
            { name: 'Web Collection', icon: MdCollectionsBookmark, path: '/masters/products/webcollection' },
            { name: 'Quality', icon: MdLibraryBooks, path: '/masters/products/quality' },
          ],
        },
        {
          name: 'GST/SAC Code',
          icon: MdReceipt,
          path: '/masters/gst-sac',
          children: [
            { name: 'GST Codes', icon: MdReceipt, path: '/masters/gst-sac/gst' },
          ],
        },
        {
          name: 'Tax/Terms',
          icon: FaBalanceScale,
          path: '/masters/tax-terms',
          children: [
            { name: 'Tax Group', icon: MdGavel, path: '/masters/tax-terms/tax-group' },
            { name: 'Tax Master', icon: MdGavel, path: '/masters/tax-terms/tax-master' },
            { name: 'Term Group', icon: MdGavel, path: '/masters/tax-terms/term-group' },
            { name: 'Terms Master', icon: MdAssignment, path: '/masters/tax-terms/terms-master' },
            { name: 'Discount Pattern', icon: MdLocalOffer, path: '/masters/tax-terms/discount-pattern' },
            { name: 'Discount Sequence', icon: MdAssignment, path: '/masters/tax-terms/discount-sequence' },
            { name: 'Pattern Master', icon: MdLibraryBooks, path: '/masters/tax-terms/pattern-master' },
            { name: 'Cash Discount Terms', icon: MdAttachMoney, path: '/masters/tax-terms/cash-discount' },
            { name: 'Excise Tariff Master', icon: MdLibraryBooks, path: '/masters/tax-terms/excise-master' },
            { name: 'Excise Tariff Group', icon: MdLibraryBooks, path: '/masters/tax-terms/excise-group' },
          ],
        },
        {
          name: 'Season',
          icon: MdEvent,
          path: '/masters/season',
          children: [
            { name: 'Season Master', icon: MdEvent, path: '/masters/season/list' },
          ],
        },
      ],
    },
    { name: 'Customers', icon: MdPeople, path: '#' },
    { name: 'Reports', icon: MdAnalytics, path: '#' },
    { name: 'Settings', icon: MdSettings, path: '#' },
  ];

  const renderMenu = (items, level = 0) => {
    return items.map((item, index) => {
      const IconComponent = item.icon;
      const hasChildren = item.children && item.children.length > 0;
      const isMenuOpen = openMenus[item.name];
      const isActive = activeItem === item.path;
      const isHovered = hoveredItem === item.name;

      const menuContent = (
        <div
          onClick={() => {
            if (hasChildren) toggleMenu(item.name, level === 1 ? 'Masters' : null);
            if (item.path) setActiveItem(item.path);
          }}
          onMouseEnter={() => setHoveredItem(item.name)}
          onMouseLeave={() => setHoveredItem('')}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: level === 0 ? '0.5rem 1rem' : '0.5rem 0.5rem',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            userSelect: 'none',
            backgroundColor: isActive ? '#1b69e71a' : isHovered ? '#1b69e70d' : 'transparent',
            color: isActive ? '#1b69e7' : '#333',
            margin: level > 0 ? '0.15rem 0' : '0.25rem 0',
            fontSize: level === 0 ? '0.9rem' : '0.85rem',
            fontWeight: level === 0 ? '500' : '400',
          }}
        >
          {IconComponent && (
            <span style={{
              fontSize: '1.1rem',
              minWidth: '24px',
              display: 'flex',
              justifyContent: 'center',
              marginRight: isCollapsed ? 0 : '0.75rem',
              color: isActive ? '#1b69e7' : '#555',
            }}>
              <IconComponent size={level === 0 ? 20 : 18} />
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
                <span style={{ color: '#777' }}>
                  {isMenuOpen ? <MdExpandLess size={16} /> : <MdExpandMore size={16} />}
                </span>
              )}
            </>
          )}
        </div>
      );

      return (
        <li key={item.name + index} style={{ 
          marginBottom: level === 0 ? '0.5rem' : '0.25rem',
          paddingLeft: `${level * (isCollapsed ? 0 : 8)}px`,
        }}>
          {item.path && !hasChildren ? (
            <Link href={item.path} style={{ textDecoration: 'none', color: 'inherit' }}>
              {menuContent}
            </Link>
          ) : (
            menuContent
          )}
          {hasChildren && isMenuOpen && !isCollapsed && (
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              marginTop: '0.25rem',
              borderLeft: level > 0 ? '1px dashed #e0e0e0' : 'none',
              marginLeft: level > 0 ? '12px' : '0',
            }}>
              {renderMenu(item.children, level + 1)}
            </ul>
          )}
        </li>
      );
    });
  };

  return (
    <div
      ref={sidebarRef}
      onMouseLeave={() => {
        setHoveredItem('');
        setOpenMenus({
          Masters: false,
          Company: false,
        });
      }}
      className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}
      style={{
        backgroundColor: '#fff',
        color: '#333',
        height: '100vh',
        position: 'fixed',
        borderRight: '1px solid #e0e0e0',
        left: 0,
        top: 0,
        width: isCollapsed ? '80px' : '260px',
        transition: 'width 0.3s ease, transform 0.3s ease',
        padding: '1rem 0.75rem',
        overflow: 'hidden',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 0 10px rgba(0,0,0,0.03)',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.5rem',
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
          className="hover:bg-gray-100"
        >
          {isCollapsed ? <MdMenu size={22} /> : <MdClose size={22} />}
        </button>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          maxHeight: 'calc(100vh - 100px)',
          paddingRight: '4px',
          scrollbarWidth: 'thin',
          scrollbarColor: '#e0e0e0 transparent',
        }}
        className="custom-scrollbar"
      >
        <ul style={{ 
          listStyle: 'none', 
          padding: 0, 
          margin: 0,
        }}>
          {renderMenu(menuItems)}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;