'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { RiSubtractLine } from "react-icons/ri";

import {
  MdDashboard, MdSearch, MdOutlineApartment, MdClose, MdMenu, MdChevronRight,
  MdDomain, MdMap, MdOutlineGroupWork, MdCategory, MdWarehouse, MdWork,
  MdAccountBox, MdEmojiPeople, MdAccessibility, MdLocalShipping, MdPeople,
  MdPersonAdd, MdClass, MdLocalOffer, MdStars, MdRateReview, MdBuild,
  MdLocalMall, MdCollectionsBookmark, MdStraighten, MdBrandingWatermark,
  MdReceipt, MdGavel, MdAssignment, MdAttachMoney, MdEvent, MdAnalytics,
  MdSettings, MdInventory, MdAccountBalance, MdPayments, MdSummarize,
  MdPushPin, MdOutlinePushPin, MdOutlineInventory, MdCalendarToday,
  MdSubdirectoryArrowRight, MdSupervisorAccount, MdAnchor, MdPercent, MdPayment, MdSettingsSuggest, MdHowToReg, MdRuleFolder,
  MdAssignmentTurnedIn,
  MdSupport, MdSupportAgent,
  MdAddTask,
} from 'react-icons/md';
import {
  RiFileList3Line, RiScissors2Line, RiLoopLeftLine, RiUserSharedLine, RiCheckboxBlankCircleLine,
  RiFileList2Line,
  RiToolsLine, RiShoppingBag3Line, RiShoppingBasket2Line,
  RiBarcodeLine, RiInboxArchiveLine, RiFileShield2Line,
  RiImageAddLine, RiDownload2Line, RiShareForwardLine, RiSettings4Line,
  RiPriceTag3Line, RiExchangeLine,
  RiStackLine, RiBriefcase2Line,
  RiSearchLine, RiPlayListAddLine,
  RiUserSearchLine, RiShoppingCart2Line,
  RiTaskLine, RiTruckLine,
  RiTimer2Line, RiBuilding4Line,
  RiDraftLine,
  RiCheckboxCircleLine,
  RiArchiveStackLine
} from 'react-icons/ri';

import { TiTicket } from "react-icons/ti";
import { FaBuilding, FaTruck, FaUserTag, FaHandshake, FaBalanceScale, FaBoxOpen, FaBoxes, FaUserTie, FaRupeeSign } from 'react-icons/fa';
import { FiUser } from 'react-icons/fi';
import { RiFileChartLine, RiAdminLine } from "react-icons/ri";
import { AiOutlineUsergroupAdd, AiOutlineNodeIndex } from 'react-icons/ai';
import { IoIosConstruct } from 'react-icons/io';
import { usePin } from '../../app/hooks/usePin';

