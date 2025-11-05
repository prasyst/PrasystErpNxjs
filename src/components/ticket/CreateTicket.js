// "use client"
// import React, { useState } from 'react';
// import { 
//   MdAdd, MdClose, MdAttachFile, MdSend, MdPerson, 
//   MdCategory, MdPriorityHigh, MdDescription, MdArrowBack
// } from 'react-icons/md';
// import { useRouter } from 'next/navigation';

// const CreateTicketPage = () => {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     category: '',
//     priority: 'Medium',
//     assignee: '',
//     dueDate: '',
//     tags: []
//   });
//   const [tagInput, setTagInput] = useState('');
//   const [attachments, setAttachments] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Default data
//   const categories = [
//     { id: 1, name: 'Technical', description: 'Technical issues and bugs', color: '#ef4444', active: true },
//     { id: 2, name: 'Account', description: 'Account related issues', color: '#3b82f6', active: true },
//     { id: 3, name: 'Billing', description: 'Billing and payment issues', color: '#8b5cf6', active: true },
//     { id: 4, name: 'Feature Request', description: 'New feature requests', color: '#10b981', active: true }
//   ];

//   const priorities = [
//     { id: 1, name: 'Low', color: '#10b981', responseTime: 72, resolutionTime: 168 },
//     { id: 2, name: 'Medium', color: '#f59e0b', responseTime: 24, resolutionTime: 72 },
//     { id: 3, name: 'High', color: '#ef4444', responseTime: 4, resolutionTime: 24 }
//   ];

//   const teams = [
//     { id: 1, name: 'Technical Support', members: ['John Doe', 'Jane Smith'] },
//     { id: 2, name: 'Billing Team', members: ['Mike Wilson', 'Sarah Davis'] }
//   ];

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Yahan aap API call kar sakte hain
//       console.log('Ticket created:', formData);
      
//       // Success ke baad dashboard par redirect karein
//       setTimeout(() => {
//         router.push('/ticket-dashboard');
//       }, 1000);
      
//     } catch (error) {
//       console.error('Error creating ticket:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddTag = () => {
//     if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
//       setFormData(prev => ({
//         ...prev,
//         tags: [...prev.tags, tagInput.trim()]
//       }));
//       setTagInput('');
//     }
//   };

//   const handleRemoveTag = (tagToRemove) => {
//     setFormData(prev => ({
//       ...prev,
//       tags: prev.tags.filter(tag => tag !== tagToRemove)
//     }));
//   };

//   const handleFileUpload = (e) => {
//     const files = Array.from(e.target.files);
//     setAttachments(prev => [...prev, ...files]);
//   };

//   const handleRemoveAttachment = (index) => {
//     setAttachments(prev => prev.filter((_, i) => i !== index));
//   };

//   return (
//     <div style={{ 
//       minHeight: '100vh', 
//       backgroundColor: '#f9fafb',
//       fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
//     }}>
//       {/* Header */}
//       <div style={{
//         backgroundColor: 'white',
//         boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
//         borderBottom: '1px solid #e5e7eb'
//       }}>
//         <div style={{ 
//           maxWidth: '800px', 
//           margin: '0 auto', 
//           padding: '0 1rem'
//         }}>
//           <div style={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             padding: '1rem 0'
//           }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
//               <button
//                 onClick={() => router.push('/tickets/ticket-dashboard/')}
//                 style={{
//                   padding: '0.5rem',
//                   borderRadius: '0.375rem',
//                   border: 'none',
//                   backgroundColor: 'transparent',
//                   cursor: 'pointer',
//                   color: '#6b7280',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '0.5rem'
//                 }}
//               >
//                 <MdArrowBack size={20} />
//               </button>
//               <div>
//                 <h1 style={{ 
//                   fontSize: '1.5rem', 
//                   fontWeight: 'bold', 
//                   color: '#111827',
//                   margin: 0
//                 }}>
//                   Create New Ticket
//                 </h1>
//                 <p style={{ 
//                   color: '#6b7280',
//                   margin: '0.25rem 0 0 0',
//                   fontSize: '0.875rem'
//                 }}>
//                   Fill in the details to create a new support ticket
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Form */}
//       <div style={{ 
//         maxWidth: '800px', 
//         margin: '0 auto', 
//         padding: '2rem 1rem'
//       }}>
//         <div style={{
//           backgroundColor: 'white',
//           borderRadius: '0.75rem',
//           boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
//           border: '1px solid #e5e7eb',
//           overflow: 'hidden'
//         }}>
//           <form onSubmit={handleSubmit}>
//             <div style={{ padding: '2rem' }}>
              
