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

import "./globals.css";
import { ThemeProvider } from './context/ThemeContext';
import StoreProvider from './redux/providers';
import { TicketProvider } from "./context/TicketContext";
import { LocalizationProvider } from "../context/LocalizationContext";

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
                {children}
              </TicketProvider>
            </LocalizationProvider>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}