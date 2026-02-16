// import {
//   MdDashboard, MdSearch, MdOutlineApartment, MdClose, MdMenu, MdChevronRight,
//   MdDomain, MdMap, MdOutlineGroupWork, MdCategory, MdWarehouse, MdWork,
//   MdAccountBox, MdEmojiPeople, MdAccessibility, MdLocalShipping, MdPeople,
//   MdPersonAdd, MdClass, MdLocalOffer, MdStars, MdRateReview, MdBuild,
//   MdLocalMall, MdCollectionsBookmark, MdStraighten, MdBrandingWatermark,
//   MdReceipt, MdGavel, MdAssignment, MdAttachMoney, MdEvent, MdAnalytics,
//   MdSettings, MdInventory, MdAccountBalance, MdPayments, MdSummarize,
//   MdPushPin, MdOutlinePushPin, MdOutlineInventory, MdCalendarToday,
//   MdSubdirectoryArrowRight, MdSupervisorAccount, MdAnchor, MdPercent, MdPayment, MdSettingsSuggest, MdHowToReg, MdRuleFolder,
//   MdAssignmentTurnedIn,
//   MdSupport, MdSupportAgent,
//   MdAddTask,
// } from 'react-icons/md';
// import {
//   MdFactCheck,
//   MdPlaylistAddCheck,
//   MdTune,
//   MdScience,
//   MdOutlineScience
// } from "react-icons/md";
// import {
//   RiFileList3Line, RiScissors2Line, RiLoopLeftLine, RiUserSharedLine, RiCheckboxBlankCircleLine,
//   RiFileList2Line,
//   RiToolsLine, RiShoppingBag3Line, RiShoppingBasket2Line,
//   RiBarcodeLine, RiInboxArchiveLine, RiFileShield2Line,
//   RiImageAddLine, RiDownload2Line, RiShareForwardLine, RiSettings4Line,
//   RiPriceTag3Line, RiExchangeLine,
//   RiStackLine, RiBriefcase2Line,
//   RiSearchLine, RiPlayListAddLine,
//   RiUserSearchLine, RiShoppingCart2Line,
//   RiTaskLine, RiTruckLine,
//   RiTimer2Line, RiBuilding4Line,
//   RiDraftLine, RiTestTubeLine,
//   RiCheckboxCircleLine,
//   RiArchiveStackLine
// } from 'react-icons/ri';

// import { TiTicket } from "react-icons/ti";
// import { FaBuilding, FaTruck, FaUserTag, FaHandshake, FaBalanceScale, FaBoxOpen, FaBoxes, FaUserTie, FaRupeeSign } from 'react-icons/fa';
// import { FiUser } from 'react-icons/fi';
// import { RiFileChartLine, RiAdminLine } from "react-icons/ri";
// import { AiOutlineUsergroupAdd, AiOutlineNodeIndex } from 'react-icons/ai';
// import { IoIosConstruct } from 'react-icons/io';

// export const sidebarMenuItems = [
//   { name: 'Dashboard', icon: MdDashboard, path: '/dashboard' },
//   {
//     name: 'Masters',
//     icon: MdOutlineApartment,
//     path: '/masterpage',
//     children: [
//       {
//         name: 'Company',
//         icon: FaBuilding,
//         path: '/masterpage?activeTab=company',
//         children: [
//           { name: 'Company', icon: MdDomain, path: '/masters/company/company' },
//           { name: 'Company Area', icon: MdMap, path: '#' },
//           { name: 'Company Division', icon: MdOutlineGroupWork, path: '#' },
//           { name: 'Stock Type', icon: MdCategory, path: '#' },
//           { name: 'Stock Location', icon: MdWarehouse, path: '#' },
//           { name: 'Department', icon: MdWork, path: '#' },
//           { name: 'Designation', icon: MdAccountBox, path: '#' },
//           { name: 'SalesPerson', icon: MdEmojiPeople, path: '#' },
//           { name: 'Employee', icon: MdAccessibility, path: '#' },
//         ],
//       },
//       {
//         name: 'Location',
//         icon: FaTruck,
//         path: '/masterpage?activeTab=location',
//         children: [
//           { name: 'Location master', icon: FaHandshake, path: '#' },
//         ],
//       },
//       {
//         name: 'Vendors',
//         icon: MdLocalShipping,
//         path: '/masterpage?activeTab=vendors',
//         children: [
//           { name: 'Broker', icon: FaHandshake, path: '#' },
//           { name: 'Transporter', icon: MdLocalShipping, path: '#' },
//           { name: 'Creditors/Suppliers', icon: FaUserTag, path: '/masters/vendors' },
//         ],
//       },
//       {
//         name: 'Customers',
//         icon: MdPeople,
//         path: '/masterpage?activeTab=customers',
//         children: [
//           { name: 'Debtors/Customers', icon: MdPeople, path: '/masters/customers' },
//           { name: 'Category (For Rate)', icon: MdCategory, path: '#' },
//           { name: 'Customer Group', icon: AiOutlineUsergroupAdd, path: '#' },
//           { name: 'Consignee', icon: MdPersonAdd, path: '#' },
//           { name: 'Party Class Master', icon: MdClass, path: '#' },
//           { name: 'Party Wise Rate List', icon: MdLocalOffer, path: '#' },
//           { name: 'Party Brand Broker', icon: MdStars, path: '#' },
//           { name: 'Party Rating Update', icon: MdRateReview, path: '#' },
//           { name: 'Party Brand Parameter', icon: MdBuild, path: '#' },
//         ],
//       },
//       ,
//       {
//         name: 'Process',
//         icon: FaTruck,
//         path: '/masterpage?activeTab=process',
//       },
//       {
//         name: 'Products',
//         icon: FaBoxOpen,
//         path: '/masterpage?activeTab=products',
//         children: [
//           { name: 'Category Master', icon: MdCategory, path: '/masters/products/category' },
//           { name: 'Product Group', icon: AiOutlineNodeIndex, path: '/masters/products/productgrp' },
//           { name: 'Product Master', icon: MdLocalMall, path: '/masters/products/product' },
//           { name: 'Style Master', icon: MdCollectionsBookmark, path: '#' },
//           { name: 'Type Master', icon: MdCategory, path: '/masters/products/type' },
//           { name: 'Shade Master', icon: MdBrandingWatermark, path: '/masters/products/shade' },
//           { name: 'Pattern Master', icon: MdCollectionsBookmark, path: '/masters/products/pattern' },
//           { name: 'Brand Master', icon: MdBrandingWatermark, path: '/masters/products/brand' },
//           { name: 'Unit Master', icon: MdStraighten, path: '/masters/products/unit' },
//           { name: 'Web Collection', icon: MdCollectionsBookmark, path: '/masters/products/webcollection' },
//           { name: 'Quality', icon: MdBrandingWatermark, path: '/masters/products/quality' },
//           { name: 'RackMst', icon: MdBuild, path: '/masters/products/rack' },
//           { name: 'Prod Series', icon: MdAssignment, path: '/masters/products/prodseries' },
//         ],
//       },
//       {
//         name: 'GST/SAC Code',
//         icon: MdReceipt,
//         path: '/masterpage?activeTab=gst',
//         children: [
//           { name: 'GST Codes', icon: MdReceipt, path: '#' },
//         ],
//       },
//       {
//         name: 'Tax/Terms',
//         icon: FaBalanceScale,
//         path: '/masterpage?activeTab=tax',
//         children: [
//           { name: 'Tax Group', icon: MdGavel, path: '#' },
//           { name: 'Tax Master', icon: MdGavel, path: '/masters/taxterms/taxmaster' },
//           { name: 'Term Group', icon: MdGavel, path: '#' },
//           { name: 'Terms Master', icon: MdAssignment, path: '/masters/taxterms/termmaster' },
//           { name: 'Discount Pattern', icon: MdLocalOffer, path: '#' },
//           { name: 'Discount Sequence', icon: MdAssignment, path: '#' },
//           { name: 'Pattern Master', icon: MdCollectionsBookmark, path: '#' },
//           { name: 'Cash Discount Terms', icon: MdAttachMoney, path: '#' },
//           { name: 'Excise Tariff Master', icon: MdReceipt, path: '#' },
//           { name: 'Excise Tariff Group', icon: MdReceipt, path: '#' },
//         ],
//       },
//       ,
//       {
//         name: 'Other Misc',
//         icon: FaTruck,
//         path: '#',
//         children: [
//           { name: 'Broker', icon: FaHandshake, path: '#' },
//         ],
//       },
//       ,
//       {
//         name: 'TDS Master',
//         icon: FaTruck,
//         path: '/masterpage?activeTab=tds',
//         children: [
//           { name: 'Broker', icon: FaHandshake, path: '#' },
//         ],
//       },
//       ,
//       {
//         name: 'QC Master',
//         icon: FaTruck,
//         path: '/masterpage?activeTab=qc',
//         children: [
//           { name: 'QC Group', icon: MdFactCheck, path: '/masters/qc/qcgrp/qcgroup' },
//           { name: 'QC SubGroup', icon: MdPlaylistAddCheck, path: '/masters/qc/qcsubgrp/qcsubgroup/' },
//           { name: 'QC Parameter', icon: MdTune, path: '/masters/qc/qcparameter/qcparamtr' },
//           { name: 'QC Product Process', icon: MdScience, path: '/masters/qc/qcprdprocess/qcprdpro' },
//           {
//             name: 'QC Test',
//             icon: RiTestTubeLine,
//             children: [
//               { name: 'Raw Material', icon: MdGavel, path: '/masters/qc/qctest/rawmaterial/rawmaterial' },
//               { name: 'Finished Goods', icon: MdTune, path: '/masters/qc/qctest/finishedgoods/finishedgoods' },
//               { name: 'Stores', icon: FaHandshake, path: '/masters/qc/qctest/stores/stores' },
//               { name: 'Semi Finished', icon: MdBuild, path: '/masters/qc/qctest/semifinished/semifinish' },
//             ]
//           },