//               {/* Title */}
//               <div style={{ marginBottom: '1.5rem' }}>
//                 <label style={{
//                   display: 'block',
//                   fontSize: '0.875rem',
//                   fontWeight: '500',
//                   color: '#374151',
//                   marginBottom: '0.5rem'
//                 }}>
//                   Title *
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.title}
//                   onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
//                   placeholder="Enter ticket title..."
//                   style={{
//                     width: '100%',
//                     padding: '0.75rem',
//                     border: '1px solid #d1d5db',
//                     borderRadius: '0.5rem',
//                     fontSize: '0.875rem'
//                   }}
//                 />
//               </div>

//               {/* Description */}
//               <div style={{ marginBottom: '1.5rem' }}>
//                 <label style={{
//                   display: 'block',
//                   fontSize: '0.875rem',
//                   fontWeight: '500',
//                   color: '#374151',
//                   marginBottom: '0.5rem'
//                 }}>
//                   Description *
//                 </label>
//                 <textarea
//                   required
//                   value={formData.description}
//                   onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
//                   placeholder="Describe the issue or request..."
//                   rows="6"
//                   style={{
//                     width: '100%',
//                     padding: '0.75rem',
//                     border: '1px solid #d1d5db',
//                     borderRadius: '0.5rem',
//                     fontSize: '0.875rem',
//                     resize: 'vertical',
//                     minHeight: '120px'
//                   }}
//                 />
//               </div>

//               {/* Category and Priority */}
//               <div style={{ 
//                 display: 'grid', 
//                 gridTemplateColumns: '1fr 1fr', 
//                 gap: '1rem',
//                 marginBottom: '1.5rem'
//               }}>
//                 <div>
//                   <label style={{
//                     display: 'block',
//                     fontSize: '0.875rem',
//                     fontWeight: '500',
//                     color: '#374151',
//                     marginBottom: '0.5rem'
//                   }}>
//                     Category *
//                   </label>
//                   <select
//                     required
//                     value={formData.category}
//                     onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
//                     style={{
//                       width: '100%',
//                       padding: '0.75rem',
//                       border: '1px solid #d1d5db',
//                       borderRadius: '0.5rem',
//                       fontSize: '0.875rem'
//                     }}
//                   >
//                     <option value="">Select Category</option>
//                     {categories.map(category => (
//                       <option key={category.id} value={category.name}>
//                         {category.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label style={{
//                     display: 'block',
//                     fontSize: '0.875rem',
//                     fontWeight: '500',
//                     color: '#374151',
//                     marginBottom: '0.5rem'
//                   }}>
//                     Priority *
//                   </label>
//                   <select
//                     required
//                     value={formData.priority}
//                     onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
//                     style={{
//                       width: '100%',
//                       padding: '0.75rem',
//                       border: '1px solid #d1d5db',
//                       borderRadius: '0.5rem',
//                       fontSize: '0.875rem'
//                     }}
//                   >
//                     {priorities.map(priority => (
//                       <option key={priority.id} value={priority.name}>
//                         {priority.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               {/* Assignee and Due Date */}
//               <div style={{ 
//                 display: 'grid', 
//                 gridTemplateColumns: '1fr 1fr', 
//                 gap: '1rem',
//                 marginBottom: '1.5rem'
//               }}>
//                 <div>
//                   <label style={{
//                     display: 'block',
//                     fontSize: '0.875rem',
//                     fontWeight: '500',
//                     color: '#374151',
//                     marginBottom: '0.5rem'
//                   }}>
//                     Assignee
//                   </label>
//                   <select
//                     value={formData.assignee}
//                     onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
//                     style={{
//                       width: '100%',
//                       padding: '0.75rem',
//                       border: '1px solid #d1d5db',
//                       borderRadius: '0.5rem',
//                       fontSize: '0.875rem'
//                     }}
//                   >
//                     <option value="">Unassigned</option>
//                     {teams.flatMap(team => 
//                       team.members.map(member => (
//                         <option key={member} value={member}>
//                           {member} ({team.name})
//                         </option>
//                       ))
//                     )}
//                   </select>
//                 </div>

