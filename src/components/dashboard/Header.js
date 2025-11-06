// // src/components/Header.js
// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import { useTheme } from '../../../src/app/context/ThemeContext';
// import { IoIosSearch, IoIosPin } from "react-icons/io";
// import { useRouter } from "next/navigation";
// import { MdPushPin } from 'react-icons/md';
// import { usePin } from '../../app/hooks/usePin';
// import { getAllMenuItemsWithPaths, getIconComponent } from './menuData'; // Import from shared file
// import Link from 'next/link';

// const Header = ({ isSidebarCollapsed }) => {
//   const [isSearchExpanded, setIsSearchExpanded] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isPinnedMenuOpen, setIsPinnedMenuOpen] = useState(false);
//   const { theme, toggleTheme } = useTheme();
//   const router = useRouter();
//   const [userName, setUserName] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [showSearchResults, setShowSearchResults] = useState(false);
//   const searchRef = useRef(null);
//   const { pinnedModules, unpinModule } = usePin();
//   const [showUnpinConfirm, setShowUnpinConfirm] = useState(null);

//   // Get all searchable items from shared menu data
//   const searchableItems = getAllMenuItemsWithPaths();

//   useEffect(() => {
//     const storedName = localStorage.getItem('USER_NAME');
//     if (storedName) {
//       setUserName(storedName);
//     }
//   }, []);

//   // Close search results when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         setShowSearchResults(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   // Handle search input change with auto-suggest
//   const handleSearchChange = (e) => {
//     const query = e.target.value;
//     setSearchQuery(query);
    
//     if (query.length > 0) {
//       const results = searchableItems.filter(item => 
//         item.name.toLowerCase().includes(query.toLowerCase())
//       );
//       setSearchResults(results);
//       setShowSearchResults(true);
//     } else {
//       setSearchResults(results.length > 0 ? searchableItems.slice(0, 10) : searchableItems.slice(0, 10));
//       setShowSearchResults(true);
//     }
//   };

//   // Handle search result click
//   const handleSearchResultClick = (path) => {
//     setSearchQuery('');
//     setShowSearchResults(false);
//     setIsSearchExpanded(false); // Collapse search after selection
//     router.push(path);
//   };

//   // Handle search icon click
//   const handleSearchIconClick = () => {
//     setIsSearchExpanded(!isSearchExpanded);
//     if (!isSearchExpanded) {
//       // Show all items when expanded
//       setSearchResults(searchableItems.slice(0, 10)); // Show first 10 items
//       setShowSearchResults(true);
//       // Focus input after expansion animation
//       setTimeout(() => {
//         const input = searchRef.current?.querySelector('input');
//         input?.focus();
//       }, 300);
//     } else {
//       setShowSearchResults(false);
//       setSearchQuery('');
//     }
//   };

//   const getInitial = (name) => name?.charAt(0)?.toUpperCase() || '?';

//   const handleLogout = () => {
//     localStorage.removeItem('authenticated');
//     localStorage.removeItem('userRole');
//     localStorage.removeItem('CO_ID');
//     localStorage.removeItem('COBR_ID');
//     localStorage.removeItem('PARTY_NAME');
//     localStorage.removeItem('PARTY_KEY');
//     localStorage.removeItem('FCYR_KEY');
//     router.push("/login");
//   };

//   // Handle unpin confirmation
//   const confirmUnpin = (module) => {
//     unpinModule(module);
//     setShowUnpinConfirm(null);
//   };

//   return (
//     <header 
//       style={{
//         backgroundColor: '#635bff',
//         padding: '0.2rem',
//         position: 'fixed',
//         top: 0,
//         right: 0,
//         left: isSidebarCollapsed ? '80px' : '250px',
//         zIndex: 50,
//         borderBottom: '1px solid var(--border-color)',
//         transition: 'left 0.3s ease',
//       }}
//       className="flex items-center justify-between"
//     >
      
