// src/data/menuData.js
import {
  MdDashboard, MdSearch, MdOutlineApartment, MdChevronRight,
  MdDomain, MdMap, MdOutlineGroupWork, MdCategory, MdWarehouse, MdWork,
  MdAccountBox, MdEmojiPeople, MdAccessibility, MdLocalShipping, MdPeople,
  MdPersonAdd, MdClass, MdLocalOffer, MdStars, MdRateReview, MdBuild,
  MdLocalMall, MdCollectionsBookmark, MdStraighten, MdBrandingWatermark,
  MdReceipt, MdGavel, MdAssignment, MdAttachMoney, MdEvent, MdAnalytics,
  MdSettings, MdInventory, MdAccountBalance, MdPayments, MdSummarize,
  MdPushPin, MdOutlinePushPin, MdOutlineInventory
} from 'react-icons/md';

import { FaBuilding, FaTruck, FaUserTag, FaHandshake, FaBalanceScale, FaBoxOpen, FaBoxes, FaUserTie, FaRupeeSign } from 'react-icons/fa';
import { FiUser } from 'react-icons/fi';
import { AiOutlineUsergroupAdd, AiOutlineNodeIndex } from 'react-icons/ai';
import { TiTicket } from 'react-icons/ti';
import { RiFileChartLine, RiAdminLine } from 'react-icons/ri';
import { IoIosConstruct } from 'react-icons/io';

export const iconMap = {
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
  MdPushPin,
  MdOutlinePushPin,
  MdOutlineInventory,
  FaBuilding,
  FaTruck,
  FaUserTag,
  FaHandshake,
  FaBalanceScale,
  FaBoxOpen,
  FaBoxes,
  FaUserTie,
  FaRupeeSign,
  FiUser,
  AiOutlineUsergroupAdd,
  AiOutlineNodeIndex,
  TiTicket,
  RiFileChartLine,
  RiAdminLine,
  IoIosConstruct
};

