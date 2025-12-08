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





// src/app/layout.js
// src/app/layout.js

import "./globals.css";
import { ThemeProvider } from './context/ThemeContext';
import StoreProvider from './redux/providers';
import { TicketProvider } from "./context/TicketContext";
import { LocalizationProvider } from "../context/LocalizationContext";
import { RecentPathsProvider } from '../app/context/RecentPathsContext';

export const metadata = {
  title: "PrasystERP",
  description: "PRASYST - The symbol of business integration.",
  icons: {
    icon: '/images/Login3.jpg'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <ThemeProvider>
            <LocalizationProvider>
              <TicketProvider>
                <RecentPathsProvider>
                  {children}
                </RecentPathsProvider>
              </TicketProvider>
            </LocalizationProvider>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}