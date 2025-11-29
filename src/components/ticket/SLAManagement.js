
import React, { useState } from 'react';
import {
  MdAdd, MdEdit, MdDelete, MdSearch, MdFilterList,
  MdTimer, MdWarning, MdCheckCircle, MdBusiness
} from 'react-icons/md';

const SLAManagement = () => {
  const [slaPolicies, setSlaPolicies] = useState([
    {
      id: 1,
      name: 'Critical Issues',
      description: 'For critical system outages and high impact issues',
      priority: 'High',
      responseTime: '30 minutes',
      resolutionTime: '4 hours',
      businessHours: '24/7',
      escalationLevels: 3,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Standard Support',
      description: 'For regular support requests and standard issues',
      priority: 'Medium',
      responseTime: '2 hours',
      resolutionTime: '24 hours',
      businessHours: '9 AM - 6 PM',
      escalationLevels: 2,
      status: 'Active'
    },
    {
      id: 3,
      name: 'Low Priority',
      description: 'For minor issues and feature requests',
      priority: 'Low',
      responseTime: '8 hours',
      resolutionTime: '3 days',
      businessHours: '9 AM - 6 PM',
      escalationLevels: 1,
      status: 'Active'
    }
  ]);

  const [escalationRules, setEscalationRules] = useState([
    {
      id: 1,
      name: 'Level 1 Escalation',
      trigger: 'No response within 1 hour',
      action: 'Notify Team Lead',
      slaPolicy: 'Critical Issues',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Level 2 Escalation',
      trigger: 'No resolution within 4 hours',
      action: 'Notify Department Head',
      slaPolicy: 'Critical Issues',
      status: 'Active'
    }
  ]);

  const [activeTab, setActiveTab] = useState('policies');
  const [showSlaForm, setShowSlaForm] = useState(false);
  const [showEscalationForm, setShowEscalationForm] = useState(false);

  const handleAddSlaPolicy = (policyData) => {
    const newPolicy = {
      ...policyData,
      id: slaPolicies.length + 1,
      status: 'Active'
    };
    setSlaPolicies([...slaPolicies, newPolicy]);
    setShowSlaForm(false);
  };

  const handleAddEscalationRule = (ruleData) => {
    const newRule = {
      ...ruleData,
      id: escalationRules.length + 1,
      status: 'Active'
    };
    setEscalationRules([...escalationRules, newRule]);
    setShowEscalationForm(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? '#10b981' : '#6b7280';
  };

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
            ⏰ SLA Management
          </h1>
          <p style={{ color: '#6b7280', margin: '0.5rem 0 0 0' }}>
            Manage Service Level Agreements and escalation rules
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {activeTab === 'policies' && (
            <button
              onClick={() => setShowSlaForm(true)}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              <MdAdd size={18} />
              <span>Add SLA Policy</span>
            </button>
          )}
          {activeTab === 'escalations' && (
            <button
              onClick={() => setShowEscalationForm(true)}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              <MdAdd size={18} />
              <span>Add Escalation Rule</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
        <button
          onClick={() => setActiveTab('policies')}
          style={{
            padding: '1rem 0',
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: '1rem',
            fontWeight: '600',
            color: activeTab === 'policies' ? '#2563eb' : '#6b7280',
            borderBottom: activeTab === 'policies' ? '2px solid #2563eb' : '2px solid transparent',
            cursor: 'pointer'
          }}
        >
          SLA Policies ({slaPolicies.length})
        </button>
        <button
          onClick={() => setActiveTab('escalations')}
          style={{
            padding: '1rem 0',
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: '1rem',
            fontWeight: '600',
            color: activeTab === 'escalations' ? '#2563eb' : '#6b7280',
            borderBottom: activeTab === 'escalations' ? '2px solid #2563eb' : '2px solid transparent',
            cursor: 'pointer'
          }}
        >
          Escalation Rules ({escalationRules.length})
        </button>
      </div>

      {/* SLA Policies Tab */}
      {activeTab === 'policies' && (
        <div>
          {/* Search and Filter */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <MdSearch size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="text"
                placeholder="Search SLA policies..."
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem'
                }}
              />
            </div>
            <button
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
              }}
            >
              <MdFilterList size={18} />
              <span>Filter</span>
            </button>
          </div>

          {/* SLA Policies Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
            {slaPolicies.map(policy => (
              <div
                key={policy.id}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: '0 0 0.5rem 0' }}>
                      {policy.name}
                    </h3>
                    <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>
                      {policy.description}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      style={{
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        backgroundColor: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      <MdEdit size={16} />
                    </button>
                    <button
                      style={{
                        padding: '0.5rem',
                        border: '1px solid #fecaca',
                        borderRadius: '0.375rem',
                        backgroundColor: '#fef2f2',
                        cursor: 'pointer',
                        color: '#dc2626'
                      }}
                    >
                      <MdDelete size={16} />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MdTimer size={16} style={{ color: '#6b7280' }} />
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Response Time</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>{policy.responseTime}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MdCheckCircle size={16} style={{ color: '#6b7280' }} />
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Resolution Time</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>{policy.resolutionTime}</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MdBusiness size={16} style={{ color: '#6b7280' }} />
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Business Hours</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>{policy.businessHours}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MdWarning size={16} style={{ color: '#6b7280' }} />
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Escalation Levels</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>{policy.escalationLevels}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    backgroundColor: getPriorityColor(policy.priority) + '20',
                    color: getPriorityColor(policy.priority)
                  }}>
                    {policy.priority} Priority
                  </span>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    backgroundColor: getStatusColor(policy.status) + '20',
                    color: getStatusColor(policy.status)
                  }}>
                    {policy.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Escalation Rules Tab */}
      {activeTab === 'escalations' && (
        <div>
          {/* Search and Filter */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <MdSearch size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="text"
                placeholder="Search escalation rules..."
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem'
                }}
              />
            </div>
            <button
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
              }}
            >
              <MdFilterList size={18} />
              <span>Filter</span>
            </button>
          </div>

          {/* Escalation Rules Table */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280' }}>Rule Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280' }}>Trigger Condition</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280' }}>Action</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280' }}>SLA Policy</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {escalationRules.map(rule => (
                  <tr key={rule.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '1rem', fontWeight: '600', color: '#111827' }}>{rule.name}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MdWarning size={16} style={{ color: '#f59e0b' }} />
                        <span>{rule.trigger}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>{rule.action}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        backgroundColor: '#dbeafe',
                        color: '#1e40af'
                      }}>
                        {rule.slaPolicy}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        backgroundColor: getStatusColor(rule.status) + '20',
                        color: getStatusColor(rule.status)
                      }}>
                        {rule.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          style={{
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            backgroundColor: 'white',
                            cursor: 'pointer'
                          }}
                        >
                          <MdEdit size={16} />
                        </button>
                        <button
                          style={{
                            padding: '0.5rem',
                            border: '1px solid #fecaca',
                            borderRadius: '0.375rem',
                            backgroundColor: '#fef2f2',
                            cursor: 'pointer',
                            color: '#dc2626'
                          }}
                        >
                          <MdDelete size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add SLA Policy Form Modal */}
      {showSlaForm && (
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
          zIndex: 50
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Add SLA Policy</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleAddSlaPolicy({ name: e.target.policyName.value, description: e.target.description.value }); }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                  type="text"
                  name="policyName"
                  placeholder="Policy Name"
                  style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
                  required
                />
                <textarea
                  name="description"
                  placeholder="Policy Description"
                  rows="3"
                  style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', resize: 'vertical' }}
                />
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowSlaForm(false)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      backgroundColor: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    Add Policy
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SLAManagement;