const Sidebar = ({ isCollapsed, setIsCollapsed, isMobile, isOpen, onClose }) => {
  const sidebarRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState('');
  const [openSections, setOpenSections] = useState({});
  const { pinnedModules, pinModule, unpinModule, isPinned } = usePin();
  const [showPinConfirm, setShowPinConfirm] = useState(null);
  const [showUnpinConfirm, setShowUnpinConfirm] = useState(null);
  // Add this state at the top with your other useState
  const [hasOpenSubmenu, setHasOpenSubmenu] = useState(false);




  useEffect(() => {
    const protectedRoutes = [
      '/masterpage',
      '/inventorypage',
      '/tickets'
    ];

    const isProtected = protectedRoutes.some(route =>
      pathname.startsWith(route) || pathname.includes(route)
    );

    if (isProtected) {
      setIsCollapsed(false);
      setOpenSections(prev => ({
        ...prev,
        Masters: pathname.includes('masterpage'),
        Inventory: pathname === '/inventorypage'
      }));
      setHasOpenSubmenu(true);
    }
  }, [pathname]);
  // Add this function
  const toggleSection = (name) => {
    setOpenSections(prev => {
      const newState = { ...prev };

      if (newState[name]) {
        delete newState[name];
      } else {
        newState[name] = true;
      }

      // NEVER auto-close Masters or Inventory if we're on their pages
      const isOnMasters = pathname === '/masterpage';
      const isOnInventory = pathname === '/inventorypage';

      if (isOnMasters) newState['Masters'] = true;
      if (isOnInventory) newState['Inventory'] = true;

      setHasOpenSubmenu(Object.keys(newState).length > 0);
      return newState;
    });
  };


  useEffect(() => {
    // Auto-open "Masters" if current path starts with /masters
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/masterpage') {
        setOpenSections(prev => ({ ...prev, Masters: true }));
        setHasOpenSubmenu(true);
        setIsCollapsed(false); // force open
      }
    }
  }, []);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (isMobile && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
  //       onClose();
  //     }
  //   };

  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, [isMobile, onClose]);

  useEffect(() => {
    if (isMobile && !isOpen) {
    }
  }, [isMobile, isOpen]);

  const menuItems = [
    { name: 'Dashboard', icon: MdDashboard, path: '/dashboard' },
    {
      name: 'Masters',
      icon: MdOutlineApartment,
      path: '/masterpage?activeTab=company',
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
          path: '/masterpage?activeTab=vendors',
          children: [
            { name: 'Broker', icon: FaHandshake, path: '#' },
            { name: 'Transporter', icon: MdLocalShipping, path: '#' },
            { name: 'Creditors/Suppliers', icon: FaUserTag, path: '/masters/vendors' },
          ],
        },
        {
          name: 'Customers',
          icon: MdPeople,
          path: '/masterpage?activeTab=customers',
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
          path: '/masterpage?activeTab=process',
          // children: [
          //   { name: 'Broker', icon: FaHandshake, path: '#' },
          // ],
        },
        {
          name: 'Products',
          icon: FaBoxOpen,
          path: '/masterpage?activeTab=products',
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
            { name: 'Broker', icon: FaHandshake, path: '#' },
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
          name: 'Pay ment term',
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
        {
          name: 'Ticketing',
          icon: TiTicket,
          path: '/masterpage?activeTab=ticketing',
          children: [
            { name: 'Ticket Category', icon: MdCategory, path: '/masters/ticketing/ticketCategory' },
            { name: 'Ticket SubCategory', icon: MdSubdirectoryArrowRight, path: '/masters/ticketing/ticketSubCat' },
            { name: 'Service/Complaint', icon: MdSupport, path: '/masters/ticketing/serviceComplaint' },
            { name: 'Raise Service Ticket', icon: MdAddTask, path: '/masters/ticketing/raiseTicket' },
          ],
        },
      ],
    },

    {
      name: 'Inventory',
      icon: MdWarehouse,
      path: '/inventorypage',
      children: [
        { name: 'Artical/Style Master', icon: RiFileList3Line, path: '/inverntory/style/' },
        {
          name: 'Style/Parts Master',
          icon: RiToolsLine, // Parts/Tools
          path: '#'
        },
        {
          name: 'BarCode Printing',
          icon: RiBarcodeLine, // Barcode icon
          path: '#'
        },
        {
          name: 'Style Shade Image Upload',
          icon: RiImageAddLine, // Image upload
          path: '#'
        },
        {
          name: 'Price List Details',
          icon: RiPriceTag3Line, // Price tag
          path: '#',
          dividerAfter: true,
        },

        {
          name: 'Sampling & Development',
          icon: RiStackLine, // Boxes/stack to represent samples
          path: '#',
          children: [
            {
              name: 'Stock Enquiry',
              icon: RiSearchLine, // Search
              path: '#'
            },
            {
              name: 'Buyer Enquiry',
              icon: RiUserSearchLine, // Buyer search
              path: '#'
            },
            {
              name: 'Enquiry Follow-ups',
              icon: RiTaskLine, // Follow up / task progress
              path: '/inverntory/packeging-barcode/'
            },
            {
              name: 'Pending for Acceptance',
              icon: RiTimer2Line, // Pending / waiting
              path: '/inverntory/packeging-barcode/'
            },
            {
              name: 'Sampling Form',
              icon: RiDraftLine, // Form / draft
              path: '/inverntory/packeging-barcode/'
            },
            {
              name: 'Enquiry Status',
              icon: RiCheckboxCircleLine, // Status / check
              path: '/inverntory/packeging-barcode/'
            },
          ],
        },
        {
          name: 'Opening Stock', icon: MdInventory, path: '#',
          children: [
            {
              name: 'RM Stock',
              icon: RiArchiveStackLine,   // raw material stack
              path: '/inverntory/packeging-barcode/'
            },
            {
              name: 'Trims & Stores with Party',
              icon: RiScissors2Line,       // trims / cutting
              path: '#'
            },
            {
              name: 'Finished Good Stock',
              icon: RiCheckboxCircleLine,  // finished / approved
              path: '/inverntory/packeging-barcode/'
            },
            {
              name: 'Process Stock with Party',
              icon: RiLoopLeftLine,        // processing/looping
              path: '/inverntory/packeging-barcode/'
            },
            {
              name: 'RM Stock with Party',
              icon: RiUserSharedLine,      // shared with party/vendor
              path: '/inverntory/packeging-barcode/'
            },
          ],
        },
        {
          name: 'Purchase Order', icon: RiFileList2Line, path: '#',
          children: [
            { name: 'RM Purchase Order', icon: RiShoppingBag3Line, path: '/inverntory/packeging-barcode/' },
            { name: 'Finished goods product order', icon: RiCheckboxBlankCircleLine, path: '#' },
            { name: 'Trims & Stores purchase order', icon: RiScissors2Line, path: '/inverntory/packeging-barcode/' },
          ],
        },
        {
          name: 'Inward Approval', icon: RiInboxArchiveLine, path: '#',
          children: [
            { name: 'Finished Goods', icon: RiCheckboxCircleLine, path: '#' },
            { name: 'Finished goods product order', icon: RiShoppingBasket2Line, path: '#' },
            { name: 'Trims & Stores purchase order', icon: RiScissors2Line, path: '/inverntory/packeging-barcode/' },
          ],
        },
        {
          name: 'Provisonal GRN', icon: RiFileShield2Line, path: '#',
          children: [
            { name: 'Finished Goods', icon: RiCheckboxCircleLine, path: '#' },
            { name: 'Finished goods product order', icon: RiShoppingBasket2Line, path: '#' },
            { name: 'Trims & Stores purchase order', icon: RiScissors2Line, path: '/inverntory/packeging-barcode/' },
          ],
        },
        {
          name: 'Purchase Inward', icon: RiDownload2Line, path: '#',
          children: [
            { name: 'Finished Goods', icon: RiCheckboxCircleLine, path: '#' },
            { name: 'Finished goods product order', icon: RiShoppingBasket2Line, path: '#' },
            { name: 'Trims & Stores purchase order', icon: RiScissors2Line, path: '/inverntory/packeging-barcode/' },
          ],
        },
        {
          name: 'RM/Acc Issue',
          icon: RiShareForwardLine, // ✔ issuing / sending items outward
          path: '#',
          children: [
            { name: 'Finished Goods', icon: RiCheckboxCircleLine, path: '#' },
            { name: 'Finished goods product order', icon: RiShoppingBasket2Line, path: '#' },
            { name: 'Trims & Stores purchase order', icon: RiScissors2Line, path: '/inverntory/packeging-barcode/' },
          ],
        },
        {
          name: 'Manufacturing',
          icon: RiSettings4Line, // ✔ processing / operations
          path: '#',
          children: [
            { name: 'Finished Goods', icon: RiCheckboxCircleLine, path: '#' },
            { name: 'Finished goods product order', icon: RiShoppingBasket2Line, path: '#' },
            { name: 'Trims & Stores purchase order', icon: RiScissors2Line, path: '/inverntory/packeging-barcode/' },
          ],
        }
        ,
        {
          name: 'Other Transaction',
          icon: RiExchangeLine, // ✔ other transfers / transactions
          path: '#',
          children: [
            { name: 'Finished Goods', icon: RiCheckboxCircleLine, path: '#' },
            { name: 'Finished goods product order', icon: RiShoppingBasket2Line, path: '#' },
            { name: 'Trims & Stores purchase order', icon: RiScissors2Line, path: '/inverntory/packeging-barcode/' },
          ],
        }
        ,

        {
          name: 'Sample Packing',
          icon: RiBriefcase2Line, // ✔ packaging / sample case
          path: '#',
          children: [
            { name: 'Finished Goods', icon: RiCheckboxCircleLine, path: '#' },
            { name: 'Finished goods product order', icon: RiShoppingBasket2Line, path: '#' },
            { name: 'Trims & Stores purchase order', icon: RiScissors2Line, path: '/inverntory/packeging-barcode/' },
          ],
        }
        , {
          name: 'Make to Order',
          icon: RiPlayListAddLine, // ✔ custom order creation
          path: '#',
          children: [
            { name: 'Finished Goods', icon: RiCheckboxCircleLine, path: '#' },
            { name: 'Finished goods product order', icon: RiShoppingBasket2Line, path: '#' },
            { name: 'Trims & Stores purchase order', icon: RiScissors2Line, path: '/inverntory/packeging-barcode/' },
          ],
        },

        {
          name: 'Sales/Dispatch',
          icon: RiTruckLine, // ✔ delivery / dispatch
          path: '#',
          children: [
            { name: 'Sales Offline', icon: RiShoppingCart2Line, path: '/inverntory/inventory-offline/' }, // ✔ offline sales
            { name: 'Packaging/Barcode', icon: RiBarcodeLine, path: '/inverntory/packeging-barcode/' }, // ✔ barcode/packaging
          ],
        },
        {
          name: 'Sampling & Production',
          icon: RiBuilding4Line, // ✔ production / factory
          path: '#',
          children: [
            { name: 'Buyer Enq', icon: RiSearchLine, path: '#' }, // ✔ search/enquiry
            { name: 'Sales Offline', icon: RiShoppingCart2Line, path: '/inverntory/stock-enquiry-table' }, // ✔ offline sales
            { name: 'Packaging/Barcode', icon: RiBarcodeLine, path: '/inverntory/packeging-barcode/' }, // ✔ barcode/packaging
          ],
        },

        { name: 'Stock Adjustment', icon: RiSettings4Line, path: '#' },
        { name: 'Inventory Valuation', icon: RiPriceTag3Line, path: '#' },
      ],
    },

    {
      name: 'Accounts',
      icon: MdAccountBalance,
      path: '#',
      // path: '/accountspage',
      children: [
        { name: 'General Ledger', icon: MdAssignment, path: '/accountspage/general-ledger' },
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
          //  path: '/masterpage/',
          children: [
            { name: 'Category', icon: MdCategory, path: '/masters/ticketing/ticketCategory/' },
            { name: 'SubCategory', icon: MdSubdirectoryArrowRight, path: '/masters/ticketing/ticketSubCat/' },
            { name: 'Service/Complaint', icon: MdSupportAgent, path: '/masters/ticketing/serviceComplaint/' },
          ],
        },
        { name: 'Raise Ticket', icon: MdPayments, path: '/tickets/create-tickets/' },
      ],
    },
    // { name: 'Ticket', icon: TiTicket, path: '/tickets/ticket-dashboard' },
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
      name: 'Help',
      icon: IoIosConstruct,
      children: [
        { name: 'User Info', icon: MdPeople, path: '#' },
        { name: 'Customer Care', icon: MdPayments, path: '#' },
        // { name: 'Cascade', icon: MdEvent, path: '#' },
        // { name: 'Tile Horizontal', icon: MdSummarize, path: '#' },
        // { name: 'Tile Vertical', icon: MdPayments, path: '#' },
        { name: 'Barcode History', icon: MdEvent, path: '#' },
        { name: 'Query Help', icon: MdSummarize, path: '#' },
        { name: 'Close All Windows', icon: MdEvent, path: '#' },
        { name: ' Help', icon: MdSummarize, path: '#' },
      ],
    },

  ];



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
  const handleNavigation = (path) => {
    if (path && path !== '#') {
      router.push(path);
      if (isMobile) {
        onClose();
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

  const renderMainMenu = (items) => {
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
              if (hasValidPath) handleNavigation(item.path);
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

                  return (
                    <div key={child.name}>
                      {/* Clickable group header (Company, Vendors, Products, …) */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();

                          // Use the path if it exists (like Ticketing, Location, Vendors)
                          if (child.path && child.path !== '#') {
                            router.push(child.path);
                          } else {
                            // Fallback to tab mapping
                            const tabIdMap = {
                              Company: 'company',
                              Location: 'location',
                              Vendors: 'vendors',
                              Ticketing: 'ticketing',
                              // add others as needed
                            };
                            const tabId = tabIdMap[child.name] || 'company';
                            router.push(`/masterpage?activeTab=${tabId}`);
                          }

                          toggleSection(child.name);
                          if (isMobile) onClose();
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0.5rem 0.2rem',
                          cursor: 'pointer',
                          borderRadius: '6px',
                          margin: '2px 0',
                          backgroundColor: childIsOpen ? '#f0f2ff' : 'transparent',
                          color: childIsOpen ? '#635bff' : '#444',
                          fontWeight: childIsOpen ? 600 : 500,
                        }}
                      >
                        {ChildIcon && <ChildIcon size={18} style={{ marginRight: '5px' }} />}
                        {/* <span style={{ flex: 1, fontSize: '0.9rem' }}>{child.name}</span> */}
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

                      {/* Grandchildren (only shown when this group is open) */}
                      {hasGrandChildren && childIsOpen && (
                        <div style={{ marginLeft: '20px', paddingLeft: '8px' }}>
                          {child.children.map((grandchild) => {
                            const GrandIcon = grandchild.icon;
                            const isGrandActive = activeItem === grandchild.path;
                            const hasPath = grandchild.path && grandchild.path !== '#';
                            // // Decide where we should navigate
                            return (
                              <div
                                key={grandchild.name}
                                onClick={(e) => {
                                  e.stopPropagation();

                                  const hasPath = grandchild.path && grandchild.path !== '#';

                                  // Case 1: Grandchild has real path → go directly
                                  if (hasPath && grandchild.path.startsWith('/masters/')) {
                                    router.push(grandchild.path);
                                  }
                                  // Case 2: Grandchild has no real path OR is a tab opener → use parent tab logic
                                  else {
                                    const tabIdMap = {
                                      Company: 'company',
                                      Location: 'location',
                                      Vendors: 'vendors',
                                      Customers: 'customers',
                                      Products: 'products',
                                      'Tax/Terms': 'tax',
                                      Season: 'season',
                                      Ticketing: 'ticketing',
                                      'GST/SAC Code': 'gst',
                                      'Other Misc': 'other',
                                      'TDS Master': 'tds',
                                      'QC Master': 'qc',
                                      Process: 'process',
                                    };

                                    const tabId = tabIdMap[child.name] || 'company';
                                    router.push(`/masterpage?activeTab=${tabId}`);
                                  }

                                  // Always keep sidebar state correct
                                  toggleSection('Masters');
                                  toggleSection(child.name);
                                  if (isMobile) onClose();
                                }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  padding: '0.35rem 0.1rem',
                                  cursor: hasPath ? 'pointer' : 'default',
                                  backgroundColor: isGrandActive ? '#635bff' : 'transparent',
                                  color: isGrandActive ? 'white' : '#333',
                                  borderRadius: '6px',
                                  margin: '1px 1px',
                                  fontSize: '0.85rem',
                                }}
                              >
                                {GrandIcon && (
                                  <GrandIcon
                                    size={16}
                                    style={{ marginRight: '2px', color: isGrandActive ? 'white' : '#635bff' }}
                                  />
                                )}
                                {/* <span>{grandchild.name}</span> */}
                                <span style={{ display: grandchild.hideName ? 'none' : 'inline' }}>
                                  {grandchild.name}
                                </span>

                                {/* Pin icon for leaf nodes */}
                                {hasPath && (
                                  <div
                                    onClick={(e) => handlePinClick(grandchild, e)}
                                    style={{ marginLeft: 'auto', color: isPinned(grandchild.path) ? '#635bff' : '#aaa' }}
                                  >
                                    {isPinned(grandchild.path) ? <MdPushPin size={15} /> : <MdOutlinePushPin size={15} />}
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
  };

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
            // ONLY collapse if we're NOT on masters routes
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
          <button
            onClick={() => {
              if (isMobile) {
                onClose();
              } else {
                // Only allow manual collapse if NOT on masters routes
                // const isMastersRoute = pathname === '/masterpage';
                // if (!isMastersRoute) {
                //   setIsCollapsed(!isCollapsed);
                setIsCollapsed(true);
                setOpenSections({});
                setHasOpenSubmenu(false);

              }
            }}
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
              marginLeft: (!isCollapsed || isMobile) ? 'auto' : 0,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {isMobile ? (
              <MdClose size={22} color={'#635bff'} />
            ) : isCollapsed ? (
              <MdMenu color={'#635bff'} size={22} />
            ) : (
              <MdClose size={22} />
            )}
          </button>
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