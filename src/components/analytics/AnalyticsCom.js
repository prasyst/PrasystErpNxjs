import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './AnalyticsCom.css'; 

const AnalyticsCom = () => {
  const [conversations, setConversations] = useState([]); 
  const [input, setInput] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const [excelData, setExcelData] = useState(null);
  const [fileName, setFileName] = useState("");
  const messagesEndRef = useRef(null); 

  useEffect(() => {
    scrollToBottom();
  }, [conversations]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getData = async (userMessage, fileData = null) => {
    setLoading(true);
    try {
      const requestData = {
        message: userMessage,
        ...(fileData && { excelData: fileData })
      };

      const response = await axios.post('https://apifreellm.com/api/chat', requestData);

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.data.response,
        timestamp: new Date().toLocaleTimeString(),
        ...(fileData && { hasExcelData: true })
      };
      
      setConversations(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error fetching data:', error);
      const errorMessage = {
        id: Date.now() + 2,
        type: 'error',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toLocaleTimeString()
      };
      setConversations(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() && !excelData) return;

    const userMessage = {
      id: Date.now() + 3,
      type: 'user',
      content: input || `Analyze the uploaded Excel file: ${fileName}`,
      timestamp: new Date().toLocaleTimeString(),
      ...(excelData && { hasExcelData: true, fileName: fileName })
    };

    setConversations(prev => [...prev, userMessage]);
 
    const userInput = input || `Please analyze this Excel file and provide insights about the data.`;
    getData(userInput, excelData);
    
    setInput(""); 
    setExcelData(null);
    setFileName("");
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
      alert('Please upload a valid Excel file (.xlsx, .xls, .csv)');
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const excelJson = {};
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        excelJson[sheetName] = jsonData;
      });

      setExcelData(excelJson);

      const uploadMessage = {
        id: Date.now() + 4, // FIXED: Added + 4
        type: 'system',
        content: `Excel file "${file.name}" uploaded successfully. You can now ask questions about the data.`,
        timestamp: new Date().toLocaleTimeString(),
        fileName: file.name
      };
      
      setConversations(prev => [...prev, uploadMessage]);
    };

    reader.readAsArrayBuffer(file);
    event.target.value = ''; 
  };

  const clearChat = () => {
    setConversations([]);
    setExcelData(null);
    setFileName("");
  };

  const removeExcelFile = () => {
    setExcelData(null);
    setFileName("");
    
    const removeMessage = {
      id: Date.now() + 5, // FIXED: Added + 5
      type: 'system',
      content: 'Excel file removed.',
      timestamp: new Date().toLocaleTimeString()
    };
    
    setConversations(prev => [...prev, removeMessage]);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>AI Chat Assistant with Excel Analysis</h1>
        <button onClick={clearChat} className="clear-btn">
          Clear Chat
        </button>
      </div>

      <div className="chat-messages">
        {conversations.length === 0 ? (
          <div className="empty-state">
            <div className="welcome-icon">📊</div>
            <h3>Welcome to AI Data Analyst!</h3>
            <p>Upload an Excel file and ask questions about your data, or start a regular conversation.</p>
          </div>
        ) : (
          conversations.map((message) => (
            <div
              key={message.id}
              className={`message ${message.type === 'user' ? 'user-message' : 
                         message.type === 'system' ? 'system-message' : 
                         message.type === 'error' ? 'error-message' : 'ai-message'}`}
            >
              <div className="message-content">
                <div className="message-header">
                  <span className="sender">
                    {message.type === 'user' ? 'You' : 
                     message.type === 'system' ? 'System' :
                     message.type === 'error' ? 'Error' : 'AI Assistant'}
                  </span>
                  <span className="timestamp">{message.timestamp}</span>
                </div>
                <div className="message-text">
                  {message.content}
                  {message.fileName && (
                    <div className="file-indicator">
                      📊 {message.fileName}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        
        {loading && (
          <div className="message ai-message">
            <div className="message-content">
              <div className="message-header">
                <span className="sender">AI Assistant</span>
                <span className="timestamp">Analyzing...</span>
              </div>
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {excelData && (
        <div className="excel-preview">
          <div className="excel-header">
            <span>📊 {fileName}</span>
            <button onClick={removeExcelFile} className="remove-file-btn">
              ×
            </button>
          </div>
          <div className="excel-info">
            <small>
              Sheets: {Object.keys(excelData).join(', ')} | 
              Ready for analysis
            </small>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="chat-input-form">
        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={excelData ? 
              "Ask questions about your Excel data..." : 
              "Type your message or upload an Excel file..."}
            disabled={loading}
            className="chat-input"
          />
 
          <label htmlFor="file-upload" className="file-upload-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />

          <button 
            type="submit" 
            disabled={loading || (!input.trim() && !excelData)}
            className="send-button"
          >
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnalyticsCom;