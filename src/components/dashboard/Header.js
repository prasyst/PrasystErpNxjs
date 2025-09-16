// src/components/Header.js
'use client';

import { useEffect, useState, useRef } from 'react';
import { useTheme } from '../../../src/app/context/ThemeContext';
import { IoIosSearch, IoIosPin } from "react-icons/io";
import { useRouter } from "next/navigation";
import { MdPushPin } from 'react-icons/md';
import { usePin } from '../../app/hooks/usePin';
import { getAllMenuItemsWithPaths, getIconComponent } from './menuData'; // Import from shared file
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

  // Get all searchable items from shared menu data
  const searchableItems = getAllMenuItemsWithPaths();

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

  // Handle search input change with auto-suggest
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
      setSearchResults(results.length > 0 ? searchableItems.slice(0, 10) : searchableItems.slice(0, 10));
      setShowSearchResults(true);
    }
  };

  // Handle search result click
  const handleSearchResultClick = (path) => {
    setSearchQuery('');
    setShowSearchResults(false);
    setIsSearchExpanded(false); // Collapse search after selection
    router.push(path);
  };

  // Handle search icon click
  const handleSearchIconClick = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      // Show all items when expanded
      setSearchResults(searchableItems.slice(0, 10)); // Show first 10 items
      setShowSearchResults(true);
      // Focus input after expansion animation
      setTimeout(() => {
        const input = searchRef.current?.querySelector('input');
        input?.focus();
      }, 300);
    } else {
      setShowSearchResults(false);
      setSearchQuery('');
    }
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

  return (
    <header 
      style={{
        backgroundColor: '#635bff',
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
        {/* Enhanced Search Bar with Auto-suggest */}
        <div 
          ref={searchRef}
          className="flex items-center"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '2rem',
            padding: '0.5rem',
            overflow: 'visible',
            border: isSearchExpanded ? '2px solid white' : '2px solid transparent',
            transition: 'all 0.3s ease-out',
            width: isSearchExpanded ? '300px' : '40px',
            position: 'relative',
          }}
        >
          <button 
            onClick={handleSearchIconClick}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '30px',
              height: '20px',
              transition: 'transform 0.3s ease',
              transform: isSearchExpanded ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            <IoIosSearch size={20} color="white" />
          </button>
          
          <input 
            type="text" 
            placeholder="Search modules..." 
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchQuery.length > 0 && setShowSearchResults(true)}
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'white',
              marginLeft: '0.5rem',
              width: isSearchExpanded ? '250px' : '0',
              padding: isSearchExpanded ? '0.25rem' : '0',
              opacity: isSearchExpanded ? 1 : 0,
              transition: 'all 0.3s ease-out',
              fontSize: '0.9rem',
            }}
            className="placeholder:text-white placeholder:text-opacity-70"
          />

          {/* Auto-suggest Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && isSearchExpanded && (
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
                      <span style={{ marginRight: '0.75rem', color: '#1b69e7' }}>
                        <IconComponent size={16} />
                      </span>
                    )}
                    <span style={{ fontSize: '0.9rem', color: '#333', fontWeight: '500' }}>
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* No results message */}
          {showSearchResults && searchResults.length === 0 && searchQuery.length > 0 && isSearchExpanded && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '0.5rem',
              marginTop: '0.5rem',
              padding: '1rem',
              textAlign: 'center',
              color: '#666',
              fontSize: '0.9rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 100,
            }}>
              No modules found for `{searchQuery}`
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 relative">
         {/* Pinned Modules Button */}
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
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              border: '2px solid rgba(255, 255, 255, 0.3)',
            }}
          >
             {getInitial(userName)}
          </div>

          <span style={{ color: 'white', fontWeight: '500' }}> {userName || 'User'}!</span>

          {isDropdownOpen && (
            <div 
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '0.5rem',
                padding: '0.5rem 0',
                width: '200px',
                zIndex: 100,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                marginTop: '0.5rem',
              }}
            >
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                <li style={{ 
                  padding: '0.75rem 1rem', 
                  color: '#333',
                  transition: 'background-color 0.2s',
                  cursor: 'pointer',
                }} 
                  className="hover:bg-gray-50"
                >
                  Profile
                </li>
                <li style={{ 
                  padding: '0.75rem 1rem', 
                  color: '#333',
                  transition: 'background-color 0.2s',
                  cursor: 'pointer',
                }} 
                  className="hover:bg-gray-50"
                >
                  Change Password
                </li>
                <li style={{ 
                  padding: '0.75rem 1rem', 
                  color: '#333',
                  transition: 'background-color 0.2s',
                  cursor: 'pointer',
                }} 
                onClick={handleLogout}
                  className="hover:bg-gray-50"
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

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