//         ],
//       },
//       {
//         name: 'Season',
//         icon: MdEvent,
//         path: '/masterpage?activeTab=season',
//         children: [
//           { name: 'Season Master', icon: MdEvent, path: '/masters/season/season' },
//         ],
//       },

//       {
//         name: 'Managers',
//         icon: MdSupervisorAccount,
//         path: '#',
//         children: [
//           { name: 'Broker', icon: FaHandshake, path: '#' },
//         ],
//       },
//       {
//         name: 'WareHouse Management',
//         icon: MdWarehouse,
//         path: '#',
//         children: [
//           { name: 'Broker', icon: FaHandshake, path: '#' },
//         ],
//       },
//       ,
//       {
//         name: 'Port Master',
//         icon: MdAnchor,
//         path: '#',
//         children: [
//           { name: 'Broker', icon: FaHandshake, path: '#' },
//         ],
//       }
//       ,
//       {
//         name: 'Pay ment term',
//         icon: MdPayment,
//         path: '#',
//         children: [
//           { name: 'Broker', icon: FaHandshake, path: '#' },
//         ],
//       },
//       {
//         name: 'Rate term',
//         icon: MdPercent,
//         path: '#',
//         children: [
//           { name: 'Broker', icon: FaHandshake, path: '#' },

//         ],
//       },
//       {
//         name: 'Approval Settings',
//         icon: MdSettingsSuggest,
//         path: '#',
//         children: [
//           { name: 'Broker', icon: FaHandshake, path: '#' },
//         ],
//       },
//       {
//         name: 'Approval',
//         icon: MdHowToReg,
//         path: '/masterpage?activeTab=Approval',
//         children: [
//           { name: 'Broker', icon: FaHandshake, path: '#' },
//         ],
//       },
//       {
//         name: 'TransApproval',
//         icon: MdAssignmentTurnedIn,
//         path: '#',
//         children: [
//           { name: 'Broker', icon: FaHandshake, path: '#' },
//         ],
//       },
//       {
//         name: 'TransApproval Setting',
//         icon: MdRuleFolder,
//         path: '#',
//         children: [
//           { name: 'Broker', icon: FaHandshake, path: '#' },

//         ],
//       },
//       {
//         name: 'Ticketing',
//         icon: TiTicket,
//         path: '/masterpage?activeTab=ticketing',
//         children: [
//           { name: 'Ticket Category', icon: MdCategory, path: '/masters/ticketing/ticketCategory' },
//           { name: 'Ticket SubCategory', icon: MdSubdirectoryArrowRight, path: '/masters/ticketing/ticketSubCat' },
//           { name: 'Service/Complaint', icon: MdSupport, path: '/masters/ticketing/serviceComplaint' },
//           { name: 'Raise Service Ticket', icon: MdAddTask, path: '/masters/ticketing/raiseTicket' },
//         ],
//       },
//     ],
//   },

//   {
//     name: 'Inventory',
//     icon: MdWarehouse,
//     path: '/inventorypage?activeTab=inventory-items',
//     children: [
//       {
//         name: 'Inventory Items',
//         icon: FaBuilding,
//         path: '/inventorypage?activeTab=inventory-items',
//         children: [
//           { name: 'Artical/Style Master', icon: RiFileList3Line, path: '/inverntory/style/' },
//           {
//             name: 'Style/Parts Master',
//             icon: RiToolsLine, // Parts/Tools
//             path: '#'
//           },
//           {
//             name: 'BarCode Printing',
//             icon: RiBarcodeLine, // Barcode icon
//             path: '#'
//           },
//           {
//             name: 'Style Shade Image Upload',
//             icon: RiImageAddLine, // Image upload
//             path: '#'
//           },
//           {
//             name: 'Price List Details',
//             icon: RiPriceTag3Line, // Price tag
//             path: '#',
//             dividerAfter: true,
//           },],
//       },

//       {
//         name: 'Sampling & Development',
//         icon: RiStackLine, // Boxes/stack to represent samples
//         path: '/inventorypage?activeTab=sampling',
//         children: [
//           {
//             name: 'Stock Enquiry',
//             icon: RiSearchLine, // Search
//             path: '#'
//           },
//           {
//             name: 'Buyer Enquiry',
//             icon: RiUserSearchLine, // Buyer search
//             path: '#'
//           },
//           {
//             name: 'Enquiry Follow-ups',
//             icon: RiTaskLine, // Follow up / task progress
//             path: '/inverntory/packeging-barcode/'
//           },
//           {
//             name: 'Pending for Acceptance',
//             icon: RiTimer2Line, // Pending / waiting
//             path: '/inverntory/packeging-barcode/'
//           },
//           {
//             name: 'Sampling Form',
//             icon: RiDraftLine, // Form / draft
//             path: '/inverntory/packeging-barcode/'
//           },
//           {
//             name: 'Enquiry Status',
//             icon: RiCheckboxCircleLine, // Status / check
//             path: '/inverntory/packeging-barcode/'
//           },
//         ],
//       },
//       {
//         name: 'Opening Stock', icon:
//           MdInventory, path: '/inventorypage?activeTab=opening-stock',
//         children: [
//           {
//             name: 'RM Stock',
//             icon: RiArchiveStackLine,   // raw material stack
//             path: '/inverntory/packeging-barcode/'
//           },
//           {
//             name: 'Trims & Stores with Party',
//             icon: RiScissors2Line,       // trims / cutting
//             path: '#'
//           },
//           {
//             name: 'Finished Good Stock',
//             icon: RiCheckboxCircleLine,  // finished / approved
//             path: '/inverntory/packeging-barcode/'
//           },
//           {
//             name: 'Process Stock with Party',
//             icon: RiLoopLeftLine,        // processing/looping
//             path: '/inverntory/packeging-barcode/'
//           },
//           {
//             name: 'RM Stock with Party',
//             icon: RiUserSharedLine,      // shared with party/vendor
//             path: '/inverntory/packeging-barcode/'
//           },
//         ],
//       },
//       {
//         name: 'Purchase Order', icon: RiFileList2Line,
//         path: '/inventorypage?activeTab=purchase-order',
//         children: [
//           { name: 'RM Purchase Order', icon: RiShoppingBag3Line, path: '/inverntory/packeging-barcode/' },
//           { name: 'Finished goods product order', icon: RiCheckboxBlankCircleLine, path: '#' },
//           { name: 'Trims & Stores purchase order', icon: RiScissors2Line, path: '/inverntory/packeging-barcode/' },
//         ],
//       },
//       {
//         name: 'Inward Approval', icon: RiInboxArchiveLine,
//         path: '/inventorypage?activeTab=inward-approval',
//         children: [
//           { name: 'Finished Goods', icon: RiCheckboxCircleLine, path: '#' },
//           { name: 'Finished goods product order', icon: RiShoppingBasket2Line, path: '#' },
//           { name: 'Trims & Stores purchase order', icon: RiScissors2Line, path: '/inverntory/packeging-barcode/' },
//         ],
//       },
//       {
//         name: 'Provisonal GRN', icon: RiFileShield2Line,
//         path: '/inventorypage?activeTab=provisinal-grn',
//         children: [
//           { name: 'Finished Goods', icon: RiCheckboxCircleLine, path: '#' },
//           { name: 'Finished goods product order', icon: RiShoppingBasket2Line, path: '#' },
//           { name: 'Trims & Stores purchase order', icon: RiScissors2Line, path: '/inverntory/packeging-barcode/' },
//         ],
//       },
//       {
//         name: 'Purchase Inward', icon: RiDownload2Line,
//         path: '/inventorypage?activeTab=purchase-inward',
//         children: [
//           { name: 'Finished Goods', icon: RiCheckboxCircleLine, path: '#' },
//           { name: 'Finished goods product order', icon: RiShoppingBasket2Line, path: '#' },
//           { name: 'Trims & Stores purchase order', icon: RiScissors2Line, path: '/inverntory/packeging-barcode/' },
//         ],
//       },
//       {
//         name: 'RM/Acc Issue',
//         icon: RiShareForwardLine, // ✔ issuing / sending items outward
//         path: '/inventorypage?activeTab=rm-acc-issue',
//         children: [
//           { name: 'Finished Goods', icon: RiCheckboxCircleLine, path: '#' },
//           { name: 'Finished goods product order', icon: RiShoppingBasket2Line, path: '#' },
//           { name: 'Trims & Stores purchase order', icon: RiScissors2Line, path: '/inverntory/packeging-barcode/' },
//         ],
//       },
//       {
//         name: 'Manufacturing',
//         icon: RiSettings4Line, // ✔ processing / operations
//         path: '/inventorypage?activeTab=manufacturing',
//         children: [
//           { name: 'Finished Goods', icon: RiCheckboxCircleLine, path: '#' },
//           { name: 'Finished goods product order', icon: RiShoppingBasket2Line, path: '#' },
//           { name: 'Trims & Stores purchase order', icon: RiScissors2Line, path: '/inverntory/packeging-barcode/' },
//         ],
//       }
//       ,
//       {
//         name: 'Other Transaction',
//         icon: RiExchangeLine, // ✔ other transfers / transactions
//         path: '/inventorypage?activeTab=other-transactions',
//         children: [
//           { name: 'Finished Goods', icon: RiCheckboxCircleLine, path: '#' },
//           { name: 'Finished goods product order', icon: RiShoppingBasket2Line, path: '#' },
//           { name: 'Trims & Stores purchase order', icon: RiScissors2Line, path: '/inverntory/packeging-barcode/' },
//         ],
//       }
//       ,

//       {
//         name: 'Sample Packing',
//         icon: RiBriefcase2Line, // ✔ packaging / sample case
//         path: '/inventorypage?activeTab=sample-packaging',
//         children: [
//           { name: 'Finished Goods', icon: RiCheckboxCircleLine, path: '#' },
//           { name: 'Finished goods product order', icon: RiShoppingBasket2Line, path: '#' },
//           { name: 'Trims & Stores purchase order', icon: RiScissors2Line, path: '/inverntory/packeging-barcode/' },
//         ],
//       }
//       , {
//         name: 'Make to Order',
//         icon: RiPlayListAddLine, // ✔ custom order creation
//         path: '/inventorypage?activeTab=make-to-order',
//         children: [
//           { name: 'Finished Goods', icon: RiCheckboxCircleLine, path: '#' },
//           { name: 'Finished goods product order', icon: RiShoppingBasket2Line, path: '#' },
//           { name: 'Trims & Stores purchase order', icon: RiScissors2Line, path: '/inverntory/packeging-barcode/' },
//         ],
//       },

