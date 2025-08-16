'use client'

import { useState } from 'react';
import { useTheme } from '../../../src/app/context/ThemeContext';
import { IoIosSearch } from "react-icons/io";
import { useRouter } from "next/navigation";

const Header = ({ isSidebarCollapsed }) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const router=useRouter();

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

  return (
    <header 
      style={{
        backgroundColor: 'var(--header-bg)',
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
        <div 
          className="flex items-center"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderRadius: '2rem',
            padding: '0.5rem',
            overflow: 'hidden',
            border: isSearchExpanded ? '1px solid var(--primary)' : 'none',
            transition: 'all 0.3s ease-out', // Smoother transition
            width: isSearchExpanded ? '250px' : '40px', // Fixed width values
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
        </div>
      </div>

      <div className="flex items-center gap-4 relative">
        <button 
          onClick={toggleTheme}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-color)',
            fontSize: '1.2rem',
            width: '40px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
          }}
          className="hover:bg-opacity-10 hover:bg-white"
        >
          {/* {theme === 'light' ? '🌙' : '☀️'} */}
        </button>

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
            R
          </div>
          <span style={{ color: 'var(--text-color)' }}>Rajat !</span>

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
    </header>
  );
};

export default Header;