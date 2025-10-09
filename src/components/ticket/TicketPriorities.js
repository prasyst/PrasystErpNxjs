import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const TicketPriorities = () => {
  const priorities = [
    { name: 'Low', color: '#10b981', responseTime: '72 hours', resolutionTime: '7 days' },
    { name: 'Medium', color: '#f59e0b', responseTime: '24 hours', resolutionTime: '3 days' },
    { name: 'High', color: '#ef4444', responseTime: '4 hours', resolutionTime: '1 day' },
    { name: 'Critical', color: '#dc2626', responseTime: '1 hour', resolutionTime: '8 hours' }
  ];

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      padding: '1.5rem'
    }}>
      <h2 style={{ 
        fontSize: '1.25rem', 
        fontWeight: '600', 
        color: '#111827',
        margin: '0 0 1.5rem 0',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <FaExclamationTriangle color="#dc2626" />
        Priority Management
      </h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1rem' 
      }}>
        {priorities.map((priority, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              backgroundColor: '#f9fafb'
            }}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: priority.color
              }} />
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                color: '#111827',
                margin: 0
              }}>
                {priority.name}
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Response Time:</span>
                <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                  {priority.responseTime}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Resolution Time:</span>
                <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                  {priority.resolutionTime}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketPriorities;