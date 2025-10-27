'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const LocalizationContext = createContext();

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};

export const LocalizationProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState({});

  // Available languages
  const languages = {
    en: 'English',
    hi: 'Hindi',
    
  };

  // Translation strings
  const translationData = {
    en: {
      // Grid translations
      search: 'Search...',
      reset: 'Reset',
      export: 'Export',
      currentPage: 'Current Page',
      allRecords: 'All Records',
      selectedRows: 'Selected Rows',
      rowsSelected: 'rows selected',
      loading: 'Loading data...',
      noRows: 'No Rows To Show',
      page: 'Page',
      of: 'of',
      to: 'to',
      more: 'more',
      searchtop: 'Search Party by Name',
      
      // Column headers
      select: 'Select',
      orderNo: 'ORDER NO',
      orderDate: 'ORDER DATE',
      pOrderRef: 'P ORDER REF',
      deliveryDate: 'DELIVERY DT',
      partyName: 'PARTY NAME',
      brokerName: 'BROKER NAME',
      quantity: 'QUANTITY',
      balanceQty: 'BALANCE QTY',
      amount: 'AMOUNT',


      // Column headers - Stock Inquiry Table
      select: 'Select',
      category: 'Category',
      product: 'Product',
      series: 'Series',
      styleCode: 'StyleCode',
      style: 'Style',
      shade: 'Shade',
      size: 'Size',
      packOf: 'PackOf',
      ordQty: 'OrdQty',
      perBox: 'PerBox',
      barcode: 'Barcode',
      
      
      // Filter options
      equals: 'Equals',
      notEqual: 'Not equal',
      lessThan: 'Before',
      greaterThan: 'After',
      inRange: 'Between',
      empty: 'Empty',
      notEmpty: 'Not Empty',
      today: 'Today',
      yesterday: 'Yesterday',
      thisMonth: 'This Month',
      lastMonth: 'Last Month',
      nextMonth: 'Next Month',
      
      // Buttons
      back: 'Back',
      exit: 'Exit',
      new: 'New'
    },
    hi: {
      // Grid translations
      search: 'खोजें...',
      reset: 'रीसेट',
      export: 'निर्यात',
      currentPage: 'वर्तमान पृष्ठ',
      allRecords: 'सभी रिकॉर्ड',
      selectedRows: 'चयनित पंक्तियाँ',
      rowsSelected: 'पंक्तियाँ चयनित',
      loading: 'डेटा लोड हो रहा है...',
      noRows: 'दिखाने के लिए कोई पंक्ति नहीं',
      page: 'पृष्ठ',
      of: 'का',
      to: 'से',
      more: 'अधिक',
       searchtop: 'नाम से पार्टी खोजें',
      
      
      // Column headers
      select: 'चुनें',
      orderNo: 'आर्डर नंबर',
      orderDate: 'आर्डर तारीख',
      pOrderRef: 'पी आर्डर संदर्भ',
      deliveryDate: 'डिलीवरी तारीख',
      partyName: 'पार्टी का नाम',
      brokerName: 'ब्रोकर का नाम',
      quantity: 'मात्रा',
      balanceQty: 'शेष मात्रा',
      amount: 'राशि',

      // Column headers - Stock Inquiry Table 
      select: 'चुनें',
      category: 'श्रेणी',
      product: 'उत्पाद',
      series: 'श्रृंखला',
      styleCode: 'स्टाइल कोड',
      style: 'स्टाइल',
      shade: 'शेड',
      size: 'आकार',
      packOf: 'पैक ऑफ',
      ordQty: 'ऑर्डर मात्रा',
      perBox: 'प्रति बॉक्स',
      barcode: 'बारकोड',
      
      // Filter options
      equals: 'बराबर',
      notEqual: 'बराबर नहीं',
      lessThan: 'पहले',
      greaterThan: 'बाद में',
      inRange: 'के बीच',
      empty: 'खाली',
      notEmpty: 'खाली नहीं',
      today: 'आज',
      yesterday: 'कल',
      thisMonth: 'इस महीने',
      lastMonth: 'पिछले महीने',
      nextMonth: 'अगले महीने',
      
      // Buttons
      back: 'वापस',
      exit: 'बाहर निकलें',
      new: 'नया'
    },
   
  };

  useEffect(() => {
    setTranslations(translationData[language] || translationData.en);
  }, [language]);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    // You can also save to localStorage if needed
    localStorage.setItem('preferredLanguage', lang);
  };

  const t = (key) => {
    return translations[key] || key;
  };

  return (
    <LocalizationContext.Provider value={{
      language,
      languages,
      translations,
      t,
      changeLanguage
    }}>
      {children}
    </LocalizationContext.Provider>
  );
};