//       {
//         name: 'Sales/Dispatch',
//         icon: RiTruckLine, // ✔ delivery / dispatch
//         path: '/inventorypage?activeTab=sales-dispatch',
//         children: [
//           { name: 'Sales Order Offline', icon: RiShoppingCart2Line, path: '/inverntory/inventory-offline/' }, // ✔ offline sales
//           { name: 'Sales Order Barcode', icon: RiShoppingCart2Line, path: '/inverntory/salesorderbarcode' },
//           // { name: 'Packaging/Barcode', icon: RiBarcodeLine, path: '/inverntory/packeging-barcode/' }, 
//         ],
//       },
//       {
//         name: 'Sampling & Production',
//         icon: RiBuilding4Line, // ✔ production / factory
//         path: '/inventorypage?activeTab=sampling-production',
//         children: [
//           { name: 'Buyer Enq', icon: RiSearchLine, path: '#' }, // ✔ search/enquiry
//           { name: 'Sales Offline', icon: RiShoppingCart2Line, path: '/inverntory/stock-enquiry-table' }, // ✔ offline sales
//           { name: 'Packaging/Barcode', icon: RiBarcodeLine, path: '/inverntory/packeging-barcode/' }, // ✔ barcode/packaging
//         ],
//       },

//       // { name: 'Stock Adjustment', icon: RiSettings4Line, path: '/inventorypage?activeTab=stockadjustment' },
//       // { name: 'Inventory Valuation', icon: RiPriceTag3Line,
//       //    path: '/inventorypage?activeTab=inventory-valuation' },
//     ],
//   },

//   {
//     name: 'Accounts',
//     icon: MdAccountBalance,
//     // path: '#',
//     path: '/accountspage',
//     children: [
//       { name: 'General Ledger', icon: MdAssignment, path: '#' },
//       { name: 'Accounts Payable', icon: MdPayments, path: '#' },
//       { name: 'Accounts Receivable', icon: MdReceipt, path: '#' },
//       { name: 'Financial Reports', icon: MdAnalytics, path: '#' },
//     ],
//   },
//   {
//     name: 'Ticketing',
//     icon: TiTicket,
//     path: '/masterpage?activeTab=ticketing',
//     children: [
//       { name: 'Dashboard', icon: MdReceipt, path: '/tickets/ticket-dashboard' },
//       {
//         name: 'Master', icon: MdAssignment,
//         //  path: '/masterpage/',
//         children: [
//           { name: 'Category', icon: MdCategory, path: '/masters/ticketing/ticketCategory/' },
//           { name: 'SubCategory', icon: MdSubdirectoryArrowRight, path: '/masters/ticketing/ticketSubCat/' },
//           { name: 'Service/Complaint', icon: MdSupportAgent, path: '/masters/ticketing/serviceComplaint/' },
//         ],
//       },
//       { name: 'Raise Ticket', icon: MdPayments, path: '/tickets/create-tickets/' },
//     ],
//   },
//   // { name: 'Ticket', icon: TiTicket, path: '/tickets/ticket-dashboard' },
//   {
//     name: 'Inventory Report',
//     icon: MdOutlineInventory,
//     children: [
//       { name: 'General Ledger', icon: MdAssignment, path: '#' },
//       { name: 'Accounts Payable', icon: MdPayments, path: '#' },
//       { name: 'Accounts Receivable', icon: MdReceipt, path: '#' },
//       { name: 'Financial Reports', icon: MdAnalytics, path: '#' },
//     ],
//   },
//   {
//     name: 'Accounts Report',
//     icon: RiFileChartLine,
//     children: [
//       { name: 'General Ledger', icon: MdAssignment, path: '#' },
//       { name: 'Accounts Payable', icon: MdPayments, path: '#' },
//       { name: 'Accounts Receivable', icon: MdReceipt, path: '#' },
//       { name: 'Financial Reports', icon: MdAnalytics, path: '#' },
//     ],
//   },
//   {
//     name: 'HR & Operation',
//     icon: FaUserTie,
//     children: [
//       { name: 'Employee Management', icon: MdPeople, path: '#' },
//       { name: 'Payroll Processing', icon: MdPayments, path: '#' },
//       { name: 'Attendance Tracking', icon: MdEvent, path: '#' },
//       { name: 'HR Reports', icon: MdSummarize, path: '#' },
//     ],
//   },
//   {
//     name: 'Administrator',
//     icon: RiAdminLine,
//     children: [
//       { name: 'Employee Management', icon: MdPeople, path: '#' },
//       { name: 'Payroll Processing', icon: MdPayments, path: '#' },
//       { name: 'Attendance Tracking', icon: MdEvent, path: '#' },
//       { name: 'HR Reports', icon: MdSummarize, path: '#' },
//     ],
//   },
//   ,
//   {
//     name: 'Utility',
//     icon: IoIosConstruct,
//     children: [
//       { name: 'Employee Management', icon: MdPeople, path: '#' },
//       { name: 'Payroll Processing', icon: MdPayments, path: '#' },
//       { name: 'Attendance Tracking', icon: MdEvent, path: '#' },
//       { name: 'HR Reports', icon: MdSummarize, path: '#' },
//     ],
//   },
//   {
//     name: 'Reports',
//     icon: MdAnalytics,
//     children: [
//       { name: 'Sales Reports', icon: MdLocalMall, path: '#' },
//       { name: 'Purchase Reports', icon: FaTruck, path: '#' },
//       { name: 'Inventory Reports', icon: MdInventory, path: '#' },
//       { name: 'Financial Reports', icon: MdAccountBalance, path: '#' },
//     ],
//   },
//   {
//     name: 'Help',
//     icon: IoIosConstruct,
//     children: [
//       { name: 'User Info', icon: MdPeople, path: '#' },
//       { name: 'Customer Care', icon: MdPayments, path: '#' },
//       // { name: 'Cascade', icon: MdEvent, path: '#' },
//       // { name: 'Tile Horizontal', icon: MdSummarize, path: '#' },
//       // { name: 'Tile Vertical', icon: MdPayments, path: '#' },
//       { name: 'Barcode History', icon: MdEvent, path: '#' },
//       { name: 'Query Help', icon: MdSummarize, path: '#' },
//       { name: 'Close All Windows', icon: MdEvent, path: '#' },
//       { name: ' Help', icon: MdSummarize, path: '#' },
//     ],
//   },
//   {
//     name: 'UserPermission',
//     icon: MdAccountBalance,