//                 <div>
//                   <label style={{
//                     display: 'block',
//                     fontSize: '0.875rem',
//                     fontWeight: '500',
//                     color: '#374151',
//                     marginBottom: '0.5rem'
//                   }}>
//                     Due Date
//                   </label>
//                   <input
//                     type="date"
//                     value={formData.dueDate}
//                     onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
//                     style={{
//                       width: '100%',
//                       padding: '0.75rem',
//                       border: '1px solid #d1d5db',
//                       borderRadius: '0.5rem',
//                       fontSize: '0.875rem'
//                     }}
//                   />
//                 </div>
//               </div>

//               {/* Tags */}
//               <div style={{ marginBottom: '1.5rem' }}>
//                 <label style={{
//                   display: 'block',
//                   fontSize: '0.875rem',
//                   fontWeight: '500',
//                   color: '#374151',
//                   marginBottom: '0.5rem'
//                 }}>
//                   Tags
//                 </label>
//                 <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
//                   {formData.tags.map((tag, index) => (
//                     <span
//                       key={index}
//                       style={{
//                         display: 'inline-flex',
//                         alignItems: 'center',
//                         padding: '0.25rem 0.5rem',
//                         backgroundColor: '#e5e7eb',
//                         color: '#374151',
//                         borderRadius: '0.375rem',
//                         fontSize: '0.75rem',
//                         fontWeight: '500'
//                       }}
//                     >
//                       {tag}
//                       <button
//                         type="button"
//                         onClick={() => handleRemoveTag(tag)}
//                         style={{
//                           marginLeft: '0.25rem',
//                           background: 'none',
//                           border: 'none',
//                           color: '#6b7280',
//                           cursor: 'pointer',
//                           padding: '0',
//                           display: 'flex',
//                           alignItems: 'center'
//                         }}
//                       >
//                         <MdClose size={14} />
//                       </button>
//                     </span>
//                   ))}
//                 </div>
//                 <div style={{ display: 'flex', gap: '0.5rem' }}>
//                   <input
//                     type="text"
//                     value={tagInput}
//                     onChange={(e) => setTagInput(e.target.value)}
//                     onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
//                     placeholder="Add tag..."
//                     style={{
//                       flex: 1,
//                       padding: '0.5rem',
//                       border: '1px solid #d1d5db',
//                       borderRadius: '0.375rem',
//                       fontSize: '0.875rem'
//                     }}
//                   />
//                   <button
//                     type="button"
//                     onClick={handleAddTag}
//                     style={{
//                       padding: '0.5rem 1rem',
//                       border: '1px solid #d1d5db',
//                       borderRadius: '0.375rem',
//                       backgroundColor: 'white',
//                       cursor: 'pointer',
//                       fontSize: '0.875rem',
//                       fontWeight: '500'
//                     }}
//                   >
//                     Add
//                   </button>
//                 </div>
//               </div>

