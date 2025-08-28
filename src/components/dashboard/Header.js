// src/components/Header.js
'use client';

import { useEffect, useState, useRef } from 'react';
import { useTheme } from '../../../src/app/context/ThemeContext';
import { IoIosSearch, IoIosPin } from "react-icons/io";
import { useRouter } from "next/navigation";
import {
  MdDashboard, MdSearch, MdOutlineApartment, MdClose, MdMenu, MdChevronRight,
  MdDomain, MdMap, MdOutlineGroupWork, MdCategory, MdWarehouse, MdWork,
  MdAccountBox, MdEmojiPeople, MdAccessibility, MdLocalShipping, MdPeople,
  MdPersonAdd, MdClass, MdLocalOffer, MdStars, MdRateReview, MdBuild,
  MdLocalMall, MdCollectionsBookmark, MdStraighten, MdBrandingWatermark,
  MdReceipt, MdGavel, MdAssignment, MdAttachMoney, MdEvent, MdAnalytics,
  MdSettings, MdInventory, MdAccountBalance, MdPayments, MdSummarize,
  MdPushPin, MdOutlinePushPin
} from 'react-icons/md';

import { FaBuilding, FaTruck, FaUserTag, FaHandshake, FaBalanceScale, FaBoxOpen, FaBoxes, FaUserTie } from 'react-icons/fa';
import { FiUser } from 'react-icons/fi';
import { AiOutlineUsergroupAdd, AiOutlineNodeIndex } from 'react-icons/ai';
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
import Link from 'next/link';