export const menuItems = [
  { name: 'Dashboard', icon: MdDashboard, path: '/dashboard' },
  // { name: 'SalesDash', icon: FaRupeeSign, path: '/dashboard/sales-dashboard' },
  // { name: 'Stock Enquiry', icon: MdSearch, path: '/dashboard/stock-enquiry-table' },
  
  {
    name: 'Masters',
    icon: MdOutlineApartment,
    path: '/masterpage',
    children: [
      {
        name: 'Company',
        icon: FaBuilding,
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
      {
        name: 'Location',
        icon: FaTruck,
        path: '#',
      },
      {
        name: 'Vendors',
        icon: FaTruck,
        children: [
          { name: 'Broker', icon: FaHandshake, path: '#' },
          { name: 'Transporter', icon: MdLocalShipping, path: '#' },
          { name: 'Creditors/Suppliers', icon: FaUserTag, path: '/masters/vendors' },
        ],
      },
      {
        name: 'Customers',
        icon: MdPeople,
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
      {
        name: 'Process',
        icon: FaTruck,
        path: '#',
      },
      {
        name: 'Products',
        icon: FaBoxOpen,
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
        children: [
          { name: 'GST Codes', icon: MdReceipt, path: '#' },
        ],
      },
      {
        name: 'Tax/Terms',
        icon: FaBalanceScale,
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
      {
        name: 'Other Misc',
        icon: FaTruck,
        path: '#',
        children: [
          { name: 'Broker', icon: FaHandshake, path: '#' },
        ],
      },
      {
        name: 'TDS Master',
        icon: FaTruck,
        path: '#',
        children: [
          { name: 'Broker', icon: FaHandshake, path: '#' },
        ],
      },
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
      },
      {
        name: 'WareHouse Management',
        icon: FaTruck,
        path: '#',
        children: [
          { name: 'Broker', icon: FaHandshake, path: '#' },
        ],
      },
      {
        name: 'Port Master',
        icon: FaTruck,
        path: '#',
        children: [
          { name: 'Broker', icon: FaHandshake, path: '#' },
        ],
      },
      {
        name: 'Payment term',
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
      {
        name: 'Ticketing',
        icon: FaTruck,
        path: '#',
        children: [
          { name: 'Ticket Category', icon: FaHandshake, path: '/masters/ticketing/ticketCategory' },
          { name: 'Ticket SubCategory', icon: FaHandshake, path: '/masters/ticketing/ticketSubCat' },
          { name: 'Service/Complaint', icon: FaHandshake, path: '/masters/ticketing/serviceComplaint' },
          { name: 'Raise Service Ticket', icon: FaHandshake, path: '/masters/ticketing/raiseTicket' },
        ],
      },
    ],
  },
  {
    name: 'Inventory',
    icon: MdInventory,
    path: '/inventorypage',
    children: [
      { name: 'Artical/Style Master', icon: MdSummarize, path: '/inverntory/style/' },
      { name: 'Style/Parts Master', icon: MdSummarize, path: '#' },
      { name: 'BarCode Printing', icon: MdSummarize, path: '#' },
      { name: 'Style Shade Image upload', icon: MdSummarize, path: '#' },
      { name: 'Price List Detailes', icon: MdSummarize, path: '#' },
      {
        name: 'Sampling & Developement', icon: FaBoxes, path: '#',
        children: [
          { name: 'Stock Enquiry', icon: MdSearch, path: '#' },
          { name: 'Buyer Enquiry', icon: FaBoxes, path: '#' },
          { name: 'Enquiry Followups', icon: FaBoxes, path: '/inverntory/packeging-barcode/' },
          { name: 'Pending for Acceptance', icon: FaBoxes, path: '/inverntory/packeging-barcode/' },
          { name: 'Sampling Form', icon: FaBoxes, path: '/inverntory/packeging-barcode/' },
          { name: 'Enquiry Status', icon: FaBoxes, path: '/inverntory/packeging-barcode/' },
        ],
      },
      {
        name: 'Opening Stock', icon: FaBoxes, path: '#',
        children: [
          { name: 'RM Stock', icon: MdSearch, path: '/inverntory/packeging-barcode/' },
          { name: 'Trims & Stores with Party', icon: FaBoxes, path: '#' },
          { name: 'Finished good stock', icon: FaBoxes, path: '/inverntory/packeging-barcode/' },
          { name: 'Process stock with party', icon: FaBoxes, path: '/inverntory/packeging-barcode/' },
          { name: 'RM stock with party', icon: FaBoxes, path: '/inverntory/packeging-barcode/' },
        ],
      },
      {
        name: 'Purchase Order', icon: FaBoxes, path: '#',
        children: [
          { name: 'RM Purchase Order', icon: MdSearch, path: '/inverntory/packeging-barcode/' },
          { name: 'Finished goods product order', icon: FaBoxes, path: '#' },
          { name: 'Trims & Stores purchase order', icon: FaBoxes, path: '/inverntory/packeging-barcode/' },
        ],
      },
      {
        name: 'Inward Approvel', icon: FaBoxes, path: '#',
        children: [
          { name: 'Finished Goods', icon: MdSearch, path: '#' },
          { name: 'Finished goods product order', icon: FaBoxes, path: '#' },
          { name: 'Trims & Stores purchase order', icon: FaBoxes, path: '/inverntory/packeging-barcode/' },
        ],
      },
      {
        name: 'Provisonal GRN', icon: FaBoxes, path: '#',
        children: [
          { name: 'Finished Goods', icon: MdSearch, path: '#' },
          { name: 'Finished goods product order', icon: FaBoxes, path: '#' },
          { name: 'Trims & Stores purchase order', icon: FaBoxes, path: '/inverntory/packeging-barcode/' },
        ],
      },
      {
        name: 'Purchase Inward', icon: FaBoxes, path: '#',
        children: [
          { name: 'Finished Goods', icon: MdSearch, path: '#' },
          { name: 'Finished goods product order', icon: FaBoxes, path: '#' },
          { name: 'Trims & Stores purchase order', icon: FaBoxes, path: '/inverntory/packeging-barcode/' },
        ],
      },
      {
        name: 'RM/Acc Issue', icon: FaBoxes, path: '#',
        children: [
          { name: 'Finished Goods', icon: MdSearch, path: '#' },
          { name: 'Finished goods product order', icon: FaBoxes, path: '#' },
          { name: 'Trims & Stores purchase order', icon: FaBoxes, path: '/inverntory/packeging-barcode/' },
        ],
      },
      {
        name: 'Manufactring', icon: FaBoxes, path: '#',
        children: [
          { name: 'Finished Goods', icon: MdSearch, path: '#' },
          { name: 'Finished goods product order', icon: FaBoxes, path: '#' },
          { name: 'Trims & Stores purchase order', icon: FaBoxes, path: '/inverntory/packeging-barcode/' },
        ],
      },
      {
        name: 'Other Transaction', icon: FaBoxes, path: '#',
        children: [
          { name: 'Finished Goods', icon: MdSearch, path: '#' },
          { name: 'Finished goods product order', icon: FaBoxes, path: '#' },
          { name: 'Trims & Stores purchase order', icon: FaBoxes, path: '/inverntory/packeging-barcode/' },
        ],
      },
      {
        name: 'Sample Packing', icon: FaBoxes, path: '#',
        children: [
          { name: 'Finished Goods', icon: MdSearch, path: '#' },
          { name: 'Finished goods product order', icon: FaBoxes, path: '#' },
          { name: 'Trims & Stores purchase order', icon: FaBoxes, path: '/inverntory/packeging-barcode/' },
        ],
      },
      {
        name: 'Make to order', icon: FaBoxes, path: '#',
        children: [
          { name: 'Finished Goods', icon: MdSearch, path: '#' },
          { name: 'Finished goods product order', icon: FaBoxes, path: '#' },
          { name: 'Trims & Stores purchase order', icon: FaBoxes, path: '/inverntory/packeging-barcode/' },
        ],
      },
      {
        name: 'Sales/Dispatch', icon: FaBoxes, path: '#',
        children: [
          { name: 'Sales Offline', icon: FaBoxes, path: '/inverntory/inventory-offline/' },
          { name: 'Sales Order Barcode', icon: FaBoxes, path: '/inverntory/salesorderbarcode' },
          { name: 'Packaging/Barcode', icon: FaBoxes, path: '/inverntory/packeging-barcode/' },
        ],
      },
      {
        name: 'Sampling & Production', icon: FaBoxes, path: '#',
        children: [
          { name: 'Buyer Enq', icon: MdSearch, path: '#' },
          { name: 'Sales Offline', icon: FaBoxes, path: '/inverntory/stock-enquiry-table' },
          { name: 'Packaging/Barcode', icon: FaBoxes, path: '/inverntory/packeging-barcode/' },
        ],
      },
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
  { name: 'Ticket', icon: TiTicket, path: '/tickets/ticket-dashboard' },
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
];

export const getAllMenuItemsWithPaths = (items = menuItems) => {
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
      result = result.concat(getAllMenuItemsWithPaths(item.children));
    }
  });
  
  return result;
};

// Helper function to get icon component from icon map
export const getIconComponent = (iconName) => {
  return iconMap[iconName] || null;
};