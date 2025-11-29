
import React, { useState } from 'react';
import {
  MdAdd, MdEdit, MdDelete, MdSearch, MdFilterList,
  MdPerson, MdEmail, MdPhone, MdGroup, MdWork
} from 'react-icons/md';

const TeamManagement = () => {
  const [teams, setTeams] = useState([
    {
      id: 1,
      name: 'Level 1 Support',
      description: 'Handles initial customer queries and basic troubleshooting',
      members: 5,
      lead: 'John Doe',
      email: 'l1support@company.com',
      created: '2024-01-15'
    },
    {
      id: 2,
      name: 'Technical Team',
      description: 'Handles complex technical issues and bug fixes',
      members: 8,
      lead: 'Jane Smith',
      email: 'techteam@company.com',
      created: '2024-01-10'
    },
    {
      id: 3,
      name: 'Billing Support',
      description: 'Manages billing and payment related queries',
      members: 3,
      lead: 'Mike Wilson',
      email: 'billing@company.com',
      created: '2024-01-20'
    }
  ]);

  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@company.com',
      phone: '+1-555-0101',
      role: 'Team Lead',
      team: 'Level 1 Support',
      status: 'Active',
      joinDate: '2024-01-01'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      phone: '+1-555-0102',
      role: 'Senior Support',
      team: 'Technical Team',
      status: 'Active',
      joinDate: '2024-01-05'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'mike.wilson@company.com',
      phone: '+1-555-0103',
      role: 'Support Agent',
      team: 'Billing Support',
      status: 'Active',
      joinDate: '2024-01-10'
    }
  ]);

  const [activeTab, setActiveTab] = useState('teams');
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  const handleAddTeam = (teamData) => {
    const newTeam = {
      ...teamData,
      id: teams.length + 1,
      created: new Date().toISOString().split('T')[0]
    };
    setTeams([...teams, newTeam]);
    setShowTeamForm(false);
  };

  const handleAddMember = (memberData) => {
    const newMember = {
      ...memberData,
      id: teamMembers.length + 1,
      joinDate: new Date().toISOString().split('T')[0]
    };
    setTeamMembers([...teamMembers, newMember]);
    setShowMemberForm(false);
  };

  const handleDeleteTeam = (teamId) => {
    setTeams(teams.filter(team => team.id !== teamId));
  };

  const handleDeleteMember = (memberId) => {
    setTeamMembers(teamMembers.filter(member => member.id !== memberId));
  };

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
            👥 Team Management
          </h1>
          <p style={{ color: '#6b7280', margin: '0.5rem 0 0 0' }}>
            Manage support teams and team members
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {activeTab === 'teams' && (
            <button
              onClick={() => setShowTeamForm(true)}
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
              <span>Add Team</span>
            </button>
          )}
          {activeTab === 'members' && (
            <button
              onClick={() => setShowMemberForm(true)}
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
              <span>Add Member</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
        <button
          onClick={() => setActiveTab('teams')}
          style={{
            padding: '1rem 0',
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: '1rem',
            fontWeight: '600',
            color: activeTab === 'teams' ? '#2563eb' : '#6b7280',
            borderBottom: activeTab === 'teams' ? '2px solid #2563eb' : '2px solid transparent',
            cursor: 'pointer'
          }}
        >
          Teams ({teams.length})
        </button>
        <button
          onClick={() => setActiveTab('members')}
          style={{
            padding: '1rem 0',
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: '1rem',
            fontWeight: '600',
            color: activeTab === 'members' ? '#2563eb' : '#6b7280',
            borderBottom: activeTab === 'members' ? '2px solid #2563eb' : '2px solid transparent',
            cursor: 'pointer'
          }}
        >
          Team Members ({teamMembers.length})
        </button>
      </div>

      {/* Teams Tab */}
      {activeTab === 'teams' && (
        <div>
          {/* Search and Filter */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <MdSearch size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="text"
                placeholder="Search teams..."
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

          {/* Teams Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {teams.map(team => (
              <div
                key={team.id}
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
                      {team.name}
                    </h3>
                    <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>
                      {team.description}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => setSelectedTeam(team)}
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
                      onClick={() => handleDeleteTeam(team.id)}
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MdGroup size={16} style={{ color: '#6b7280' }} />
                    <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                      {team.members} members
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MdPerson size={16} style={{ color: '#6b7280' }} />
                    <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                      Lead: {team.lead}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MdEmail size={16} style={{ color: '#6b7280' }} />
                    <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                      {team.email}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div>
          {/* Search and Filter */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <MdSearch size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="text"
                placeholder="Search team members..."
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

          {/* Members Table */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280' }}>Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280' }}>Contact</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280' }}>Role & Team</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map(member => (
                  <tr key={member.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '1rem' }}>
                      <div>
                        <div style={{ fontWeight: '600', color: '#111827' }}>{member.name}</div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Joined {member.joinDate}</div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <MdEmail size={14} style={{ color: '#6b7280' }} />
                          <span style={{ fontSize: '0.875rem' }}>{member.email}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <MdPhone size={14} style={{ color: '#6b7280' }} />
                          <span style={{ fontSize: '0.875rem' }}>{member.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div>
                        <div style={{ fontWeight: '500', color: '#111827' }}>{member.role}</div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{member.team}</div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        backgroundColor: member.status === 'Active' ? '#dcfce7' : '#fecaca',
                        color: member.status === 'Active' ? '#166534' : '#991b1b'
                      }}>
                        {member.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => setSelectedMember(member)}
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
                          onClick={() => handleDeleteMember(member.id)}
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

      {/* Add Team Form Modal */}
      {showTeamForm && (
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
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Add New Team</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleAddTeam({ name: e.target.teamName.value, description: e.target.description.value }); }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                  type="text"
                  name="teamName"
                  placeholder="Team Name"
                  style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
                  required
                />
                <textarea
                  name="description"
                  placeholder="Team Description"
                  rows="3"
                  style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', resize: 'vertical' }}
                />
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowTeamForm(false)}
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
                    Add Team
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

export default TeamManagement;