//     path: '/userpermission',

//   },

// ];



import {
  MdDashboard, MdSearch, MdOutlineApartment, MdClose, MdMenu, MdChevronRight, MdDomain, MdMap, MdOutlineGroupWork, MdCategory, MdWarehouse, MdWork,
  MdAccountBox, MdEmojiPeople, MdAccessibility, MdLocalShipping, MdPeople, MdPersonAdd, MdClass, MdLocalOffer, MdStars, MdRateReview, MdBuild,
  MdLocalMall, MdCollectionsBookmark, MdStraighten, MdBrandingWatermark, MdReceipt, MdGavel, MdAssignment, MdAttachMoney, MdEvent, MdAnalytics,
  MdSettings, MdInventory, MdAccountBalance, MdPayments, MdSummarize, MdPushPin, MdOutlinePushPin, MdOutlineInventory, MdCalendarToday,
  MdSubdirectoryArrowRight, MdSupervisorAccount, MdAnchor, MdPercent, MdPayment, MdSettingsSuggest, MdHowToReg, MdRuleFolder,
  MdAssignmentTurnedIn, MdSupport, MdSupportAgent, MdAddTask,
} from 'react-icons/md';
import {
  MdFactCheck, MdPlaylistAddCheck, MdTune, MdScience, MdOutlineScience
} from "react-icons/md";
import {
  RiFileList3Line, RiScissors2Line, RiLoopLeftLine, RiUserSharedLine, RiCheckboxBlankCircleLine,
  RiFileList2Line, RiToolsLine, RiShoppingBag3Line, RiShoppingBasket2Line,
  RiBarcodeLine, RiInboxArchiveLine, RiFileShield2Line, RiImageAddLine, RiDownload2Line, RiShareForwardLine, RiSettings4Line,
  RiPriceTag3Line, RiExchangeLine, RiStackLine, RiBriefcase2Line, RiSearchLine, RiPlayListAddLine,
  RiUserSearchLine, RiShoppingCart2Line, RiTaskLine, RiTruckLine, RiTimer2Line, RiBuilding4Line,
  RiDraftLine, RiTestTubeLine, RiCheckboxCircleLine, RiArchiveStackLine, RiTicket2Line, RiTicket2Fill,
} from 'react-icons/ri';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import AssistantNavigationIcon from '@mui/icons-material/AssistantNavigation';
import { TiTicket } from "react-icons/ti";
import { FaBuilding, FaTruck, FaUserTag, FaHandshake, FaBalanceScale, FaBoxOpen, FaBoxes, FaUserTie, FaRupeeSign } from 'react-icons/fa';
import { FiUser } from 'react-icons/fi';
import { RiFileChartLine, RiAdminLine } from "react-icons/ri";
import { AiOutlineUsergroupAdd, AiOutlineNodeIndex } from 'react-icons/ai';
import { IoIosConstruct } from 'react-icons/io';