const Header = ({ isSidebarCollapsed }) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPinnedMenuOpen, setIsPinnedMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);
  const { pinnedModules, unpinModule } = usePin();
  const [showUnpinConfirm, setShowUnpinConfirm] = useState(null);

  useEffect(() => {
    const storedName = localStorage.getItem('USER_NAME');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Function to find all menu items with valid paths
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

  // Sample menu items (you should import your actual menu structure)
  const menuItems = [
    // ... your menu items structure
  ];

  // Get all searchable items
  const searchableItems = findAllItemsWithPaths(menuItems);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 0) {
      const results = searchableItems.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // Handle search result click
  const handleSearchResultClick = (path) => {
    setSearchQuery('');
    setShowSearchResults(false);
    router.push(path);
  };

  const getInitial = (name) => name?.charAt(0)?.toUpperCase() || '?';

  const handleLogout = () => {
    localStorage.removeItem('authenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('CO_ID');
    localStorage.removeItem('COBR_ID');
    localStorage.removeItem('PARTY_NAME');
    localStorage.removeItem('PARTY_KEY');
    localStorage.removeItem('FCYR_KEY');
    router.push("/login");
  };

  // Handle unpin confirmation
  const confirmUnpin = (module) => {
    unpinModule(module);
    setShowUnpinConfirm(null);
  };

  const getIconComponent = (iconName) => {
    return iconMap[iconName] || null;
  };

return (
    <header 
      style={{
        backgroundColor: '#1b69e7ff',
        padding: '0.5rem',
        position: 'fixed',
        top: 0,
        right: 0,
        left: isSidebarCollapsed ? '80px' : '250px',
        zIndex: 50,
        borderBottom: '1px solid var(--border-color)',
        transition: 'left 0.3s ease',
      }}
      className="flex items-center justify-between"
    >
      
      <div className="flex items-center gap-4">
       

        {/* Search Bar */}
        <div 
          ref={searchRef}
          className="flex items-center"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderRadius: '2rem',
            padding: '0.5rem',
            overflow: 'hidden',
            border: isSearchExpanded ? '1px solid var(--primary)' : 'none',
            transition: 'all 0.3s ease-out',
            width: isSearchExpanded ? '250px' : '40px',
            position: 'relative',
          }}
        >
          <button 
            onClick={() => setIsSearchExpanded(!isSearchExpanded)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '30px',
              height: '20px',
              transition: 'transform 0.3s ease',
              transform: isSearchExpanded ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            <IoIosSearch size={20} color="var(--text-color)"  />
          </button>
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchQuery.length > 0 && setShowSearchResults(true)}
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'var(--text-color)',
              marginLeft: '0.5rem',
              width: isSearchExpanded ? '200px' : '0',
              padding: isSearchExpanded ? '0.25rem' : '0',
              opacity: isSearchExpanded ? 1 : 0,
              transition: 'all 0.3s ease-out',
            }}
          />

          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '0.5rem',
              marginTop: '0.5rem',
              maxHeight: '300px',
              overflowY: 'auto',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 100,
            }}>
              {searchResults.map((item, index) => {
                const IconComponent = getIconComponent(item.icon);
                
                return (
                  <div
                    key={index}
                    onClick={() => handleSearchResultClick(item.path)}
                    style={{
                      padding: '0.75rem 1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      borderBottom: index < searchResults.length - 1 ? '1px solid #f0f0f0' : 'none',
                      transition: 'background-color 0.2s',
                    }}
                    className="hover:bg-gray-50"
                  >
                    {IconComponent && (
                      <span style={{ marginRight: '0.75rem', color: '#666' }}>
                        <IconComponent size={16} />
                      </span>
                    )}
                    <span style={{ fontSize: '0.9rem' }}>{item.name}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 relative">
         {/* Pinned Modules Button */}
        {/* {pinnedModules.length > 0 && ( */}
          <Link href="/pinned-modules" passHref>
            <button 
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                transition: 'background-color 0.2s',
              }}
              className="hover:bg-white hover:bg-opacity-10"
              title="View pinned modules"
            >
              <MdPushPin size={30} />
            </button>
          </Link>
        {/* )} */}
        {/* User Dropdown */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            position: 'relative',
          }}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div 
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
             {getInitial(userName)}
          </div>

          <span style={{ color: 'white' }}> {userName || 'User'}!</span>

          {isDropdownOpen && (
            <div 
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '0.5rem',
                padding: '0.5rem 0',
                width: '200px',
                zIndex: 100,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              <ul style={{ listStyle: 'none' }}>
                <li style={{ 
                  padding: '0.5rem 1rem', 
                  color: 'var(--text-color)',
                  transition: 'background-color 0.2s',
                }} 
                  className="hover:bg-opacity-10 hover:bg-white"
                >
                  Profile
                </li>
                <li style={{ 
                  padding: '0.5rem 1rem', 
                  color: 'var(--text-color)',
                  transition: 'background-color 0.2s',
                }} 
                  className="hover:bg-opacity-10 hover:bg-white"
                >
                  Change Password
                </li>
                <li style={{ 
                  padding: '0.5rem 1rem', 
                  color: 'var(--text-color)',
                  transition: 'background-color 0.2s',
                }} 
                onClick={handleLogout}
                  className="hover:bg-opacity-10 hover:bg-white"
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Pinned Modules Menu */}
      {isPinnedMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '1rem',
          backgroundColor: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '0.5rem',
          padding: '1rem',
          width: '300px',
          zIndex: 100,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center' }}>
            <IoIosPin style={{ marginRight: '0.5rem' }} />
            Pinned Modules
          </h3>
          
          {pinnedModules.length === 0 ? (
            <p style={{ margin: 0, color: '#666', textAlign: 'center' }}>No pinned modules yet</p>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
              gap: '0.75rem' 
            }}>
              {pinnedModules.map((module, index) => {
                const IconComponent = getIconComponent(module.icon);
                
                return (
                  <div
                    key={index}
                    style={{
                      padding: '0.75rem',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '0.5rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 0.2s',
                    }}
                    className="hover:shadow-md"
                    onClick={() => router.push(module.path)}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowUnpinConfirm(module);
                      }}
                      style={{
                        position: 'absolute',
                        top: '0.25rem',
                        right: '0.25rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#999',
                        fontSize: '0.75rem',
                      }}
                      className="hover:text-red-500"
                    >
                      ×
                    </button>
                    
                    {IconComponent && (
                      <div style={{ marginBottom: '0.5rem', color: '#1b69e7' }}>
                        <IconComponent size={24} />
                      </div>
                    )}
                    
                    <div style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: '500',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {module.name}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
    </header>
  );
};

export default Header;