//       <div className="flex items-center gap-4">
//         {/* Enhanced Search Bar with Auto-suggest */}
//         <div 
//           ref={searchRef}
//           className="flex items-center"
//           style={{
//             backgroundColor: 'rgba(255, 255, 255, 0.15)',
//             borderRadius: '2rem',
//             padding: '0.5rem',
//             overflow: 'visible',
//             border: isSearchExpanded ? '2px solid white' : '2px solid transparent',
//             transition: 'all 0.3s ease-out',
//             width: isSearchExpanded ? '300px' : '40px',
//             position: 'relative',
//           }}
//         >
//           <button 
//             onClick={handleSearchIconClick}
//             style={{
//               background: 'none',
//               border: 'none',
//               cursor: 'pointer',
//               color: 'white',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               minWidth: '30px',
//               height: '20px',
//               transition: 'transform 0.3s ease',
//               transform: isSearchExpanded ? 'scale(1.1)' : 'scale(1)',
//             }}
//           >
//             <IoIosSearch size={20} color="white" />
//           </button>
          
//           <input 
//             type="text" 
//             placeholder="Search modules..." 
//             value={searchQuery}
//             onChange={handleSearchChange}
//             onFocus={() => searchQuery.length > 0 && setShowSearchResults(true)}
//             style={{
//               background: 'none',
//               border: 'none',
//               outline: 'none',
//               color: 'white',
//               marginLeft: '0.5rem',
//               width: isSearchExpanded ? '250px' : '0',
//               padding: isSearchExpanded ? '0.25rem' : '0',
//               opacity: isSearchExpanded ? 1 : 0,
//               transition: 'all 0.3s ease-out',
//               fontSize: '0.9rem',
//             }}
//             className="placeholder:text-white placeholder:text-opacity-70"
//           />

//           {/* Auto-suggest Search Results Dropdown */}
//           {showSearchResults && searchResults.length > 0 && isSearchExpanded && (
//             <div style={{
//               position: 'absolute',
//               top: '100%',
//               left: 0,
//               right: 0,
//               backgroundColor: 'white',
//               border: '1px solid #e0e0e0',
//               borderRadius: '0.5rem',
//               marginTop: '0.5rem',
//               maxHeight: '300px',
//               overflowY: 'auto',
//               boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
//               zIndex: 100,
//             }}>
//               {searchResults.map((item, index) => {
//                 const IconComponent = getIconComponent(item.icon);
                
//                 return (
//                   <div
//                     key={index}
//                     onClick={() => handleSearchResultClick(item.path)}
//                     style={{
//                       padding: '0.75rem 1rem',
//                       cursor: 'pointer',
//                       display: 'flex',
//                       alignItems: 'center',
//                       borderBottom: index < searchResults.length - 1 ? '1px solid #f0f0f0' : 'none',
//                       transition: 'background-color 0.2s',
//                     }}
//                     className="hover:bg-gray-50"
//                   >
//                     {IconComponent && (
//                       <span style={{ marginRight: '0.75rem', color: '#1b69e7' }}>
//                         <IconComponent size={16} />
//                       </span>
//                     )}
//                     <span style={{ fontSize: '0.9rem', color: '#333', fontWeight: '500' }}>
//                       {item.name}
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>
//           )}

//           {/* No results message */}
//           {showSearchResults && searchResults.length === 0 && searchQuery.length > 0 && isSearchExpanded && (
//             <div style={{
//               position: 'absolute',
//               top: '100%',
//               left: 0,
//               right: 0,
//               backgroundColor: 'white',
//               border: '1px solid #e0e0e0',
//               borderRadius: '0.5rem',
//               marginTop: '0.5rem',
//               padding: '1rem',
//               textAlign: 'center',
//               color: '#666',
//               fontSize: '0.9rem',
//               boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
//               zIndex: 100,
//             }}>
//               No modules found for `{searchQuery}`
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="flex items-center gap-4 relative">
//          {/* Pinned Modules Button */}
//           <Link href="/pinned-modules" passHref>
//             <button 
//               style={{
//                 background: 'none',
//                 border: 'none',
//                 cursor: 'pointer',
//                 color: 'white',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: '40px',
//                 height: '40px',
//                 borderRadius: '50%',
//                 transition: 'background-color 0.2s',
//               }}
//               className="hover:bg-white hover:bg-opacity-10"
//               title="View pinned modules"
//             >
//               <MdPushPin size={30} />
//             </button>
//           </Link>
          
