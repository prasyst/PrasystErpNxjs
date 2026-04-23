// // src/app/layout.js

// import "./globals.css";
// import { ThemeProvider } from './context/ThemeContext';
// import StoreProvider from './redux/providers';
// import { TicketProvider } from "./context/TicketContext";


// export const metadata = {
//   title: "PrasystERP",
//   description: "PRASYST - The symbol of business integration.",
//   icons: {
//     icon: '/images/Login3.jpg'
//   }
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body >
//         <StoreProvider>
//           <ThemeProvider>
//               <TicketProvider>
//             {children}
//          </TicketProvider>
//           </ThemeProvider>
//         </StoreProvider>
//       </body>
//     </html>
//   );
// }





// // src/app/layout.js
// // src/app/layout.js

// import "./globals.css";
// import { ThemeProvider } from './context/ThemeContext';
// import StoreProvider from './redux/providers';
// import { TicketProvider } from "./context/TicketContext";
// import { LocalizationProvider } from "../context/LocalizationContext";
// import { RecentPathsProvider } from '../app/context/RecentPathsContext';

// export const metadata = {
//   title: "Pratham Systech India Ltd",
//   description: "PRASYST - The symbol of business integration.",
//   icons: {
//     icon: '/images/FavIcon.png'
//   }
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body>
//         <StoreProvider>
//           <ThemeProvider>
//             <LocalizationProvider>
//               <TicketProvider>
//                 <RecentPathsProvider>
//                   {children}
//                 </RecentPathsProvider>
//               </TicketProvider>
//             </LocalizationProvider>
//           </ThemeProvider>
//         </StoreProvider>
//       </body>
//     </html>
//   );
// }


import "./globals.css";
import { ThemeProvider } from './context/ThemeContext';
import StoreProvider from './redux/providers';
import { TicketProvider } from "./context/TicketContext";
import { LocalizationProvider } from "../context/LocalizationContext";
import { RecentPathsProvider } from '../app/context/RecentPathsContext';
import PWAPrompt from '../components/PWAPrompt';
import PWAUpdatePrompt from '../components/PWAUpdatePrompt';

export const metadata = {
  title: "PRASYST - Pratham Systech India Ltd",
  description: "PRASYST - The symbol of business integration.",
  manifest: "/manifest.json",
  themeColor: "#3A7BD5",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: "yes",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PRASYST",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/images/pratham.jpeg' },
      { url: '/images/pratham.jpeg', sizes: '192x192', type: 'image/jpeg' },
      { url: '/images/pratham.jpeg', sizes: '512x512', type: 'image/jpeg' },
    ],
    shortcut: ['/images/pratham.jpeg'],
    apple: [
      { url: '/images/pratham.jpeg' },
      { url: '/images/pratham.jpeg', sizes: '152x152' },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/images/pratham.jpeg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="PRASYST" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#3A7BD5" />
        <meta name="msapplication-TileImage" content="/images/pratham.jpeg" />
        <meta name="theme-color" content="#3A7BD5" />
      </head>
      <body>
        <StoreProvider>
          <ThemeProvider>
            <LocalizationProvider>
              <TicketProvider>
                <RecentPathsProvider>
                  {children}
                  <PWAPrompt />
                  <PWAUpdatePrompt />
                </RecentPathsProvider>
              </TicketProvider>
            </LocalizationProvider>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}