export const sidebarMenuItems = [
  { name: 'Dashboard', icon: MdDashboard, path: '/dashboard' },
  {
    name: 'Masters',
    icon: MdOutlineApartment,
    path: '/masterpage',
    children: [
      {
        name: 'Company',
        icon: FaBuilding,
        // MOD_NAME: "mnuMstCompany",
        // MOD_NAME: "mnuCompany",
        path: '/masterpage?activeTab=company',
        children: [
          {
            name: 'Company', icon: MdDomain,
            // MOD_NAME: "mnuMstCompany",
            path: '/masters/company/company'
          },
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
      {
        name: 'Location',
        icon: FaTruck,
        path: '/masterpage?activeTab=location',
        children: [
          { name: 'Location master', icon: FaHandshake, path: '#' },
        ],
      },
      {
        name: 'Vendors',
        icon: MdLocalShipping,
        // MOD_NAME: "mnuVendors",
        path: '/masterpage?activeTab=vendors',
        children: [
          { name: 'Broker', icon: FaHandshake, path: '#' },
          { name: 'Transporter', icon: MdLocalShipping, path: '#' },
          {
            name: 'Creditors/Suppliers',
            // MOD_NAME: "mnuMstSuppliers",
            icon: FaUserTag, path: '/masters/vendors'
          },
        ],
      },
      {
        name: 'Customers',
        icon: MdPeople,
        // MOD_NAME: "mnuParty",
        path: '/masterpage?activeTab=customers',
        children: [
          {
            name: 'Debtors/Customers',
            // MOD_NAME: "mnuMstrClient",
            icon: MdPeople, path: '/masters/customers'
          },
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
        path: '/masterpage?activeTab=process',
      },
      {
        name: 'Products',
        icon: FaBoxOpen,
        // MOD_NAME: "mnuMstrProduct",
        path: '/masterpage?activeTab=products',
        children: [
          {
            name: 'Category Master',
            // MOD_NAME: "mnuMstrFinishPrdCateg",
            icon: MdCategory, path: '/masters/products/category'
          },

          {
            name: 'Product Group',
            // MOD_NAME: "mnuProdGrp", 
            icon: AiOutlineNodeIndex, path: '/masters/products/productgrp'
          },

          {
            name: 'Product Master',
            // MOD_NAME: "ToolStripMenuItem20", 
            icon: MdLocalMall, path: '/masters/products/product'
          },

          {
            name: 'Style Master',
            // MOD_NAME: "mnuMstStyleRate",
            icon: MdCollectionsBookmark, path: '#'
          },

          {
            name: 'Type Master',
            //  MOD_NAME: "mnuMstStyleRate",
            icon: MdCategory, path: '/masters/products/type'
          },

          {
            name: 'Shade Master',
            // MOD_NAME: "mnuRmShadeMast",
            icon: MdBrandingWatermark, path: '/masters/products/shade'
          },

          {
            name: 'Pattern Master',
            // MOD_NAME: "PatternMasterToolStripMenuItem", 
            icon: MdCollectionsBookmark, path: '/masters/products/pattern'
          },

          {
            name: 'Brand Master',
            // MOD_NAME: "mnuMstrBrand",
            icon: MdBrandingWatermark, path: '/masters/products/brand'
          },

          {
            name: 'Unit Master',
            //  MOD_NAME: "mnuMstrUnit",
            icon: MdStraighten, path: '/masters/products/unit'
          },

          {
            name: 'Web Collection',
            // MOD_NAME: "mnuWebCollection",
            icon: MdCollectionsBookmark, path: '/masters/products/webcollection'
          },

          {
            name: 'Quality',
            // MOD_NAME: "mnuQuality", 
            icon: MdBrandingWatermark, path: '/masters/products/quality'
          },

          { name: 'RackMst', icon: MdBuild, path: '/masters/products/rack' },
          { name: 'Prod Series', icon: MdAssignment, path: '/masters/products/prodseries' },
        ],
      },
      {
        name: 'GST/SAC Code',
        icon: MdReceipt,
        path: '/masterpage?activeTab=gst',
        children: [
          { name: 'GST Codes', icon: MdReceipt, path: '#' },
        ],
      },
      {
        name: 'Tax/Terms',
        icon: FaBalanceScale,
        path: '/masterpage?activeTab=tax',
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
        path: '/masterpage?activeTab=tds',
        children: [
          { name: 'Broker', icon: FaHandshake, path: '#' },
        ],
      },
      ,
      {
        name: 'QC Master',
        icon: FaTruck,
        path: '/masterpage?activeTab=qc',
        children: [
          { name: 'QC Group', icon: MdFactCheck, path: '/masters/qc/qcgrp/qcgroup' },
          { name: 'QC SubGroup', icon: MdPlaylistAddCheck, path: '/masters/qc/qcsubgrp/qcsubgroup/' },
          { name: 'QC Parameter', icon: MdTune, path: '/masters/qc/qcparameter/qcparamtr' },
          { name: 'QC Product Process', icon: MdScience, path: '/masters/qc/qcprdprocess/qcprdpro' },
          {
            name: 'QC Test',
            icon: RiTestTubeLine,
            children: [
              { name: 'Raw Material', icon: MdGavel, path: '/masters/qc/qctest/rawmaterial/rawmaterial' },
              { name: 'Finished Goods', icon: MdTune, path: '/masters/qc/qctest/finishedgoods/finishedgoods' },
              { name: 'Stores', icon: FaHandshake, path: '/masters/qc/qctest/stores/stores' },
              { name: 'Semi Finished', icon: MdBuild, path: '/masters/qc/qctest/semifinished/semifinish' },
            ]
          },

        ],
      },
      {
        name: 'Season',
        icon: MdEvent,
        path: '/masterpage?activeTab=season',
        children: [
          { name: 'Season Master', icon: MdEvent, path: '/masters/season/season' },
        ],
      },

      {
        name: 'Managers',
        icon: MdSupervisorAccount,
        path: '#',
        children: [
          { name: 'Broker', icon: FaHandshake, path: '#' },
        ],
      },
      {
        name: 'WareHouse Management',
        icon: MdWarehouse,
        path: '#',
        children: [
          { name: 'Broker', icon: FaHandshake, path: '#' },
        ],
      },
      ,
      {
        name: 'Port Master',
        icon: MdAnchor,
        path: '#',
        children: [
          { name: 'Broker', icon: FaHandshake, path: '#' },
        ],
      }
      ,
      {
        name: 'Payment term',
        icon: MdPayment,
        path: '#',
        children: [
          { name: 'Broker', icon: FaHandshake, path: '#' },
        ],
      },
      {
        name: 'Rate term',
        icon: MdPercent,
        path: '#',
        children: [
          { name: 'Broker', icon: FaHandshake, path: '#' },

        ],
      },
      {
        name: 'Approval Settings',
        icon: MdSettingsSuggest,
        path: '#',
        children: [
          { name: 'Broker', icon: FaHandshake, path: '#' },
        ],
      },
      {
        name: 'Approval',
        icon: MdHowToReg,
        path: '/masterpage?activeTab=Approval',
        children: [
          { name: 'Broker', icon: FaHandshake, path: '#' },
        ],
      },
      {
        name: 'TransApproval',
        icon: MdAssignmentTurnedIn,
        path: '#',
        children: [
          { name: 'Broker', icon: FaHandshake, path: '#' },
        ],
      },
      {
        name: 'TransApproval Setting',
        icon: MdRuleFolder,
        path: '#',
        children: [
          { name: 'Broker', icon: FaHandshake, path: '#' },

        ],
      },
      // {
      //   name: 'Ticketing',
      //   icon: TiTicket,
      //   path: '/masterpage?activeTab=ticketing',
      //   children: [
      //     { name: 'Ticket Category', icon: MdCategory, path: '/masters/ticketing/ticketCategory' },
      //     { name: 'Ticket SubCategory', icon: MdSubdirectoryArrowRight, path: '/masters/ticketing/ticketSubCat' },
      //     { name: 'Service/Complaint', icon: MdSupport, path: '/masters/ticketing/serviceComplaint' },
      //     { name: 'Raise Service Ticket', icon: MdAddTask, path: '/masters/ticketing/raiseTicket' },
      //   ],
      // },
    ],
  },

  {
    name: 'Inventory',
    icon: MdWarehouse,
    // MOD_NAME: "mnuTransaction",
    path: '/inventorypage?activeTab=inventory-items',
    children: [
      {
        name: 'Inventory Items',
        icon: FaBuilding,
        path: '/inventorypage?activeTab=inventory-items',
        children: [
          { name: 'Artical/Style Master', icon: RiFileList3Line, path: '/inverntory/style/' },
          {
            name: 'Style/Parts Master',
            icon: RiToolsLine,
            path: '#'
          },
          {
            name: 'BarCode Printing',
            icon: RiBarcodeLine,
            path: '#'
          },
          {
            name: 'Style Shade Image Upload',
            icon: RiImageAddLine,
            path: '#'
          },
          {
            name: 'Price List Details',
            icon: RiPriceTag3Line,
            path: '#',
            dividerAfter: true,
          },],
      },

      {
        name: 'Sampling & Development',
        icon: RiStackLine,
        path: '/inventorypage?activeTab=sampling',
        children: [
          {
            name: 'Stock Enquiry',
            icon: RiSearchLine,
            path: '#'
          },
          {
            name: 'Buyer Enquiry',
            icon: RiUserSearchLine,
            path: '#'
          },
          {
            name: 'Enquiry Follow-ups',
            icon: RiTaskLine,
            path: '/inverntory/packeging-barcode/'
          },
          {
            name: 'Pending for Acceptance',
            icon: RiTimer2Line,
            path: '/inverntory/packeging-barcode/'
          },
          {
            name: 'Sampling Form',
            icon: RiDraftLine,
            path: '/inverntory/packeging-barcode/'
          },
          {
            name: 'Enquiry Status',
            icon: RiCheckboxCircleLine,
            path: '/inverntory/packeging-barcode/'
          },
        ],
      },
      {
        name: 'Opening Stock', icon:
          MdInventory, path: '/inventorypage?activeTab=opening-stock',
        children: [
          {
            name: 'RM Stock',
            icon: RiArchiveStackLine,
            path: '/inverntory/packeging-barcode/'
          },
          {
            name: 'Trims & Stores with Party',
            icon: RiScissors2Line,
            path: '#'
          },
          {
            name: 'Finished Good Stock',
            icon: RiCheckboxCircleLine,
            path: '/inverntory/packeging-barcode/'
          },
          {
            name: 'Process Stock with Party',
            icon: RiLoopLeftLine,
            path: '/inverntory/packeging-barcode/'
          },
          {
            name: 'RM Stock with Party',
            icon: RiUserSharedLine,
            path: '/inverntory/packeging-barcode/'
          },
        ],
      },
      {
        name: 'Purchase Order', icon: RiFileList2Line,
        path: '/inventorypage?activeTab=purchase-order',
        children: [
          { name: 'RM Purchase Order', icon: RiShoppingBag3Line, path: '/inverntory/packeging-barcode/' },
          { name: 'Finished goods product order', icon: RiCheckboxBlankCircleLine, path: '#' },
          { name: 'Trims & Stores purchase order', icon: RiScissors2Line, path: '/inverntory/packeging-barcode/' },
        ],
      },
      {
        name: 'Inward Approval', icon: RiInboxArchiveLine,
        path: '/inventorypage?activeTab=inward-approval',
        children: [
          { name: 'Finished Goods', icon: RiCheckboxCircleLine, path: '#' },
          { name: 'Finished goods product order', icon: RiShoppingBasket2Line, path: '#' },
          { name: 'Trims & Stores purchase order', icon: RiScissors2Line, path: '/inverntory/packeging-barcode/' },
        ],
      },
      {
        name: 'Provisonal GRN', icon: RiFileShield2Line,
        path: '/inventorypage?activeTab=provisinal-grn',
        children: [
          { name: 'Finished Goods', icon: RiCheckboxCircleLine, path: '#' },
          { name: 'Finished goods product order', icon: RiShoppingBasket2Line, path: '#' },
          { name: 'Trims & Stores purchase order', icon: RiScissors2Line, path: '/inverntory/packeging-barcode/' },
        ],
      },
      {
        name: 'Purchase Inward', icon: RiDownload2Line,
        path: '/inventorypage?activeTab=purchase-inward',
        children: [
          { name: 'Finished Goods', icon: RiCheckboxCircleLine, path: '#' },
          { name: 'Finished goods product order', icon: RiShoppingBasket2Line, path: '#' },
          { name: 'Trims & Stores purchase order', icon: RiScissors2Line, path: '/inverntory/packeging-barcode/' },
        ],
      },
      {
        name: 'RM/Acc Issue',
        icon: RiShareForwardLine,
        path: '/inventorypage?activeTab=rm-acc-issue',
        children: [
          { name: 'Finished Goods', icon: RiCheckboxCircleLine, path: '#' },
          { name: 'Finished goods product order', icon: RiShoppingBasket2Line, path: '#' },
          { name: 'Trims & Stores purchase order', icon: RiScissors2Line, path: '/inverntory/packeging-barcode/' },
        ],
      },
      {
        name: 'Manufacturing',
        icon: RiSettings4Line,
        path: '/inventorypage?activeTab=manufacturing',
        children: [
          { name: 'Finished Goods', icon: RiCheckboxCircleLine, path: '#' },
          { name: 'Finished goods product order', icon: RiShoppingBasket2Line, path: '#' },
          { name: 'Trims & Stores purchase order', icon: RiScissors2Line, path: '/inverntory/packeging-barcode/' },
        ],
      }
      ,
      {
        name: 'Other Transaction',
        icon: RiExchangeLine,
        path: '/inventorypage?activeTab=other-transactions',
        children: [
          { name: 'Finished Goods', icon: RiCheckboxCircleLine, path: '#' },
          { name: 'Finished goods product order', icon: RiShoppingBasket2Line, path: '#' },
          { name: 'Trims & Stores purchase order', icon: RiScissors2Line, path: '/inverntory/packeging-barcode/' },
        ],
      }
      ,

      {
        name: 'Sample Packing',
        icon: RiBriefcase2Line,
        path: '/inventorypage?activeTab=sample-packaging',
        children: [
          { name: 'Finished Goods', icon: RiCheckboxCircleLine, path: '#' },
          { name: 'Finished goods product order', icon: RiShoppingBasket2Line, path: '#' },
          { name: 'Trims & Stores purchase order', icon: RiScissors2Line, path: '/inverntory/packeging-barcode/' },
        ],
      }
      , {
        name: 'Make to Order',
        icon: RiPlayListAddLine,
        path: '/inventorypage?activeTab=make-to-order',
        children: [
          { name: 'Finished Goods', icon: RiCheckboxCircleLine, path: '#' },
          { name: 'Finished goods product order', icon: RiShoppingBasket2Line, path: '#' },
          { name: 'Trims & Stores purchase order', icon: RiScissors2Line, path: '/inverntory/packeging-barcode/' },
        ],
      },

      {
        name: 'Sales/Dispatch',
        icon: RiTruckLine,
        // MOD_NAME: "mnuTrnSales",
        path: '/inventorypage?activeTab=sales-dispatch',
        children: [
          {
            name: 'Order Booking (Hide Stock/FOB/WO)',
            // MOD_NAME: "mnuTrnSalesOrderWOStk",
            icon: RiShoppingCart2Line, path: '/inverntory/inventory-offline/'
          },
          {
            name: 'Order Booking (Only BarCode)',
            // MOD_NAME: "mnuonlybarcode",
            icon: RiShoppingCart2Line, path: '/inverntory/salesorderbarcode'
          },
          { name: 'Scan Barcode', icon: RiShoppingCart2Line, path: '/inverntory/scan-Barcode' },
          { name: 'Paking Slip', icon: RiShoppingCart2Line, path: '/inverntory/packingslip' },
        ],
      },
      {
        name: 'Sampling & Production',
        icon: RiBuilding4Line,
        path: '/inventorypage?activeTab=sampling-production',
        children: [
          { name: 'Buyer Enq', icon: RiSearchLine, path: '#' },
          { name: 'Sales Offline', icon: RiShoppingCart2Line, path: '/inverntory/stock-enquiry-table' },
          { name: 'Packaging/Barcode', icon: RiBarcodeLine, path: '/inverntory/packeging-barcode/' },
          // { name: 'TNA', icon: AssistantNavigationIcon, path: '/inverntory/tnadash/' },
          // { name: 'Update Routing', icon: RiBarcodeLine, path: '/inverntory/updaterouting/' },
          //  { name: 'Update Rm', icon: AltRouteIcon, path: '/inverntory/updaterm/' },
          //   { name: 'Update Trims', icon: ContentCutIcon, path: '/inverntory/updatetrims/' },
        ],
      },
    ],
  },

  {
    name: 'Accounts',
    icon: MdAccountBalance,
    // path: '/accountspage',
    children: [
      { name: 'General Ledger', icon: MdAssignment, path: '#' },
      { name: 'Accounts Payable', icon: MdPayments, path: '#' },
      { name: 'Accounts Receivable', icon: MdReceipt, path: '#' },
      { name: 'Financial Reports', icon: MdAnalytics, path: '#' },
    ],
  },
  {
    name: 'Ticketing',
    icon: TiTicket,
    path: '/masterpage?activeTab=ticketing',
    children: [
      { name: 'Dashboard', icon: MdReceipt, path: '/tickets/ticket-dashboard' },
      {
        name: 'Master', icon: MdAssignment,
        children: [
          { name: 'Category', icon: MdCategory, path: '/masters/ticketing/ticketCategory/' },
          { name: 'SubCategory', icon: MdSubdirectoryArrowRight, path: '/masters/ticketing/ticketSubCat/' },
          { name: 'Service/Complaint', icon: MdSupportAgent, path: '/masters/ticketing/serviceComplaint/' },
        ],
      },
      { name: 'Raise Ticket', icon: MdPayments, path: '/tickets/create-tickets/' },
      { name: 'Ticket Escalation', icon: RiTicket2Fill, path: '/tickets/ticket-esclation' },
      { name: 'Ticket Status', icon: RiTicket2Line, path: '/tickets/all-tickets' },
    ],
  },
  {
    name: 'TNA',
    icon: MdAccountBalance,
    path: '/tnapage',
    children: [
     { name: 'TNA', icon: AssistantNavigationIcon, path: '/tnapage/tnadash/' },
      { name: 'Update Routing', icon: RiBarcodeLine, path: '/tnapage/updaterouting/' },
      { name: 'Update Rm', icon: AltRouteIcon, path: '/tnapage/updaterm/' },
      { name: 'Update Trims', icon: ContentCutIcon, path: '/tnapage/updatetrims/' },
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
    name: 'Help',
    icon: IoIosConstruct,
    children: [
      { name: 'User Info', icon: MdPeople, path: '#' },
      { name: 'Customer Care', icon: MdPayments, path: '#' },
      { name: 'Barcode History', icon: MdEvent, path: '#' },
      { name: 'Query Help', icon: MdSummarize, path: '#' },
      { name: 'Close All Windows', icon: MdEvent, path: '#' },
      { name: 'Help', icon: MdSummarize, path: '#' },
    ],
  },
  {
    name: 'UserPermission',
    icon: MdAccountBalance,
    path: '/userpermission',
  },
];

// Function to get all menu items with their paths (flattened structure)
export const getAllMenuItemsWithPaths = () => {
  const allItems = [];

  const flattenMenuItems = (items) => {
    items.forEach(item => {
      // Add the item if it has a valid path
      if (item.path && item.path !== '#') {
        allItems.push({
          name: item.name,
          path: item.path,
          icon: item.icon,
        });
      }

      // Recursively process children
      if (item.children) {
        flattenMenuItems(item.children);
      }
    });
  };

  flattenMenuItems(sidebarMenuItems);
  return allItems;
};

// Function to get icon component
export const getIconComponent = (Icon) => {
  if (!Icon) return null;
  return Icon;
};

// Indian accent variations helper function
export const getIndianVariations = (text) => {
  const variations = new Set();
  const lowerText = text.toLowerCase();

  variations.add(lowerText);

  // Common Indian mispronunciations and variations
  const transformations = [
    // RM Purchase Order variations
    (str) => str.replace(/rm purchase order/gi, 'आरएम पर्चेज ऑर्डर'),
    (str) => str.replace(/rm purchase order/gi, 'ar em purchase order'),
    (str) => str.replace(/rm purchase/gi, 'आरएम पर्चेज'),
    (str) => str.replace(/purchase order/gi, 'पर्चेज ऑर्डर'),

    // Sales Order variations
    (str) => str.replace(/sales order/gi, 'सेल्स ऑर्डर'),
    (str) => str.replace(/sales order/gi, 'सेल ऑर्डर'),

    // General variations
    (str) => str.replace(/inventory/gi, 'इन्वेंटरी'),
    (str) => str.replace(/inventory/gi, 'इनवेंटरी'),
    (str) => str.replace(/dashboard/gi, 'डैशबोर्ड'),
    (str) => str.replace(/dashboard/gi, 'डैश बोर्ड'),
    (str) => str.replace(/master/gi, 'मास्टर'),
    (str) => str.replace(/company/gi, 'कंपनी'),
    (str) => str.replace(/property/gi, 'प्रॉपर्टी'),

    // Remove spaces for fuzzy matching
    (str) => str.replace(/\s+/g, ''),
    (str) => str.replace(/\s+/g, ' ').trim(),

    // Abbreviations
    (str) => str.replace(/raw material/gi, 'आरएम'),
    (str) => str.replace(/raw material/gi, 'rm'),
  ];

  transformations.forEach(transform => {
    try {
      const variation = transform(lowerText);
      if (variation && variation !== lowerText) {
        variations.add(variation);
      }
    } catch (e) {
      // Ignore errors
    }
  });

  // Add common partial queries
  if (lowerText.includes('rm') && lowerText.includes('purchase') && lowerText.includes('order')) {
    variations.add('rm purchase');
    variations.add('rm order');
    variations.add('purchase order');
    variations.add('rmpo');
    variations.add('आरएमपीओ');
  }

  return Array.from(variations);
};

// Function to find module by voice input (Indian accent aware)
export const findModuleByVoiceInput = (voiceInput, modules) => {
  const input = voiceInput.toLowerCase().trim();

  // First try exact match
  let exactMatch = modules.find(module =>
    module.name.toLowerCase() === input
  );

  if (exactMatch) return exactMatch;

  // Try with Indian variations
  for (const module of modules) {
    const variations = getIndianVariations(module.name);
    if (variations.some(variation => variation === input)) {
      return module;
    }
  }

  // Try partial matches
  for (const module of modules) {
    const moduleName = module.name.toLowerCase();

    // Check if input contains module name or vice versa
    if (moduleName.includes(input) || input.includes(moduleName)) {
      return module;
    }

    // Check word-wise matching
    const inputWords = input.split(/\s+/);
    const moduleWords = moduleName.split(/\s+/);

    // Check if all input words are in module
    const allWordsMatch = inputWords.every(inputWord =>
      moduleWords.some(moduleWord => moduleWord.includes(inputWord))
    );

    if (allWordsMatch) {
      return module;
    }

    // Check if any word matches significantly
    const significantMatch = inputWords.some(inputWord => {
      if (inputWord.length < 3) return false;
      return moduleWords.some(moduleWord =>
        moduleWord.includes(inputWord) || inputWord.includes(moduleWord)
      );
    });

    if (significantMatch) {
      return module;
    }
  }

  return null;
};