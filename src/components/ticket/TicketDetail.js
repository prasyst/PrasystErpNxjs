import React, { useState } from 'react';
import {useTicket} from '../../../src/app/context/TicketContext'
import { 
  MdClose, MdEdit, MdPerson, MdCategory, MdPriorityHigh, 
  MdSchedule, MdChat, MdAttachFile, MdCheck, MdRefresh,
  MdArrowBack, MdSend, MdAdd 
} from 'react-icons/md';

const TicketDetail = ({ ticket, onClose, onEdit }) => {
  const { updateTicketStatus, addComment, statuses, priorities, categories } = useTicket();
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStatusChange = async (newStatus) => {
    try {
      await updateTicketStatus(ticket.id, newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await addComment(ticket.id, {
        text: newComment,
        author: 'Current User', // In real app, get from auth context
        type: 'comment'
      });
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    const statusObj = statuses.find(s => s.name === status);
    return statusObj ? statusObj.color : '#9ca3af';
  };

  const getPriorityColor = (priority) => {
    const priorityObj = priorities.find(p => p.name === priority);
    return priorityObj ? priorityObj.color : '#9ca3af';
  };

  const getCategoryColor = (categoryName) => {
    const categoryObj = categories.find(c => c.name === categoryName);
    return categoryObj ? categoryObj.color : '#9ca3af';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (!ticket) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        width: '100%',
        maxWidth: '1000px',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={onClose}
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
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#111827',
                margin: 0,
                marginBottom: '0.25rem'
              }}>
                {ticket.title}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  backgroundColor: getStatusColor(ticket.status) + '20',
                  color: getStatusColor(ticket.status),
                  textTransform: 'capitalize'
                }}>
                  {ticket.status.replace('-', ' ')}
                </span>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {ticket.id} • Created {formatDate(ticket.createdAt)}
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => onEdit(ticket)}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                backgroundColor: 'white',
                color: '#374151',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <MdEdit size={16} />
              Edit
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '0.5rem',
                borderRadius: '0.375rem',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                color: '#6b7280'
              }}
            >
              <MdClose size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', display: 'flex' }}>
          {/* Main Content */}
          <div style={{ flex: 1, padding: '1.5rem' }}>
            
            {/* Description */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ 
                fontSize: '1rem', 
                fontWeight: '600', 
                color: '#111827',
                margin: '0 0 1rem 0'
              }}>
                Description
              </h3>
              <div style={{
                padding: '1rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb',
                fontSize: '0.875rem',
                lineHeight: '1.5',
                color: '#374151'
              }}>
                {ticket.description}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ 
                display: 'flex', 
                borderBottom: '1px solid #e5e7eb',
                marginBottom: '1rem'
              }}>
                <button
                  onClick={() => setActiveTab('details')}
                  style={{
                    padding: '0.75rem 1rem',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: activeTab === 'details' ? '#2563eb' : '#6b7280',
                    borderBottom: activeTab === 'details' ? '2px solid #2563eb' : '2px solid transparent',
                    marginBottom: '-1px'
                  }}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab('comments')}
                  style={{
                    padding: '0.75rem 1rem',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: activeTab === 'comments' ? '#2563eb' : '#6b7280',
                    borderBottom: activeTab === 'comments' ? '2px solid #2563eb' : '2px solid transparent',
                    marginBottom: '-1px'
                  }}
                >
                  Comments ({ticket.comments?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  style={{
                    padding: '0.75rem 1rem',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: activeTab === 'activity' ? '#2563eb' : '#6b7280',
                    borderBottom: activeTab === 'activity' ? '2px solid #2563eb' : '2px solid transparent',
                    marginBottom: '-1px'
                  }}
                >
                  Activity
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'details' && (
                <div>
                  {/* Ticket Information */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '1.5rem',
                    marginBottom: '2rem'
                  }}>
                    <div>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', margin: '0 0 0.5rem 0' }}>
                        Category
                      </h4>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        backgroundColor: getCategoryColor(ticket.category) + '20',
                        color: getCategoryColor(ticket.category)
                      }}>
                        {ticket.category}
                      </span>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', margin: '0 0 0.5rem 0' }}>
                        Priority
                      </h4>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        backgroundColor: getPriorityColor(ticket.priority) + '20',
                        color: getPriorityColor(ticket.priority)
                      }}>
                        {ticket.priority}
                      </span>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', margin: '0 0 0.5rem 0' }}>
                        Assignee
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MdPerson size={16} color="#6b7280" />
                        <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                          {ticket.assignee || 'Unassigned'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', margin: '0 0 0.5rem 0' }}>
                        Reporter
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MdPerson size={16} color="#6b7280" />
                        <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                          {ticket.reporter}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', margin: '0 0 0.5rem 0' }}>
                        Due Date
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MdSchedule size={16} color="#6b7280" />
                        <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                          {ticket.dueDate ? new Date(ticket.dueDate).toLocaleDateString() : 'Not set'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', margin: '0 0 0.5rem 0' }}>
                        Last Updated
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MdRefresh size={16} color="#6b7280" />
                        <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                          {formatDate(ticket.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  {ticket.tags && ticket.tags.length > 0 && (
                    <div>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', margin: '0 0 0.5rem 0' }}>
                        Tags
                      </h4>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {ticket.tags.map((tag, index) => (
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
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'comments' && (
                <div>
                  {/* Comments List */}
                  <div style={{ marginBottom: '2rem' }}>
                    {ticket.comments && ticket.comments.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {ticket.comments.map((comment) => (
                          <div
                            key={comment.id}
                            style={{
                              padding: '1rem',
                              backgroundColor: '#f9fafb',
                              borderRadius: '0.5rem',
                              border: '1px solid #e5e7eb'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                                  {comment.author}
                                </span>
                                <span style={{ 
                                  fontSize: '0.75rem', 
                                  color: '#6b7280',
                                  backgroundColor: '#e5e7eb',
                                  padding: '0.125rem 0.375rem',
                                  borderRadius: '0.375rem'
                                }}>
                                  {comment.type}
                                </span>
                              </div>
                              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                {formatDate(comment.createdAt)}
                              </span>
                            </div>
                            <p style={{ 
                              fontSize: '0.875rem', 
                              color: '#374151',
                              margin: 0,
                              lineHeight: '1.5'
                            }}>
                              {comment.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ 
                        textAlign: 'center', 
                        padding: '2rem', 
                        color: '#6b7280',
                        backgroundColor: '#f9fafb',
                        borderRadius: '0.5rem',
                        border: '1px dashed #d1d5db'
                      }}>
                        <MdChat size={32} style={{ margin: '0 auto 0.5rem', display: 'block', color: '#9ca3af' }} />
                        No comments yet. Start the conversation!
                      </div>
                    )}
                  </div>

                  {/* Add Comment Form */}
                  <form onSubmit={handleAddComment}>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '0.5rem'
                      }}>
                        Add Comment
                      </label>
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Type your comment here..."
                        rows="3"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          resize: 'vertical',
                          ':focus': {
                            outline: 'none',
                            borderColor: '#3b82f6'
                          }
                        }}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting || !newComment.trim()}
                      style={{
                        padding: '0.5rem 1.5rem',
                        border: 'none',
                        borderRadius: '0.5rem',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        cursor: isSubmitting || !newComment.trim() ? 'not-allowed' : 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        opacity: isSubmitting || !newComment.trim() ? 0.6 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <MdSend size={16} />
                      {isSubmitting ? 'Adding...' : 'Add Comment'}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'activity' && (
                <div>
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '2rem', 
                    color: '#6b7280',
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.5rem',
                    border: '1px dashed #d1d5db'
                  }}>
                    <MdRefresh size={32} style={{ margin: '0 auto 0.5rem', display: 'block', color: '#9ca3af' }} />
                    Activity log will be displayed here
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ 
            width: '300px', 
            borderLeft: '1px solid #e5e7eb',
            padding: '1.5rem',
            backgroundColor: '#f9fafb'
          }}>
            <h3 style={{ 
              fontSize: '1rem', 
              fontWeight: '600', 
              color: '#111827',
              margin: '0 0 1rem 0'
            }}>
              Quick Actions
            </h3>

            {/* Status Update */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', margin: '0 0 0.75rem 0' }}>
                Update Status
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {statuses.map((status) => (
                  <button
                    key={status.id}
                    onClick={() => handleStatusChange(status.name)}
                    disabled={ticket.status === status.name}
                    style={{
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.375rem',
                      backgroundColor: ticket.status === status.name ? status.color : 'white',
                      color: ticket.status === status.name ? 'white' : status.color,
                      cursor: ticket.status === status.name ? 'default' : 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    {ticket.status === status.name && <MdCheck size={16} />}
                    {status.displayName}
                  </button>
                ))}
              </div>
            </div>

            {/* Ticket Actions */}
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', margin: '0 0 0.75rem 0' }}>
                Ticket Actions
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  style={{
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    backgroundColor: 'white',
                    color: '#374151',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <MdPerson size={16} />
                  Assign to me
                </button>
                <button
                  style={{
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    backgroundColor: 'white',
                    color: '#374151',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <MdAttachFile size={16} />
                  Add Attachment
                </button>
                <button
                  style={{
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    backgroundColor: 'white',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <MdClose size={16} />
                  Close Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;