//         {/* User Dropdown */}
//         <div 
//           style={{
//             display: 'flex',
//             alignItems: 'center',
//             gap: '0.5rem',
//             cursor: 'pointer',
//             position: 'relative',
//           }}
//           onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//         >
//           <div 
//             style={{
//               width: '40px',
//               height: '40px',
//               borderRadius: '50%',
//               backgroundColor: 'rgba(255, 255, 255, 0.2)',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               color: 'white',
//               fontWeight: 'bold',
//               border: '2px solid rgba(255, 255, 255, 0.3)',
//             }}
//           >
//              {getInitial(userName)}
//           </div>

//           <span style={{ color: 'white', fontWeight: '500' }}> {userName || 'User'}!</span>

//           {isDropdownOpen && (
//             <div 
//               style={{
//                 position: 'absolute',
//                 top: '100%',
//                 right: 0,
//                 backgroundColor: 'white',
//                 border: '1px solid #e0e0e0',
//                 borderRadius: '0.5rem',
//                 padding: '0.5rem 0',
//                 width: '200px',
//                 zIndex: 100,
//                 boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
//                 marginTop: '0.5rem',
//               }}
//             >
//               <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
//                 <li style={{ 
//                   padding: '0.75rem 1rem', 
//                   color: '#333',
//                   transition: 'background-color 0.2s',
//                   cursor: 'pointer',
//                 }} 
//                   className="hover:bg-gray-50"
//                 >
//                   Profile
//                 </li>
//                 <li style={{ 
//                   padding: '0.75rem 1rem', 
//                   color: '#333',
//                   transition: 'background-color 0.2s',
//                   cursor: 'pointer',
//                 }} 
//                   className="hover:bg-gray-50"
//                 >
//                   Change Password
//                 </li>
//                 <li style={{ 
//                   padding: '0.75rem 1rem', 
//                   color: '#333',
//                   transition: 'background-color 0.2s',
//                   cursor: 'pointer',
//                 }} 
//                 onClick={handleLogout}
//                   className="hover:bg-gray-50"
//                 >
//                   Logout
//                 </li>
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Unpin Confirmation Modal */}
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
//             <p>Are you sure you want to unpin `${showUnpinConfirm.name}` from your quick access?</p>
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
//     </header>
//   );
// };

// export default Header;



// src/components/Header.js
'use client';

import { useEffect, useState, useRef } from 'react';
import { useTheme } from '../../../src/app/context/ThemeContext';
import { IoIosSearch, IoIosPin } from "react-icons/io";
import { useRouter } from "next/navigation";
import { MdPushPin, MdMenu, MdClose, MdNotifications, MdSettings, MdHelp } from 'react-icons/md';
import { usePin } from '../../app/hooks/usePin';
import { getAllMenuItemsWithPaths, getIconComponent } from './menuData';
import Link from 'next/link';
import ReportIcon from '@mui/icons-material/Report';
import axiosInstance from '@/lib/axios'; // Import axios instance

