

'use client';

import { useEffect, useState, useRef } from 'react';
import { useTheme } from '../../../src/app/context/ThemeContext';
import { IoIosSearch, IoIosPin, IoIosTime } from "react-icons/io";
import { useRouter } from "next/navigation";
import { MdPushPin, MdMenu, MdClose, MdNotifications, MdSettings, MdHelp, MdHistory } from 'react-icons/md';
import { usePin } from '../../app/hooks/usePin';
import { getAllMenuItemsWithPaths, getIconComponent } from './menuData';
import Link from 'next/link';
import ReportIcon from '@mui/icons-material/Report';
import axiosInstance from '@/lib/axios';
import { useRecentPaths } from '../../../src/app/context/RecentPathsContext';
import { IoMdMic, IoMdMicOff } from 'react-icons/io';
import AIReportingTool from '../myaitool/myaitool';
import { FaRobot } from 'react-icons/fa';
import FlowDiagramIcon from '@mui/icons-material/BackupTable';
import Tooltip from '@mui/material/Tooltip';
import BackupTableIcon from '@mui/icons-material/BackupTable';

const Header = ({ isSidebarCollapsed, onMenuToggle, isMobile }) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false);
  const [isRecentlyVisitedOpen, setIsRecentlyVisitedOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [isAIToolOpen, setIsAIToolOpen] = useState(false);
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [branchName, setBranchName] = useState('');
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const settingsRef = useRef(null);
  const recentlyVisitedRef = useRef(null);
  const { pinnedModules, unpinModule } = usePin();
  const [showUnpinConfirm, setShowUnpinConfirm] = useState(null);
  const { recentPaths, clearRecentPaths, removeRecentPath } = useRecentPaths();
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState('');
  const [clientId, setClientId] = useState('');
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New ticket assigned to you', time: '5 min ago', read: false, type: 'ticket' },
    { id: 2, text: 'Inventory stock running low', time: '1 hour ago', read: false, type: 'inventory' },
    { id: 3, text: 'Monthly report is ready', time: '2 hours ago', read: true, type: 'report' }
  ]);

  // Indian accent variations map
  const indianAccentMap = {
    'rm': ['आरएम', 'ar em', 'ar-em', 'रॉ मटेरियल', 'raw material', 'आर एम'],
    'purchase': ['पर्चेज', 'परचेज', 'पर्चेस', 'buy', 'खरीद'],
    'order': ['ऑर्डर', 'ओर्डर', 'आर्डर', 'order'],
    'sales': ['सेल्स', 'सेल', 'sale'],
    'dashboard': ['डैशबोर्ड', 'डैश बोर्ड', 'dash board', 'dashbord'],
    'master': ['मास्टर', 'मास्टर', 'mastar'],
    'company': ['कंपनी', 'campany', 'company'],
    'property': ['प्रॉपर्टी', 'प्रोपर्टी', 'proparty', 'properti'],
    'inventory': ['इन्वेंटरी', 'इनवेंटरी', 'inventry', 'stock'],
    'ticket': ['टिकट', 'टिकेट', 'tiket'],
    'account': ['अकाउंट', 'account'],
    'report': ['रिपोर्ट', 'reporrt', 'riport'],
    'payment': ['पेमेंट', 'paymant', 'paymment'],
    'room': ['रूम', 'rum', 'रुम', 'रोम'],
    'raw': ['रॉ', 'raw', 'रॉ'],
    'material': ['मटेरियल', 'material'],
  };

  // Get all menu items
  const searchableItems = getAllMenuItemsWithPaths();

  // Enhanced Indian accent variations generator
  const generateIndianVariations = (text) => {
    const variations = new Set();
    const lowerText = text.toLowerCase().trim();
    
    // Add original
    variations.add(lowerText);
    
    // Common Indian mispronunciations
    const transformations = [
      // "RM Purchase Order" variations
      (str) => str.replace(/rm purchase order/gi, 'आरएम पर्चेज ऑर्डर'),
      (str) => str.replace(/rm purchase order/gi, 'ar em purchase order'),
      (str) => str.replace(/rm purchase order/gi, 'आरएम परचेज आर्डर'),
      (str) => str.replace(/rm purchase/gi, 'आरएम पर्चेज'),
      (str) => str.replace(/purchase order/gi, 'पर्चेज ऑर्डर'),
      (str) => str.replace(/rm order/gi, 'आरएम ऑर्डर'),
      
      // "Sales Order" variations
      (str) => str.replace(/sales order/gi, 'सेल्स ऑर्डर'),
      (str) => str.replace(/sales order/gi, 'सेल ऑर्डर'),
      (str) => str.replace(/sales order/gi, 'salesorder'),
      
      // General word variations
      (str) => {
        let result = str;
        Object.entries(indianAccentMap).forEach(([key, values]) => {
          values.forEach(value => {
            const regex = new RegExp(`\\b${key}\\b`, 'gi');
            result = result.replace(regex, value);
          });
        });
        return result;
      },
      
      // Remove spaces
      (str) => str.replace(/\s+/g, ''),
      (str) => str.replace(/\s+/g, ' ').trim(),
      
      // Common Indian abbreviations
      (str) => str.replace(/\braw material\b/gi, 'rm'),
      (str) => str.replace(/\brm\b/gi, 'raw material'),
      
      // Double letters (common in Indian accent)
      (str) => str.replace(/([a-z])\1/gi, '$1'),
      (str) => str.replace(/([bcdfghjklmnpqrstvwxyz])/gi, '$1$1'),
      
      // Vowel variations
      (str) => str.replace(/a/gi, 'aa'),
      (str) => str.replace(/i/gi, 'ee'),
      (str) => str.replace(/u/gi, 'oo'),
    ];
    
    // Generate variations
    transformations.forEach(transform => {
      try {
        const variation = transform(lowerText);
        if (variation && variation !== lowerText) {
          variations.add(variation);
        }
      } catch (e) {
        // Ignore errors
      }
    });
    
    // Add common partial queries for "RM Purchase Order"
    if (lowerText.includes('rm') && lowerText.includes('purchase') && lowerText.includes('order')) {
      variations.add('rm purchase');
      variations.add('rm order');
      variations.add('purchase order');
      variations.add('rmpo');
      variations.add('आरएमपीओ');
      variations.add('raw material purchase');
      variations.add('raw material order');
    }
    
    return Array.from(variations);
  };

  // Calculate similarity between two strings (Indian accent aware)
  const calculateSimilarity = (str1, str2) => {
    const s1 = str1.toLowerCase().trim();
    const s2 = str2.toLowerCase().trim();
    
    // Exact match
    if (s1 === s2) return 1.0;
    
    // Check if one contains the other
    if (s1.includes(s2) || s2.includes(s1)) {
      return 0.9;
    }
    
    // Check Indian variations
    const item = searchableItems.find(item => {
      const variations = generateIndianVariations(item.name);
      return variations.some(variation => 
        variation === s1 || variation === s2 ||
        s1.includes(variation) || variation.includes(s1) ||
        s2.includes(variation) || variation.includes(s2)
      );
    });
    
    if (item) {
      return 0.85;
    }
    
    // Word-wise matching for Indian accent
    const words1 = s1.split(/\s+/);
    const words2 = s2.split(/\s+/);
    
    // Check if all words from s1 are in s2 (or variations)
    let matchCount = 0;
    words1.forEach(word1 => {
      if (words2.some(word2 => calculateWordSimilarity(word1, word2) > 0.7)) {
        matchCount++;
      } else {
        // Check if word1 is a variation of any word in words2
        const word1Variations = generateIndianVariations(word1);
        if (word1Variations.some(variation => 
          words2.some(word2 => calculateWordSimilarity(variation, word2) > 0.7)
        )) {
          matchCount++;
        }
      }
    });
    
    const similarityScore = matchCount / Math.max(words1.length, words2.length);
    
    // Boost score for partial matches (e.g., "rm purchase" for "rm purchase order")
    if (words1.length < words2.length && matchCount === words1.length) {
      return Math.max(similarityScore, 0.8);
    }
    
    return similarityScore;
  };

  const handleFlowDiagramClick = () => {
    router.push('/flowdiagram');
  };

  const calculateWordSimilarity = (word1, word2) => {
    if (word1 === word2) return 1.0;
    
    // Check Indian accent map
    for (const [key, values] of Object.entries(indianAccentMap)) {
      if ((word1 === key && values.includes(word2)) || 
          (word2 === key && values.includes(word1))) {
        return 0.9;
      }
    }
    
    // Check if words are variations
    const variations1 = generateIndianVariations(word1);
    const variations2 = generateIndianVariations(word2);
    
    if (variations1.includes(word2) || variations2.includes(word1)) {
      return 0.85;
    }
    
    // Levenshtein distance for fuzzy matching
    const len1 = word1.length;
    const len2 = word2.length;
    const maxLen = Math.max(len1, len2);
    
    if (maxLen === 0) return 1.0;
    
    const matrix = [];
    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = word1[i - 1] === word2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    
    const distance = matrix[len1][len2];
    return 1 - (distance / maxLen);
  };

  useEffect(() => {
    const storedName = localStorage.getItem('USER_NAME');
    const storedRole = localStorage.getItem('userRole');
    if (storedName) {
      setUserName(storedName);
    }
    if (storedRole) {
      setUserRole(storedRole);
    }

    fetchCompanyAndBranchNames();
  }, []);

  const fetchCompanyAndBranchNames = async () => {
  try {
    const coId = localStorage.getItem('CO_ID');
    const cobrId = localStorage.getItem('COBR_ID');

    if (coId && cobrId) {
      // Fetch Client ID first
      try {
        const clientIdResponse = await axiosInstance.get('USERS/GetClientId');
        console.log('Client ID Response:', clientIdResponse.data);
        
        if (clientIdResponse.data?.STATUS === 0 && clientIdResponse.data.DATA) {
          // Extract number from "Client Id is 5102"
          const clientIdMatch = clientIdResponse.data.DATA.match(/\d+/);
          if (clientIdMatch) {
            setClientId(clientIdMatch[0]);
             localStorage.setItem('CLIENT_ID', clientIdMatch[0]);
            console.log('Client ID Set:', clientIdMatch[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching client ID:', error);
      }

      // Fetch Company
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

      // Fetch Branch
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
    // Check if browser supports Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const speechSynthesis = window.speechSynthesis;
    
    if (SpeechRecognition && speechSynthesis) {
      setVoiceSupported(true);
      synthRef.current = speechSynthesis;
      
      // Create recognition instance with Indian English
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN'; // Indian English
      recognition.maxAlternatives = 5; // Get multiple alternatives for better matching
      
      // Handle results
      recognition.onresult = (event) => {
        const results = event.results[0];
        const alternatives = [];
        
        // Collect all alternatives
        for (let i = 0; i < results.length; i++) {
          alternatives.push(results[i].transcript.toLowerCase().trim());
        }
        
        const bestTranscript = alternatives[0];
        console.log('Voice input alternatives:', alternatives);
        setVoiceMessage(`Searching for: "${bestTranscript}"`);
        
        // Find best match among all menu items
        let bestMatch = null;
        let bestSimilarity = 0;
        const allMatches = [];
        
        searchableItems.forEach(item => {
          let maxSimilarity = 0;
          
          // Check against each alternative
          alternatives.forEach(transcript => {
            const similarity = calculateSimilarity(transcript, item.name.toLowerCase());
            if (similarity > maxSimilarity) {
              maxSimilarity = similarity;
            }
          });
          
          // Check Indian variations
          const variations = generateIndianVariations(item.name);
          variations.forEach(variation => {
            alternatives.forEach(transcript => {
              const similarity = calculateSimilarity(transcript, variation);
              if (similarity > maxSimilarity) {
                maxSimilarity = similarity;
              }
            });
          });
          
          // Check partial matches (e.g., "rm purchase" for "RM Purchase Order")
          const itemWords = item.name.toLowerCase().split(/\s+/);
          alternatives.forEach(transcript => {
            const inputWords = transcript.split(/\s+/);
            
            // Check if all input words match item words
            const allWordsMatch = inputWords.every(inputWord =>
              itemWords.some(itemWord => calculateWordSimilarity(inputWord, itemWord) > 0.6)
            );
            
            if (allWordsMatch && maxSimilarity < 0.8) {
              maxSimilarity = Math.max(maxSimilarity, 0.8);
            }
            
            // Check if any word matches
            const anyWordMatch = inputWords.some(inputWord =>
              itemWords.some(itemWord => calculateWordSimilarity(inputWord, itemWord) > 0.6)
            );
            
            if (anyWordMatch && maxSimilarity < 0.7) {
              maxSimilarity = Math.max(maxSimilarity, 0.7);
            }
          });
          
          if (maxSimilarity > 0) {
            allMatches.push({
              item: item,
              similarity: maxSimilarity
            });
          }
          
          if (maxSimilarity > bestSimilarity) {
            bestSimilarity = maxSimilarity;
            bestMatch = { item: item, similarity: maxSimilarity };
          }
        });
        
        // Sort all matches by similarity
        allMatches.sort((a, b) => b.similarity - a.similarity);
        
        console.log('All matches:', allMatches);
        
        if (bestMatch && bestMatch.similarity > 0.7) {
          // High confidence match
          console.log('Best match found:', bestMatch.item.name, 'Similarity:', bestMatch.similarity);
          setVoiceMessage(`Opening ${bestMatch.item.name}`);
          
          speakText(`Opening ${bestMatch.item.name}. You said "${bestTranscript}"`, () => {
            // Open in new tab
            window.open(bestMatch.item.path, '_blank');
            setVoiceMessage('');
            setIsListening(false);
          });
        } else if (allMatches.length > 0) {
          // Suggest top matches
          const topMatches = allMatches.slice(0, 3);
          setVoiceMessage(`Found ${allMatches.length} similar modules`);
          
          const suggestionText = topMatches.map((match, i) => 
            `${i + 1}. ${match.item.name}`
          ).join(', ');
          
          speakText(`Did you mean: ${suggestionText}? Please select from the search results.`, () => {
            // Show suggestions in search results
            setSearchResults(topMatches.map(match => match.item));
            setShowSearchResults(true);
            setVoiceMessage('');
            setIsListening(false);
          });
        } else {
          // No match found
          console.log('No match found for:', bestTranscript);
          setVoiceMessage('Module not found');
          
          speakText(`Sorry, I couldn't find "${bestTranscript}". Please try a different module name or use text search.`, () => {
            setVoiceMessage('');
            setIsListening(false);
          });
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Voice recognition error:', event.error);
        setIsListening(false);
        setVoiceMessage('');
        
        if (event.error === 'no-speech') {
          speakText('I didn\'t hear anything. Please speak clearly and try again.');
        } else if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please enable microphone permissions in your browser settings.');
        } else if (event.error === 'audio-capture') {
          speakText('No microphone found. Please check your microphone connection.');
        } else {
          speakText('Sorry, there was an error with voice recognition. Please try again.');
        }
      };
      
      recognition.onend = () => {
        if (isListening && !aiSpeaking) {
          setIsListening(false);
          setVoiceMessage('');
        }
      };
      
      recognitionRef.current = recognition;
    } else {
      setVoiceSupported(false);
      console.warn('Web Speech API not supported in this browser');
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Function to make AI speak with Indian accent
  const speakText = (text, callback) => {
    if (!synthRef.current) {
      if (callback) callback();
      return;
    }
    
    // Cancel any ongoing speech
    synthRef.current.cancel();
    
    setAiSpeaking(true);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0; // Normal speed for Indian English
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = 'en-IN'; // Indian English
    
    // Try to get an Indian voice
    const voices = synthRef.current.getVoices();
    let selectedVoice = null;
    
    // Prefer Indian voices
    selectedVoice = voices.find(voice => 
      voice.lang === 'en-IN' || 
      voice.name.includes('India') ||
      voice.name.includes('Indian')
    );
    
    // If no Indian voice, try female voice for clarity
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => 
        voice.name.includes('Female') || 
        voice.name.includes('Samantha') || 
        voice.name.includes('Victoria') ||
        voice.name.includes('Zira') ||
        voice.name.includes('Hazel')
      );
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.onend = () => {
      setAiSpeaking(false);
      if (callback) callback();
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setAiSpeaking(false);
      if (callback) callback();
    };
    
    setTimeout(() => {
      synthRef.current.speak(utterance);
    }, 100);
  };

  // Voice search handler with Indian accent support
  const handleVoiceSearch = () => {
    if (!voiceSupported) {
      alert('Voice recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }
    
    if (isListening) {
      // Stop listening and speaking
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      setIsListening(false);
      setAiSpeaking(false);
      setVoiceMessage('');
    } else {
      // Start voice assistant
      try {
        setIsListening(true);
        setIsSearchExpanded(true);
        setVoiceMessage('AI Assistant listening...');
        
        // AI introduction with Indian accent hints
        speakText('Hello! Please say the name of the module you want to search for.', () => {
          // After AI finishes speaking, start listening
          try {
            setTimeout(() => {
              recognitionRef.current.start();
              setVoiceMessage('Listening... Speak now');
              console.log('Voice recognition started with Indian English');
            }, 500);
          } catch (error) {
            console.error('Error starting recognition:', error);
            setIsListening(false);
            setVoiceMessage('');
            speakText('Sorry, I could not start listening. Please try again.');
          }
        });
        
      } catch (error) {
        console.error('Error starting voice assistant:', error);
        setIsListening(false);
        setVoiceMessage('');
        alert('Could not start voice assistant. Please try again.');
      }
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

      if (recentlyVisitedRef.current && !recentlyVisitedRef.current.contains(event.target)) {
        setIsRecentlyVisitedOpen(false);
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
      // Enhanced search with Indian accent variations
      const results = searchableItems.filter(item => {
        const itemName = item.name.toLowerCase();
        const searchQueryLower = query.toLowerCase();
        
        // Direct match
        if (itemName.includes(searchQueryLower)) {
          return true;
        }
        
        // Check Indian variations
        const variations = generateIndianVariations(item.name);
        if (variations.some(variation => variation.includes(searchQueryLower))) {
          return true;
        }
        
        // Word-wise matching for partial queries
        const searchWords = searchQueryLower.split(/\s+/);
        const itemWords = itemName.split(/\s+/);
        
        // Check if all search words are present in item
        const allWordsMatch = searchWords.every(searchWord =>
          itemWords.some(itemWord => 
            itemWord.includes(searchWord) || 
            calculateWordSimilarity(searchWord, itemWord) > 0.6
          )
        );
        
        if (allWordsMatch) {
          return true;
        }
        
        // Check if any word matches significantly
        const significantMatch = searchWords.some(searchWord => {
          if (searchWord.length < 3) return false;
          return itemWords.some(itemWord => 
            calculateWordSimilarity(searchWord, itemWord) > 0.8
          );
        });
        
        return significantMatch;
      });
      
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults(searchableItems.slice(0, 8));
      setShowSearchResults(true);
    }
  };

  const handleSearchResultClick = (path) => {
    setSearchQuery('');
    setShowSearchResults(false);
    setIsSearchExpanded(false);
    window.open(path, '_blank');
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

  const formatTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const handleRecentPathClick = (path) => {
    window.open(path, '_blank');
    setIsRecentlyVisitedOpen(false);
  };

  // Add CSS animations for voice search
  const voiceSearchStyles = `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
    
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    @keyframes wave {
      0%, 100% { height: 12px; }
      50% { height: 18px; }
    }
    
    .voice-status-indicator {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background-color: #fff5f5;
      border: 1px solid #ff4757;
      border-radius: 8px;
      margin-top: 0.5rem;
      padding: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      z-index: 999;
    }
    
    .voice-wave {
      display: flex;
      gap: 2px;
    }
    
    .wave-bar {
      width: 3px;
      height: 12px;
      background-color: #ff4757;
      border-radius: 2px;
      animation: wave 1s ease-in-out infinite;
    }
  `;

  return (
    <>
      <style jsx>{voiceSearchStyles}</style>
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

        <div className="flex items-center gap-3 md:gap-4" style={{ flex: 1 }}>
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
              backgroundColor: isListening ? 'rgba(255, 71, 87, 0.2)' : 'rgba(255, 255, 255, 0.15)',
              borderRadius: '2rem',
              padding: '0.5rem',
              overflow: 'visible',
              border: isSearchExpanded 
                ? (isListening ? '2px solid #ff4757' : '2px solid rgba(255, 255, 255, 0.8)') 
                : '2px solid transparent',
              transition: 'all 0.3s ease-out',
              width: isSearchExpanded ? (isMobile ? '200px' : '380px') : '40px',
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
              placeholder={voiceMessage || "Search modules, features..."}
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => !isListening && setShowSearchResults(true)}
              disabled={isListening}
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                color: 'white',
                marginLeft: '0.5rem',
                width: isSearchExpanded ? 'calc(100% - 70px)' : '0',
                padding: isSearchExpanded ? '0.25rem 0' : '0',
                opacity: isSearchExpanded ? 1 : 0,
                transition: 'all 0.3s ease-out',
                fontSize: '0.9rem',
                lineHeight: '1.2',
                cursor: isListening ? 'not-allowed' : 'text',
              }}
              className="placeholder:text-white placeholder:text-opacity-80"
            />

            {/* Enhanced Voice Search Button */}
            {voiceSupported && isSearchExpanded && (
              <button
                onClick={handleVoiceSearch}
                style={{
                  background: isListening 
                    ? (aiSpeaking ? 'rgba(99, 91, 255, 0.3)' : 'rgba(255, 71, 87, 0.3)') 
                    : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: isListening 
                    ? (aiSpeaking ? '#635bff' : '#ff4757') 
                    : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  transition: 'all 0.3s ease',
                  animation: isListening ? 'pulse 1.5s infinite' : 'none',
                  position: 'relative',
                }}
                className="hover:bg-white hover:bg-opacity-10"
                title={isListening ? "Stop AI assistant" : "Start AI voice assistant (Indian Accent Supported)"}
                aria-label={isListening ? "Stop AI assistant" : "Start AI assistant"}
              >
                {isListening ? (
                  aiSpeaking ? <IoMdMic size={20} /> : <IoMdMic size={20} />
                ) : (
                  <IoMdMic size={20} />
                )}
                
                {/* Listening indicator */}
                {isListening && (
                  <span style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: aiSpeaking ? '#635bff' : '#ff4757',
                    animation: 'blink 1s infinite',
                  }} />
                )}
              </button>
            )}

            {/* Voice Status Indicator */}
            {isListening && voiceMessage && (
              <div className="voice-status-indicator">
                <span style={{
                  fontSize: '1.2rem',
                  animation: 'pulse 1.5s infinite',
                }}>
                  {aiSpeaking ? '🤖' : '🎤'}
                </span>
                <span style={{
                  fontSize: '0.85rem',
                  color: aiSpeaking ? '#635bff' : '#ff4757',
                  fontWeight: '500',
                }}>
                  {voiceMessage}
                </span>
                <div className="voice-wave">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="wave-bar"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

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
                marginTop: voiceMessage ? '4rem' : '0.75rem',
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
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span>Quick Navigation</span>
                  {voiceSupported && (
                    <span style={{
                      fontSize: '0.7rem',
                      color: '#635bff',
                      backgroundColor: '#f0f2ff',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}>
                      🎤 AI Voice Search
                      {/* <span style={{
                        fontSize: '0.6rem',
                        color: '#ff4757',
                        marginLeft: '0.25rem',
                      }}>
                        (Indian Accent)
                      </span> */}
                    </span>
                  )}
                </div>
                
                {/* Indian Accent Tips */}
                {voiceSupported && (
                  <div style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#f8fbff',
                    borderBottom: '1px solid #e8f0fe',
                    fontSize: '0.75rem',
                    color: '#635bff',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      
                    </div>
                  </div>
                )}
                
                {searchResults.map((item, index) => {
                  const IconComponent = getIconComponent(item.icon);

                  return (
                    <div
                      key={index}
                      onClick={() => handleSearchResultClick(item.path)}
                      style={{
                        padding: '0.4rem 1rem',
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

            {showSearchResults && searchResults.length === 0 && searchQuery.length > 0 && isSearchExpanded && !isListening && (
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
                No results found for `{searchQuery}`
                <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>
                  Try different keywords or use AI voice assistant with Indian accent support 🤖
                </div>
                {voiceSupported && (
                  <button
                    onClick={handleVoiceSearch}
                    style={{
                      marginTop: '1rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#635bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      margin: '1rem auto 0',
                    }}
                  >
                    <IoMdMic size={16} />
                    Try Voice Search (Indian Accent Supported)
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Company and Branch Name Display - ONLY for Desktop */}
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
      maxWidth: '350px',
      flexShrink: 0,
    }}
  >
    {companyName && (
      <span
        style={{
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: '0.85rem',
          lineHeight: '1.3',
          whiteSpace: 'nowrap',
          fontWeight: '500',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          width: '100%',
        }}
        title={`${companyName}${clientId ? ` (${clientId})` : ''}`}
      >
        {/* {companyName}{clientId && <span style={{ fontWeight: '600',fontSize: '1rem', color: 'rgba(255, 255, 255, 1)' }}> ({clientId})</span>} */}
      </span>
    )}
    {branchName && (
      <span
        style={{
          color: 'rgba(255, 255, 255, 0.95)',
          fontSize: '1rem',
          lineHeight: '1.3',
          marginTop: '0.2rem',
          whiteSpace: 'nowrap',
          fontWeight: '600',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          width: '100%',
        }}
        title={branchName}
      >
        {companyName}{clientId && <span style={{ fontWeight: '600',fontSize: '1rem', color: 'rgba(255, 255, 255, 1)' }}> ({clientId})</span>}
      </span>
    )}
  </div>
)}
        </div>

        <div className="flex items-center gap-2 md:gap-3" style={{ flexShrink: 0 }}>
          {/* Recently Visited Button */}
          <div ref={recentlyVisitedRef} style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setIsRecentlyVisitedOpen(!isRecentlyVisitedOpen);
                setIsNotificationsOpen(false);
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
              title={`Recently Visited (${recentPaths.length})`}
            >
              <IoIosTime size={20} />
              {recentPaths.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  backgroundColor: '#ff4757',
                  color: 'white',
                  borderRadius: '50%',
                  width: '15px',
                  height: '15px',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {recentPaths.length}
                </span>
              )}
            </button>

           {isRecentlyVisitedOpen && (
  <div style={{
    position: 'absolute',
    top: '100%',
    right: isMobile ? '0' : 0,
    left: isMobile ? '0' : 'auto',
    backgroundColor: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: isMobile ? '8px' : '12px',
    width: isMobile ? '250px' : '320px',
    maxHeight: isMobile ? '50vh' : '400px',
    zIndex: 1000,
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
    marginTop: '0.5rem',
    marginRight: isMobile ? '0.5rem' : '0',
  }}>
    <div style={{
      padding: isMobile ? '0.6rem 0.75rem' : '1rem',
      borderBottom: '1px solid #f0f0f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '0.5rem',
    }}>
      <span style={{ 
        fontWeight: '600', 
        color: '#333',
        fontSize: isMobile ? '0.85rem' : '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
      }}>
        Recently Visited
        {recentPaths.length > 0 && (
          <span style={{
            fontSize: isMobile ? '0.65rem' : '0.8rem',
            backgroundColor: '#635bff',
            color: 'white',
            padding: isMobile ? '0.15rem 0.4rem' : '0.2rem 0.5rem',
            borderRadius: '8px',
            fontWeight: '500',
          }}>
            {recentPaths.length}
          </span>
        )}
      </span>
      {recentPaths.length > 0 && (
        <button
          onClick={clearRecentPaths}
          style={{
            background: 'none',
            border: 'none',
            color: '#635bff',
            fontSize: isMobile ? '0.7rem' : '0.8rem',
            cursor: 'pointer',
            fontWeight: '500',
            padding: isMobile ? '0.2rem' : '0',
            whiteSpace: 'nowrap',
          }}
        >
          Clear All
        </button>
      )}
    </div>

    <div style={{ 
      maxHeight: isMobile ? 'calc(50vh - 100px)' : '300px', 
      overflowY: 'auto',
      scrollbarWidth: isMobile ? 'none' : 'thin',
      msOverflowStyle: isMobile ? 'none' : 'auto',
    }}>
      {isMobile && (
        <style>
          {`
            @media (max-width: 768px) {
              div[style*="maxHeight"]::-webkit-scrollbar {
                display: none;
              }
            }
          `}
        </style>
      )}
      {recentPaths.length > 0 ? (
        recentPaths.map((item, index) => (
          <div
            key={item.id}
            style={{
              padding: isMobile ? '0.5rem 0.6rem' : '0.75rem 1rem',
              borderBottom: index < recentPaths.length - 1 ? '1px solid #f8f8f8' : 'none',
              cursor: 'pointer',
              backgroundColor: '#fff',
              transition: 'background-color 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.4rem',
            }}
            className="hover:bg-gray-50"
            onClick={() => handleRecentPathClick(item.path)}
            title={`Click to open "${item.name}" in new tab`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.4rem' : '0.75rem', flex: 1, minWidth: 0 }}>
              <div style={{
                width: isMobile ? '20px' : '28px',
                height: isMobile ? '20px' : '28px',
                borderRadius: isMobile ? '4px' : '6px',
                backgroundColor: '#f0f2ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#635bff',
                fontSize: isMobile ? '0.65rem' : '0.8rem',
                fontWeight: '600',
                flexShrink: 0,
              }}>
                {index + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: isMobile ? '0.75rem' : '0.9rem',
                  color: '#333',
                  fontWeight: '500',
                  lineHeight: '1.3',
                  marginBottom: isMobile ? '0.15rem' : '0.2rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {item.name}
                </div>
                <div style={{
                  fontSize: isMobile ? '0.65rem' : '0.7rem',
                  color: '#999',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}>
                  <span style={{
                    fontSize: isMobile ? '0.6rem' : '0.65rem',
                    color: '#635bff',
                    backgroundColor: '#f0f2ff',
                    padding: isMobile ? '0.05rem 0.3rem' : '0.1rem 0.4rem',
                    borderRadius: '3px',
                    fontWeight: '500',
                  }}>
                    New Tab
                  </span>
                  <span>•</span>
                  <span>{formatTimeAgo(item.timestamp)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeRecentPath(item.id);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#999',
                cursor: 'pointer',
                fontSize: isMobile ? '1.1rem' : '1.4rem',
                padding: isMobile ? '0.15rem' : '0.25rem',
                borderRadius: '4px',
                transition: 'all 0.2s ease',
                flexShrink: 0,
                lineHeight: '1',
              }}
              className="hover:bg-gray-100 hover:text-red-500"
              title="Remove"
            >
              ×
            </button>
          </div>
        ))
      ) : (
        <div style={{
          padding: isMobile ? '1.5rem 0.75rem' : '2rem 1rem',
          textAlign: 'center',
          color: '#999',
          fontSize: isMobile ? '0.8rem' : '0.9rem',
        }}>
          <div style={{ fontSize: isMobile ? '1.5rem' : '2rem', marginBottom: '0.4rem', color: '#ccc' }}>
            <IoIosTime />
          </div>
          No recent visits
          <div style={{ fontSize: isMobile ? '0.7rem' : '0.8rem', color: '#ccc', marginTop: '0.4rem' }}>
            Visit pages to see them here
          </div>
        </div>
      )}
    </div>
    
    {recentPaths.length > 0 && (
      <div style={{
        padding: isMobile ? '0.5rem 0.6rem' : '0.75rem 1rem',
        borderTop: '1px solid #f0f0f0',
        fontSize: isMobile ? '0.65rem' : '0.75rem',
        color: '#999',
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
        borderBottomLeftRadius: isMobile ? '8px' : '12px',
        borderBottomRightRadius: isMobile ? '8px' : '12px',
      }}>
        <span style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '0.25rem',
        }}>
          <span style={{ color: '#635bff' }}>ℹ️</span>
          Click to open in new tab
        </span>
      </div>
    )}
  </div>
)}
          </div>

          {/* <button
  onClick={() => setIsAIToolOpen(true)}
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
  title="AI Financial Analyst Pro"
  aria-label="Open AI Financial Tool"
>
  <FaRobot size={20} />
</button>
{isAIToolOpen && (
  <AIReportingTool onClose={() => setIsAIToolOpen(false)} />
)} */}

          {/* Pinned Modules */}
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

          {/* Analytics */}
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

           {/* <Tooltip title="Flow Diagram Builder">
          <button
            onClick={handleFlowDiagramClick}
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
            }}
            className="hover:bg-white hover:bg-opacity-10 active:bg-opacity-20"
            aria-label="Flow Diagram Builder"
          >
            <BackupTableIcon style={{ fontSize: '20px' }} />
          </button>
        </Tooltip> */}

          {/* Notifications */}
          <div ref={notificationsRef} style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                setIsRecentlyVisitedOpen(false);
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
    right: isMobile ? '0' : 0,
    left: isMobile ? '-100px' : 'auto',
    backgroundColor: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: isMobile ? '8px' : '12px',
    width: isMobile ? '230px' : '320px',
    maxHeight: isMobile ? '50vh' : '400px',
    zIndex: 1000,
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
    marginTop: '0.5rem',
    marginRight: isMobile ? '0.5rem' : '0',
  }}>
    <div style={{
      padding: isMobile ? '0.6rem 0.75rem' : '1rem',
      borderBottom: '1px solid #f0f0f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <span style={{ 
        fontWeight: '600', 
        color: '#333',
        fontSize: isMobile ? '0.85rem' : '1rem',
      }}>
        Notifications
      </span>
      {notifications.length > 0 && (
        <button
          onClick={clearAllNotifications}
          style={{
            background: 'none',
            border: 'none',
            color: '#635bff',
            fontSize: isMobile ? '0.7rem' : '0.8rem',
            cursor: 'pointer',
            fontWeight: '500',
            whiteSpace: 'nowrap',
          }}
        >
          Clear All
        </button>
      )}
    </div>

    <div style={{ 
      maxHeight: isMobile ? 'calc(50vh - 100px)' : '300px', 
      overflowY: 'auto',
      scrollbarWidth: isMobile ? 'none' : 'thin',
      msOverflowStyle: isMobile ? 'none' : 'auto',
    }}>
      {isMobile && (
        <style>
          {`
            @media (max-width: 768px) {
              div[style*="maxHeight"]::-webkit-scrollbar {
                display: none;
              }
            }
          `}
        </style>
      )}
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div
            key={notification.id}
            style={{
              padding: isMobile ? '0.6rem 0.7rem' : '0.875rem 1rem',
              borderBottom: '1px solid #f8f8f8',
              cursor: 'pointer',
              backgroundColor: notification.read ? '#fff' : '#f8fbff',
              transition: 'background-color 0.2s ease',
            }}
            className="hover:bg-gray-50"
            onClick={() => markNotificationAsRead(notification.id)}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: isMobile ? '0.4rem' : '0.75rem' }}>
              <span style={{ fontSize: isMobile ? '0.9rem' : '1.2rem', flexShrink: 0, lineHeight: '1' }}>
                {getNotificationIcon(notification.type)}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: isMobile ? '0.75rem' : '0.9rem',
                  color: '#333',
                  fontWeight: notification.read ? '400' : '500',
                  lineHeight: '1.3',
                  wordBreak: 'break-word',
                }}>
                  {notification.text}
                </div>
                <div style={{
                  fontSize: isMobile ? '0.65rem' : '0.75rem',
                  color: '#999',
                  marginTop: isMobile ? '0.2rem' : '0.25rem',
                }}>
                  {notification.time}
                </div>
              </div>
              {!notification.read && (
                <div style={{
                  width: isMobile ? '5px' : '8px',
                  height: isMobile ? '5px' : '8px',
                  borderRadius: '50%',
                  backgroundColor: '#635bff',
                  marginTop: '0.4rem',
                  flexShrink: 0,
                }} />
              )}
            </div>
          </div>
        ))
      ) : (
        <div style={{
          padding: isMobile ? '1.5rem 0.75rem' : '2rem 1rem',
          textAlign: 'center',
          color: '#999',
          fontSize: isMobile ? '0.8rem' : '0.9rem',
        }}>
          No notifications
        </div>
      )}
    </div>
  </div>
)}
          </div>

          {/* User Profile Dropdown */}
          <div
            ref={dropdownRef}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '0.5rem' : '0.75rem',
              cursor: 'pointer',
              position: 'relative',
              padding: '0.25rem 0.5rem',
              borderRadius: '2rem',
              transition: 'background-color 0.2s ease',
              flexShrink: 0,
            }}
            className="hover:bg-white hover:bg-opacity-10"
            onClick={() => {
              setIsDropdownOpen(!isDropdownOpen);
              setIsNotificationsOpen(false);
              setIsRecentlyVisitedOpen(false);
            }}
          >
            <div
              style={{
                width: isMobile ? '32px' : '36px',
                height: isMobile ? '32px' : '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                fontSize: isMobile ? '0.8rem' : '0.9rem',
                transition: 'all 0.2s ease',
              }}
              className="hover:bg-opacity-30"
            >
              {getInitial(userName)}
            </div>

            {/* User name और role - Desktop view में */}
            {!isMobile && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                lineHeight: '1.3',
                maxWidth: '150px',
              }}>
                <span style={{
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {userName || 'User'}
                  {userRole && (
                    <span style={{
                      marginLeft: '4px',
                      fontWeight: '500',
                      color: 'rgba(255, 255, 255, 0.85)',
                      fontSize: '0.8rem',
                      padding: '0.1rem 0.3rem',
                      borderRadius: '4px',
                    }}>
                      ({userRole})
                    </span>
                  )}
                </span>
              </div>
            )}

            {/* Mobile view में छोटा username */}
            {isMobile && userName && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                maxWidth: '80px',
              }}>
                <span style={{
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '0.8rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {userName.split(' ')[0] || 'User'}
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
              <path d="M3 4.5L6 7.5L9 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            {isDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                width: isMobile ? '160px' : '180px',
                zIndex: 1000,
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                marginTop: '0.15rem',
                overflow: 'hidden',
              }}>
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#f8fbff',
                  borderBottom: '1px solid #e8f0fe',
                }}>
                  <div style={{
                    fontWeight: '600',
                    color: '#333',
                    fontSize: '0.95rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {userName || 'User'}
                    {userRole && (
                      <span style={{
                        marginLeft: '0.4rem',
                        fontWeight: '500',
                        fontSize: '0.85rem',
                        color: '#635bff',
                      }}>
                        ({userRole})
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ padding: '0.1rem 0' }}>
                  <button
                    onClick={handleProfile}
                    style={{
                      width: '100%',
                      padding: '0.3rem 1rem',
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
                      padding: '0.3rem 1rem',
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
                  
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      padding: '0.3rem 1rem',
                      marginBottom:'3px',
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
    </>
  );
};

export default Header;