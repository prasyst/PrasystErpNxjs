import React from 'react';
import { MdAnalytics, MdDownload } from 'react-icons/md';

const TicketReports = ({ tickets }) => {
  const reports = [
    { title: 'Ticket Volume', description: 'Daily ticket creation trends', type: 'line' },
    { title: 'Resolution Time', description: 'Average time to resolve tickets', type: 'bar' },
    { title: 'Category Distribution', description: 'Tickets by category', type: 'pie' },
    { title: 'Team Performance', description: 'Tickets resolved by team', type: 'bar' }
  ];

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      padding: '1.5rem'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '600', 
          color: '#111827',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <MdAnalytics color="#ec4899" />
          Reports & Analytics
        </h2>
        <button style={{
          padding: '0.5rem 1rem',
          border: '1px solid #d1d5db',
          borderRadius: '0.5rem',
          backgroundColor: 'white',
          color: '#374151',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '500'
        }}>
          <MdDownload size={16} />
          Export Report
        </button>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {reports.map((report, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              backgroundColor: '#f9fafb',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              color: '#111827',
              margin: '0 0 0.5rem 0'
            }}>
              {report.title}
            </h3>
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#6b7280',
              margin: '0 0 1rem 0'
            }}>
              {report.description}
            </p>
            <div style={{
              height: '120px',
              backgroundColor: '#e5e7eb',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9ca3af',
              fontSize: '0.875rem'
            }}>
              {report.type.toUpperCase()} Chart Preview
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem',
        marginTop: '2rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid #e5e7eb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
            {tickets.length}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Tickets</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
            {tickets.filter(t => t.status === 'resolved').length}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Resolved</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
            85%
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Satisfaction Rate</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
            2.3h
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Avg. Response</div>
        </div>
      </div>
    </div>
  );
};

export default TicketReports;