//               {/* Attachments */}
//               <div style={{ marginBottom: '2rem' }}>
//                 <label style={{
//                   display: 'block',
//                   fontSize: '0.875rem',
//                   fontWeight: '500',
//                   color: '#374151',
//                   marginBottom: '0.5rem'
//                 }}>
//                   Attachments
//                 </label>
//                 <div style={{ 
//                   border: '2px dashed #d1d5db', 
//                   borderRadius: '0.5rem', 
//                   padding: '2rem', 
//                   textAlign: 'center',
//                   cursor: 'pointer'
//                 }}
//                 onClick={() => document.getElementById('file-upload').click()}
//                 >
//                   <input
//                     type="file"
//                     multiple
//                     onChange={handleFileUpload}
//                     style={{ display: 'none' }}
//                     id="file-upload"
//                   />
//                   <div style={{
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     gap: '0.5rem',
//                     color: '#6b7280'
//                   }}>
//                     <MdAttachFile size={40} />
//                     <span style={{ fontSize: '1rem', fontWeight: '500' }}>
//                       Click to upload or drag and drop
//                     </span>
//                     <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
//                       Maximum file size: 10MB
//                     </span>
//                   </div>
//                 </div>
                
//                 {/* Attachment list */}
//                 {attachments.length > 0 && (
//                   <div style={{ marginTop: '1rem' }}>
//                     <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
//                       Attached Files:
//                     </h4>
//                     {attachments.map((file, index) => (
//                       <div
//                         key={index}
//                         style={{
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'space-between',
//                           padding: '0.75rem',
//                           backgroundColor: '#f9fafb',
//                           borderRadius: '0.375rem',
//                           marginBottom: '0.5rem',
//                           border: '1px solid #e5e7eb'
//                         }}
//                       >
//                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//                           <MdAttachFile size={16} color="#6b7280" />
//                           <span style={{ fontSize: '0.875rem', color: '#374151' }}>
//                             {file.name}
//                           </span>
//                         </div>
//                         <button
//                           type="button"
//                           onClick={() => handleRemoveAttachment(index)}
//                           style={{
//                             background: 'none',
//                             border: 'none',
//                             color: '#ef4444',
//                             cursor: 'pointer',
//                             padding: '0.25rem',
//                             borderRadius: '0.25rem'
//                           }}
//                         >
//                           <MdClose size={16} />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Footer */}
//             <div style={{
//               padding: '1.5rem 2rem',
//               borderTop: '1px solid #e5e7eb',
//               backgroundColor: '#f9fafb',
//               display: 'flex',
//               justifyContent: 'flex-end',
//               gap: '1rem'
//             }}>
//               <button
//                 type="button"
//                 onClick={() => router.push('/ticket-dashboard')}
//                 style={{
//                   padding: '0.75rem 1.5rem',
//                   border: '1px solid #d1d5db',
//                   borderRadius: '0.5rem',
//                   backgroundColor: 'white',
//                   color: '#374151',
//                   cursor: 'pointer',
//                   fontSize: '0.875rem',
//                   fontWeight: '500'
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 style={{
//                   padding: '0.75rem 2rem',
//                   border: 'none',
//                   borderRadius: '0.5rem',
//                   backgroundColor: '#2563eb',
//                   color: 'white',
//                   cursor: loading ? 'not-allowed' : 'pointer',
//                   fontSize: '0.875rem',
//                   fontWeight: '500',
//                   opacity: loading ? 0.6 : 1,
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '0.5rem'
//                 }}
//               >
//                 <MdSend size={16} />
//                 {loading ? 'Creating Ticket...' : 'Create Ticket'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateTicketPage;



"use client"
import React, { useState, useRef, useEffect } from 'react';
import { 
  MdAdd, MdClose, MdAttachFile, MdSend, MdPerson, 
  MdCategory, MdPriorityHigh, MdDescription, MdArrowBack,
  MdQrCodeScanner, MdQrCode
} from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { Html5QrcodeScanner } from 'html5-qrcode';

const CreateTicketPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium',
    assignee: '',
    dueDate: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [qrScanner, setQrScanner] = useState(null);
  const scannerRef = useRef(null);

  const categories = [
    { id: 1, name: 'Technical', description: 'Technical issues and bugs', color: '#ef4444', active: true },
    { id: 2, name: 'Account', description: 'Account related issues', color: '#3b82f6', active: true },
    { id: 3, name: 'Billing', description: 'Billing and payment issues', color: '#8b5cf6', active: true },
    { id: 4, name: 'Feature Request', description: 'New feature requests', color: '#10b981', active: true }
  ];

  const priorities = [
    { id: 1, name: 'Low', color: '#10b981', responseTime: 72, resolutionTime: 168 },
    { id: 2, name: 'Medium', color: '#f59e0b', responseTime: 24, resolutionTime: 72 },
    { id: 3, name: 'High', color: '#ef4444', responseTime: 4, resolutionTime: 24 }
  ];

  const teams = [
    { id: 1, name: 'Technical Support', members: ['John Doe', 'Jane Smith'] },
    { id: 2, name: 'Billing Team', members: ['Mike Wilson', 'Sarah Davis'] }
  ];

  useEffect(() => {
    if (showQRScanner && scannerRef.current) {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          qrbox: {
            width: 250,
            height: 250,
          },
          fps: 5,
        },
        false
      );

      scanner.render(
        (decodedText) => {
          handleQRScanSuccess(decodedText);
          stopQRScanner();
        },
        (error) => {
          console.log("QR Scan error:", error);
        }
      );

      setQrScanner(scanner);
    }

    return () => {
      if (qrScanner) {
        qrScanner.clear().catch(error => {
          console.error("Failed to clear QR scanner:", error);
        });
      }
    };
  }, [showQRScanner]);

  const stopQRScanner = () => {
    if (qrScanner) {
      qrScanner.clear().catch(error => {
        console.error("Failed to clear QR scanner:", error);
      });
      setQrScanner(null);
    }
    setShowQRScanner(false);
  };

  const handleQRScanSuccess = (decodedText) => {
    try {
      const qrData = JSON.parse(decodedText);
      const updatedFormData = { ...formData };
      
      if (qrData.title) updatedFormData.title = qrData.title;
      if (qrData.description) updatedFormData.description = qrData.description;
      if (qrData.category) updatedFormData.category = qrData.category;
      if (qrData.priority) updatedFormData.priority = qrData.priority;
      if (qrData.tags && Array.isArray(qrData.tags)) {
        updatedFormData.tags = [...new Set([...formData.tags, ...qrData.tags])];
      }
      if (qrData.dueDate) updatedFormData.dueDate = qrData.dueDate;
      

      alert('QR code scanned successfully! Form data has been auto-filled.');
      
    } catch (error) {
      console.log("QR code doesn't contain JSON, using as title:", decodedText);

      setFormData(prev => ({
        ...prev,
        title: decodedText.length > 50 ? decodedText.substring(0, 50) + '...' : decodedText,
        description: decodedText,
        category: 'Technical',
        tags: ['QR-Scanned', ...prev.tags] 
      }));
      
      alert('QR code scanned! Basic information has been auto-filled.');
    }
  };

  const generateSampleQRData = () => {
    const sampleData = {
      title: "Printer Not Working - Floor 3",
      description: "The color printer on floor 3 is not responding to print jobs. Shows error light.",
      category: "Technical",
      priority: "High",
      tags: ["Hardware", "Printer", "Urgent"],
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] 
    };

    handleQRScanSuccess(JSON.stringify(sampleData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      //  API call
      console.log('Ticket created:', formData);
      
      setTimeout(() => {
        router.push('/ticket-dashboard');
      }, 1000);
      
    } catch (error) {
      console.error('Error creating ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const handleRemoveAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f9fafb',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>

      <div style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          padding: '0 1rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={() => router.push('/tickets/ticket-dashboard/')}
                style={{
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  color: '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <MdArrowBack size={20} />
              </button>
              <div>
                <h1 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  color: '#111827',
                  margin: 0
                }}>
                  Create New Ticket
                </h1>
                <p style={{ 
                  color: '#6b7280',
                  margin: '0.25rem 0 0 0',
                  fontSize: '0.875rem'
                }}>
                  Fill in the details to create a new support ticket
                </p>
              </div>
            </div>
            
            {/* QR Code Scanner Button */}
            <button
              onClick={() => setShowQRScanner(true)}
              style={{
                padding: '0.75rem 1rem',
                border: 'none',
                borderRadius: '0.5rem',
                backgroundColor: '#10b981',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <MdQrCodeScanner size={18} />
              Scan QR Code
            </button>
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center'
          }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              color: '#111827',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              <MdQrCodeScanner size={24} />
              Scan QR Code
            </h2>
            
            <div 
              id="qr-reader"
              ref={scannerRef}
              style={{
                width: '100%',
                margin: '1rem 0'
              }}
            />
            
            <p style={{ 
              color: '#6b7280',
              marginBottom: '1.5rem',
              fontSize: '0.875rem'
            }}>
              Point your camera at a QR code to automatically fill the form
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={stopQRScanner}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  backgroundColor: 'white',
                  color: '#374151',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
              
              {/* Demo button for testing without QR code */}
              <button
                onClick={generateSampleQRData}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Use Demo Data
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '2rem 1rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ padding: '2rem' }}>
              
           
              {formData.title && (
                <div style={{
                  padding: '0.75rem',
                  backgroundColor: '#dbeafe',
                  border: '1px solid #93c5fd',
                  borderRadius: '0.5rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <MdQrCode size={18} color="#2563eb" />
                  <span style={{ fontSize: '0.875rem', color: '#1e40af' }}>
                    Form data loaded from QR code scan
                  </span>
                </div>
              )}
              
              {/* Title */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter ticket title..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              {/* Description */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the issue or request..."
                  rows="6"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    resize: 'vertical',
                    minHeight: '120px'
                  }}
                />
              </div>

              {/* Category and Priority */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Priority *
                  </label>
                  <select
                    required
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    {priorities.map(priority => (
                      <option key={priority.id} value={priority.name}>
                        {priority.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Assignee and Due Date */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Assignee
                  </label>
                  <select
                    value={formData.assignee}
                    onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    <option value="">Unassigned</option>
                    {teams.flatMap(team => 
                      team.members.map(member => (
                        <option key={member} value={member}>
                          {member} ({team.name})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
              </div>

              {/* Tags */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Tags
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.25rem 0.5rem',
                        backgroundColor: '#e5e7eb',
                        color: '#374151',
                        borderRadius: '0.375rem',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        style={{
                          marginLeft: '0.25rem',
                          background: 'none',
                          border: 'none',
                          color: '#6b7280',
                          cursor: 'pointer',
                          padding: '0',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <MdClose size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Add tag..."
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    style={{
                      padding: '0.5rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Attachments */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Attachments
                </label>
                <div style={{ 
                  border: '2px dashed #d1d5db', 
                  borderRadius: '0.5rem', 
                  padding: '2rem', 
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => document.getElementById('file-upload').click()}
                >
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    id="file-upload"
                  />
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#6b7280'
                  }}>
                    <MdAttachFile size={40} />
                    <span style={{ fontSize: '1rem', fontWeight: '500' }}>
                      Click to upload or drag and drop
                    </span>
                    <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                      Maximum file size: 10MB
                    </span>
                  </div>
                </div>
                
                {/* Attachment list */}
                {attachments.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Attached Files:
                    </h4>
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.75rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '0.375rem',
                          marginBottom: '0.5rem',
                          border: '1px solid #e5e7eb'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <MdAttachFile size={16} color="#6b7280" />
                          <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                            {file.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(index)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            borderRadius: '0.25rem'
                          }}
                        >
                          <MdClose size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: '1.5rem 2rem',
              borderTop: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1rem'
            }}>
              <button
                type="button"
                onClick={() => router.push('/ticket-dashboard')}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  backgroundColor: 'white',
                  color: '#374151',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '0.75rem 2rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  opacity: loading ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <MdSend size={16} />
                {loading ? 'Creating Ticket...' : 'Create Ticket'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTicketPage;