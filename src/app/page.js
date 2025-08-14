// 'use client'

// import { useState } from 'react';
// import Sidebar from '../components/dashboard/Sidebar';
// import Header from '../components/dashboard/Header';
// import Cards from '../components/dashboard/Cards';
// import Charts from '../components/dashboard/Charts';
// import styles from './page.module.css';

// export default function Home() {
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

//   return (
//     <div>
//       <Sidebar 
//         isCollapsed={isSidebarCollapsed} 
//         setIsCollapsed={setIsSidebarCollapsed} 
//       />
//       <Header isSidebarCollapsed={isSidebarCollapsed} />
      
//       <main 
//         style={{
//           marginLeft: isSidebarCollapsed ? '80px' : '250px',
//           paddingTop: '80px',
//           padding: '2rem',
//           transition: 'margin-left 0.3s ease',
//         }}
//       >
//         <h1 style={{ 
//           marginBottom: '1.9rem', 
//           fontSize: '1.8rem', 
//           fontWeight: '600',
//           color: 'var(--text-color)'
//         }}>
//           {/* Dashboard Overview */}
//         </h1>
        
//         <Cards />
//         <Charts />
//       </main>
//     </div>
//   );
// }
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomeRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/login')
  }, [router])

  return null
}
