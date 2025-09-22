// // src/components/headerpin/PinnedModulesPage.js
'use client';


import { usePin } from '../../app/hooks/usePin';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

// Import all icons you use in your application
import {
  MdDashboard, MdSearch, MdOutlineApartment, MdDomain, MdMap,
  MdOutlineGroupWork, MdCategory, MdWarehouse, MdWork, MdAccountBox,
  MdEmojiPeople, MdAccessibility, MdLocalShipping, MdPeople, MdPersonAdd,
  MdClass, MdLocalOffer, MdStars, MdRateReview, MdBuild, MdLocalMall,
  MdCollectionsBookmark, MdStraighten, MdBrandingWatermark, MdReceipt,
  MdGavel, MdAssignment, MdAttachMoney, MdEvent, MdAnalytics, MdSettings,
  MdInventory, MdAccountBalance, MdPayments, MdSummarize,
  MdPushPin // Add MdPushPin import
} from 'react-icons/md';

import { FaBuilding, FaTruck, FaUserTag, FaHandshake, FaBalanceScale, FaBoxOpen, FaBoxes, FaUserTie } from 'react-icons/fa';
import { FiUser } from 'react-icons/fi';
import { AiOutlineUsergroupAdd, AiOutlineNodeIndex } from 'react-icons/ai';

// Create an icon map
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
  MdPushPin,
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

function PinnedModulesPage() {
  const { pinnedModules, unpinModule } = usePin();
  const router = useRouter();
  const [showUnpinConfirm, setShowUnpinConfirm] = useState(null);

  const confirmUnpin = (module) => {
    unpinModule(module);
    setShowUnpinConfirm(null);
  };

  const navigateToModule = (path) => {
    router.push(path);
  };

  // Get the icon component from the icon map
  const getIconComponent = (iconName) => {
    return iconMap[iconName] || null;
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '1.8rem', 
          fontWeight: '600', 
          color: '#1b69e7',
          marginBottom: '0.5rem'
        }}>
          Pinned Modules
        </h1>
        <p style={{ color: '#666' }}>
          Quickly access your favorite modules from across the application
        </p>
      </div>

      {pinnedModules.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '0.5rem' 
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#ccc' }}>📌</div>
          <h3 style={{ color: '#555', marginBottom: '0.5rem' }}>No pinned modules yet</h3>
          <p style={{ color: '#777' }}>
            Pin your frequently used modules from the sidebar for quick access
          </p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {pinnedModules.map((module, index) => {
            const IconComponent = getIconComponent(module.icon);
            
            return (
              <div
                key={index}
                style={{
                  padding: '0.8rem',
                  backgroundColor: 'white',
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                  border: '1px solid #eaeaea',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  width: '200px',
                }}
                className="hover:shadow-md"
                onClick={() => navigateToModule(module.path)}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUnpinConfirm(module);
                  }}
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#1b69e7ff',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}
                  className="hover:bg-red-50 hover:text-red-500"
                  title="Unpin module"
                >
                  <MdPushPin size={48} />
                </button>
                
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  textAlign: 'center'
                }}>
                  {IconComponent && (
                    <div style={{ 
                      marginBottom: '1rem', 
                      color: '#1b69e7',
                      fontSize: '2.5rem'
                    }}>
                      <IconComponent size={32} />
                    </div>
                  )}
                  
                  <h3 style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: '500',
                    margin: '0 0 0.5rem 0',
                    color: '#000000ff'
                  }}>
                    {module.name}
                  </h3>
                  
                  <button
                    onClick={() => navigateToModule(module.path)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#1b69e7',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      transition: 'background-color 0.2s',
                    }}
                    className="hover:bg-blue-700"
                  >
                    Open Module
                  </button>
                </div>
              </div>
            );
          })}
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
                  backgroundColor: '##f5f5f5',
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
    </div>
  );
}

export default  PinnedModulesPage