const Header = ({ isSidebarCollapsed, onMenuToggle, isMobile }) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [companyName, setCompanyName] = useState(''); // New state for company name
  const [branchName, setBranchName] = useState(''); // New state for branch name
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const settingsRef = useRef(null);
  const { pinnedModules, unpinModule } = usePin();
  const [showUnpinConfirm, setShowUnpinConfirm] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New ticket assigned to you', time: '5 min ago', read: false, type: 'ticket' },
    { id: 2, text: 'Inventory stock running low', time: '1 hour ago', read: false, type: 'inventory' },
    { id: 3, text: 'Monthly report is ready', time: '2 hours ago', read: true, type: 'report' }
  ]);

  const searchableItems = getAllMenuItemsWithPaths();

  useEffect(() => {
    const storedName = localStorage.getItem('USER_NAME');
    const storedRole = localStorage.getItem('userRole');
    if (storedName) {
      setUserName(storedName);
    }
    if (storedRole) {
      setUserRole(storedRole);
    }
    
    // Fetch company and branch names
    fetchCompanyAndBranchNames();
  }, []);

  // Function to fetch company and branch names
  const fetchCompanyAndBranchNames = async () => {
    try {
      const coId = localStorage.getItem('CO_ID');
      const cobrId = localStorage.getItem('COBR_ID');

      if (coId && cobrId) {
        // Fetch company name
        const companyResponse = await axiosInstance.post('COMPANY/Getdrpcofill', {
          CO_ID: "",
          Flag: ""
        });

        if (companyResponse.data?.STATUS === 0 && Array.isArray(companyResponse.data.DATA)) {
          const company = companyResponse.data.DATA.find(c => c.CO_ID === coId);
          if (company) {
            setCompanyName(company.CO_NAME);
          }
        }

        // Fetch branch name
        const branchResponse = await axiosInstance.post('COMPANY/Getdrpcobrfill', {
          COBR_ID: "",
          CO_ID: coId,
          Flag: ""
        });

        if (branchResponse.data?.STATUS === 0 && Array.isArray(branchResponse.data.DATA)) {
          const branch = branchResponse.data.DATA.find(b => b.COBR_ID === cobrId);
          if (branch) {
            setBranchName(branch.COBR_NAME);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching company/branch names:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
      
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsQuickSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
      setSearchResults(searchableItems.slice(0, 8));
      setShowSearchResults(true);
    }
  };

  // Handle search result click
  const handleSearchResultClick = (path) => {
    setSearchQuery('');
    setShowSearchResults(false);
    setIsSearchExpanded(false);
    router.push(path);
  };

  const handleSearchIconClick = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setSearchResults(searchableItems.slice(0, 8));
      setShowSearchResults(true);
      setTimeout(() => {
        const input = searchRef.current?.querySelector('input');
        input?.focus();
      }, 300);
    } else {
      setShowSearchResults(false);
      setSearchQuery('');
    }
  };

  const getInitial = (name) => name?.charAt(0)?.toUpperCase() || 'U';

  const handleLogout = () => {
    localStorage.removeItem('authenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('CO_ID');
    localStorage.removeItem('COBR_ID');
    localStorage.removeItem('PARTY_NAME');
    localStorage.removeItem('PARTY_KEY');
    localStorage.removeItem('FCYR_KEY');
    localStorage.removeItem('USER_NAME');
    router.push("/login");
  };

  const handleProfile = () => {
    router.push("/profile");
    setIsDropdownOpen(false);
  };

  const handleChangePassword = () => {
    router.push("/change-password");
    setIsDropdownOpen(false);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setIsNotificationsOpen(false);
  };

  const getUnreadNotificationCount = () => {
    return notifications.filter(notif => !notif.read).length;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ticket': return '🎫';
      case 'inventory': return '📦';
      case 'report': return '📊';
      default: return '🔔';
    }
  };

  return (
    <header 
      style={{
        backgroundColor: '#635bff',
        padding: isMobile ? '0.2rem 0.8rem' : '0.2rem 1.5rem',
        position: 'fixed',
        top: 0,
        right: 0,
        left: isMobile ? '0' : (isSidebarCollapsed ? '80px' : '250px'),
        zIndex: 50,
        borderBottom: '1px solid #e0e0e0',
        transition: 'left 0.3s ease, padding 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}
    >

      <div className="flex items-center gap-3 md:gap-4">
        {isMobile && (
          <button 
            onClick={onMenuToggle}
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
              transition: 'background-color 0.2s ease',
            }}
            className="hover:bg-white hover:bg-opacity-10 active:bg-opacity-20"
            aria-label="Toggle menu"
          >
            <MdMenu size={24} />
          </button>
        )}

        <div 
          ref={searchRef}
          className="flex items-center relative"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '2rem',
            padding: '0.5rem',
            overflow: 'visible',
            border: isSearchExpanded ? '2px solid rgba(255, 255, 255, 0.8)' : '2px solid transparent',
            transition: 'all 0.3s ease-out',
            width: isSearchExpanded ? (isMobile ? '200px' : '320px') : '40px',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
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
              minWidth: '30px',
              height: '20px',
              transition: 'transform 0.3s ease',
              transform: isSearchExpanded ? 'scale(1.1)' : 'scale(1)',
            }}
            aria-label={isSearchExpanded ? "Collapse search" : "Expand search"}
          >
            <IoIosSearch size={20} />
          </button>
          
          <input 
            type="text" 
            placeholder="Search modules, features..." 
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setShowSearchResults(true)}
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'white',
              marginLeft: '0.5rem',
              width: isSearchExpanded ? '100%' : '0',
              padding: isSearchExpanded ? '0.25rem 0' : '0',
              opacity: isSearchExpanded ? 1 : 0,
              transition: 'all 0.3s ease-out',
              fontSize: '0.9rem',
              lineHeight: '1.2',
            }}
            className="placeholder:text-white placeholder:text-opacity-80"
          />

          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && isSearchExpanded && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              marginTop: '0.75rem',
              maxHeight: '400px',
              overflowY: 'auto',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              zIndex: 1000,
            }}>
              <div style={{
                padding: '0.75rem 1rem',
                borderBottom: '1px solid #f0f0f0',
                fontSize: '0.8rem',
                fontWeight: '600',
                color: '#666',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Quick Navigation
              </div>
              {searchResults.map((item, index) => {
                const IconComponent = getIconComponent(item.icon);
                
                return (
                  <div
                    key={index}
                    onClick={() => handleSearchResultClick(item.path)}
                    style={{
                      padding: '0.875rem 1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      borderBottom: index < searchResults.length - 1 ? '1px solid #f8f8f8' : 'none',
                      transition: 'background-color 0.2s ease',
                      backgroundColor: '#fff',
                    }}
                    className="hover:bg-gray-50 active:bg-gray-100"
                  >
                    {IconComponent && (
                      <span style={{ 
                        marginRight: '0.875rem', 
                        color: '#635bff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '20px',
                      }}>
                        <IconComponent size={16} />
                      </span>
                    )}
                    <span style={{ 
                      fontSize: '0.9rem', 
                      color: '#333', 
                      fontWeight: '500',
                      flex: 1,
                    }}>
                      {item.name}
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      color: '#999',
                      backgroundColor: '#f5f5f5',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                    }}>
                      Module
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {showSearchResults && searchResults.length === 0 && searchQuery.length > 0 && isSearchExpanded && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              marginTop: '0.75rem',
              padding: '2rem 1rem',
              textAlign: 'center',
              color: '#666',
              fontSize: '0.9rem',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              zIndex: 1000,
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔍</div>
              No results found for {searchQuery}
              <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>
                Try different keywords
              </div>
            </div>
          )}
        </div>

        {/* Company and Branch Name Display */}
        {!isMobile && (companyName || branchName) && (
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              marginLeft: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              maxWidth: '300px',
            }}
          >
            
            {branchName && (
              <span 
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '1rem',
                  lineHeight: '1.2',
                  marginTop: '0.1rem',
                  whiteSpace: 'nowrap',
                  fontWeight: '600',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100%',
                }}
                title={branchName}
              >
                {branchName}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {!isMobile && (
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
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
              className="hover:bg-white hover:bg-opacity-10 active:bg-opacity-20"
              title="Pinned Modules"
            >
              <MdPushPin size={20} />
            </button>
          </Link>
        )}
        {!isMobile && (
          <Link href="/analytics" passHref>
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
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
              className="hover:bg-white hover:bg-opacity-10 active:bg-opacity-20"
              title="Analytics"
            >
              <ReportIcon size={20} />
            </button>
          </Link>
        )}

        <div ref={notificationsRef} style={{ position: 'relative' }}>
          <button 
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsQuickSettingsOpen(false);
              setIsDropdownOpen(false);
            }}
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
              transition: 'all 0.2s ease',
              position: 'relative',
            }}
            className="hover:bg-white hover:bg-opacity-10 active:bg-opacity-20"
            aria-label="Notifications"
          >
            <MdNotifications size={20} />
            {getUnreadNotificationCount() > 0 && (
              <span style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                backgroundColor: '#ff4757',
                color: 'white',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #635bff',
              }}>
                {getUnreadNotificationCount()}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              width: '320px',
              maxHeight: '400px',
              zIndex: 1000,
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              marginTop: '0.5rem',
            }}>
              <div style={{
                padding: '1rem',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ fontWeight: '600', color: '#333' }}>Notifications</span>
                {notifications.length > 0 && (
                  <button 
                    onClick={clearAllNotifications}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#635bff',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      fontWeight: '500',
                    }}
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      style={{
                        padding: '0.875rem 1rem',
                        borderBottom: '1px solid #f8f8f8',
                        cursor: 'pointer',
                        backgroundColor: notification.read ? '#fff' : '#f8fbff',
                        transition: 'background-color 0.2s ease',
                      }}
                      className="hover:bg-gray-50"
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.2rem' }}>
                          {getNotificationIcon(notification.type)}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            fontSize: '0.9rem', 
                            color: '#333',
                            fontWeight: notification.read ? '400' : '500',
                            lineHeight: '1.4',
                          }}>
                            {notification.text}
                          </div>
                          <div style={{ 
                            fontSize: '0.75rem', 
                            color: '#999',
                            marginTop: '0.25rem',
                          }}>
                            {notification.time}
                          </div>
                        </div>
                        {!notification.read && (
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: '#635bff',
                            marginTop: '0.5rem',
                          }} />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{
                    padding: '2rem 1rem',
                    textAlign: 'center',
                    color: '#999',
                    fontSize: '0.9rem',
                  }}>
                    No notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div 
          ref={dropdownRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            position: 'relative',
            padding: '0.25rem 0.5rem',
            borderRadius: '2rem',
            transition: 'background-color 0.2s ease',
          }}
          className="hover:bg-white hover:bg-opacity-10"
          onClick={() => {
            setIsDropdownOpen(!isDropdownOpen);
            setIsNotificationsOpen(false);
            setIsQuickSettingsOpen(false);
          }}
        >
          <div 
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              fontSize: '0.9rem',
              transition: 'all 0.2s ease',
            }}
            className="hover:bg-opacity-30"
          >
            {getInitial(userName)}
          </div>

          {!isMobile && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ 
                color: 'white', 
                fontWeight: '600', 
                fontSize: '0.9rem',
                lineHeight: '1.2',
              }}>
                {userName || 'User'}
              </span>
              <span style={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                fontSize: '0.75rem',
                lineHeight: '1.2',
              }}>
                {userRole || 'Admin'}
              </span>
            </div>
          )}

          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 12 12" 
            fill="none" 
            style={{
              transition: 'transform 0.2s ease',
              transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
            }}
          >
            <path d="M3 4.5L6 7.5L9 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>

          {isDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              width: '220px',
              zIndex: 1000,
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              marginTop: '0.75rem',
              overflow: 'hidden',
            }}>
              {/* User header */}
              <div style={{
                padding: '1rem',
                backgroundColor: '#f8fbff',
                borderBottom: '1px solid #e8f0fe',
              }}>
                <div style={{ fontWeight: '600', color: '#333', fontSize: '0.95rem' }}>
                  {userName || 'User'}
                </div>
                <div style={{ 
                  color: '#666', 
                  fontSize: '0.8rem',
                  marginTop: '0.25rem',
                }}>
                  {userRole || 'Administrator'}
                </div>
              </div>
              
              <div style={{ padding: '0.5rem 0' }}>
                <button 
                  onClick={handleProfile}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    color: '#333',
                    transition: 'background-color 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                  className="hover:bg-gray-50"
                >
                  <span>👤</span>
                  <span>My Profile</span>
                </button>
                
                <button 
                  onClick={handleChangePassword}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    color: '#333',
                    transition: 'background-color 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                  className="hover:bg-gray-50"
                >
                  <span>🔒</span>
                  <span>Change Password</span>
                </button>
                <div style={{ height: '1px', backgroundColor: '#f0f0f0', margin: '0.5rem 0' }} />
                <button 
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    color: '#e74c3c',
                    transition: 'background-color 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontWeight: '500',
                  }}
                  className="hover:bg-red-50"
                >
                  <span>🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

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
            borderRadius: '12px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📌</div>
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem', color: '#333' }}>Unpin Module</h3>
            <p style={{ color: '#666', lineHeight: '1.5' }}>
              Are you sure you want to unpin <strong>{showUnpinConfirm.name}</strong> from your quick access?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                onClick={() => setShowUnpinConfirm(null)}
                style={{
                  padding: '0.6rem 1.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: '#f8f9fa',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                }}
                className="hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  unpinModule(showUnpinConfirm.id);
                  setShowUnpinConfirm(null);
                }}
                style={{
                  padding: '0.6rem 1.5rem',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#ff4757',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                }}
                className="hover:bg-red-600"
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