// src/app/layout.js

import "./globals.css";
import { ThemeProvider } from './context/ThemeContext';
import StoreProvider from './redux/providers';

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
      <body >
        <StoreProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}