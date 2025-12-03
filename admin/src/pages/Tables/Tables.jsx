import React, { useState, useEffect } from 'react';
import './Tables.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const Tables = ({ url }) => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [filter, setFilter] = useState('all');

  const [formData, setFormData] = useState({
    tableNumber: '',
    tableName: '',
    capacity: 2,
    location: 'indoor',
    description: '',
    features: []
  });

  const locations = [
    { value: 'indoor', label: 'Indoor', icon: '🏠' },
    { value: 'outdoor', label: 'Outdoor', icon: '🌳' },
    { value: 'balcony', label: 'Balcony', icon: '🌅' },
    { value: 'private', label: 'Private Room', icon: '🚪' },
    { value: 'rooftop', label: 'Rooftop', icon: '🌃' }
  ];

  const featureOptions = [
    'Window View', 'AC', 'Power Outlet', 'WiFi', 'Quiet Zone', 
    'Near Kitchen', 'Wheelchair Accessible', 'Baby Chair Available'
  ];

  const fetchTables = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/table/list`);
      if (response.data.success) {
        setTables(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to fetch tables');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleAddTable = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/api/table/add`, formData);
      if (response.data.success) {
        toast.success('Table added successfully!');
        setShowAddModal(false);
        setFormData({
          tableNumber: '',
          tableName: '',
          capacity: 2,
          location: 'indoor',
          description: '',
          features: []
        });
        fetchTables();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to add table');
    }
  };

  const handleUpdateTable = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/api/table/update`, {
        tableId: selectedTable._id,
        ...formData
      });
      if (response.data.success) {
        toast.success('Table updated successfully!');
        setShowEditModal(false);
        setSelectedTable(null);
        fetchTables();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to update table');
    }
  };

  const handleStatusChange = async (tableId, status) => {
    try {
      const response = await axios.post(`${url}/api/table/status`, { tableId, status });
      if (response.data.success) {
        toast.success(`Table marked as ${status}`);
        fetchTables();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleToggleActive = async (tableId) => {
    try {
      const response = await axios.post(`${url}/api/table/toggle`, { tableId });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchTables();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to toggle table');
    }
  };

  const handleDeleteTable = async (tableId, tableNumber) => {
    if (!window.confirm(`Are you sure you want to delete Table ${tableNumber}?`)) return;
    
    try {
      const response = await axios.post(`${url}/api/table/delete`, { tableId });
      if (response.data.success) {
        toast.success('Table deleted');
        fetchTables();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to delete table');
    }
  };

  const openEditModal = (table) => {
    setSelectedTable(table);
    setFormData({
      tableNumber: table.tableNumber,
      tableName: table.tableName,
      capacity: table.capacity,
      location: table.location,
      description: table.description || '',
      features: table.features || []
    });
    setShowEditModal(true);
  };

  // Filter tables
  const filteredTables = tables.filter(table => {
    if (filter === 'all') return true;
    if (filter === 'active') return table.isActive;
    if (filter === 'inactive') return !table.isActive;
    return table.status === filter;
  });

  // Stats
  const stats = {
    total: tables.length,
    available: tables.filter(t => t.status === 'available' && t.isActive).length,
    occupied: tables.filter(t => t.status === 'occupied').length,
    reserved: tables.filter(t => t.status === 'reserved').length,
    maintenance: tables.filter(t => t.status === 'maintenance').length
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return '#60b246';
      case 'occupied': return '#e23744';
      case 'reserved': return '#3b82f6';
      case 'maintenance': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getLocationIcon = (loc) => {
    const found = locations.find(l => l.value === loc);
    return found ? found.icon : '🪑';
  };

  return (
    <div className="tables-page">
      <div className="page-header">
        <div className="header-left">
          <h1>🪑 Table Management</h1>
          <p>Manage restaurant tables and seating</p>
        </div>
        <button className="btn-add-table" onClick={() => setShowAddModal(true)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add New Table
        </button>
      </div>

      {/* Stats */}
      <div className="table-stats">
        <div className="stat-card total">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Total Tables</span>
        </div>
        <div className="stat-card available">
          <span className="stat-number">{stats.available}</span>
          <span className="stat-label">Available</span>
        </div>
        <div className="stat-card occupied">
          <span className="stat-number">{stats.occupied}</span>
          <span className="stat-label">Occupied</span>
        </div>
        <div className="stat-card reserved">
          <span className="stat-number">{stats.reserved}</span>
          <span className="stat-label">Reserved</span>
        </div>
        <div className="stat-card maintenance">
          <span className="stat-number">{stats.maintenance}</span>
          <span className="stat-label">Maintenance</span>
        </div>
      </div>

      {/* Filters */}
      <div className="table-filters">
        <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
        <button className={`filter-btn ${filter === 'available' ? 'active' : ''}`} onClick={() => setFilter('available')}>Available</button>
        <button className={`filter-btn ${filter === 'occupied' ? 'active' : ''}`} onClick={() => setFilter('occupied')}>Occupied</button>
        <button className={`filter-btn ${filter === 'reserved' ? 'active' : ''}`} onClick={() => setFilter('reserved')}>Reserved</button>
        <button className={`filter-btn ${filter === 'maintenance' ? 'active' : ''}`} onClick={() => setFilter('maintenance')}>Maintenance</button>
        <button className={`filter-btn ${filter === 'inactive' ? 'active' : ''}`} onClick={() => setFilter('inactive')}>Inactive</button>
      </div>

      {/* Tables Grid */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Loading tables...</p>
        </div>
      ) : filteredTables.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🪑</span>
          <p>No tables found</p>
          <button onClick={() => setShowAddModal(true)}>Add your first table</button>
        </div>
      ) : (
        <div className="tables-grid">
          {filteredTables.map((table) => (
            <div key={table._id} className={`table-card ${table.status} ${!table.isActive ? 'inactive' : ''}`}>
              <div className="table-card-header">
                <div className="table-number">
                  <span className="location-icon">{getLocationIcon(table.location)}</span>
                  <div>
                    <h3>Table {table.tableNumber}</h3>
                    {table.tableName && <span className="table-name">{table.tableName}</span>}
                  </div>
                </div>
                <div className="table-status" style={{ backgroundColor: getStatusColor(table.status) }}>
                  {table.status}
                </div>
              </div>

              <div className="table-card-body">
                <div className="table-info">
                  <div className="info-item">
                    <span className="info-icon">👥</span>
                    <span>{table.capacity} seats</span>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">{getLocationIcon(table.location)}</span>
                    <span>{table.location}</span>
                  </div>
                </div>

                {/* Today's Bookings */}
                {table.todayBookings && table.todayBookings.length > 0 && (
                  <div className="table-bookings-info">
                    <div className="bookings-header">
                      <span className="booking-icon">📅</span>
                      <span className="booking-title">Today's Bookings ({table.todayBookings.length})</span>
                    </div>
                    <div className="bookings-list-mini">
                      {table.todayBookings.slice(0, 2).map((booking, idx) => (
                        <div key={idx} className={`booking-mini ${booking.status.toLowerCase()}`}>
                          <span className="booking-time">{booking.time}</span>
                          <span className="booking-name">{booking.name}</span>
                          <span className="booking-guests">{booking.guests}👥</span>
                        </div>
                      ))}
                      {table.todayBookings.length > 2 && (
                        <span className="more-bookings">+{table.todayBookings.length - 2} more</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Upcoming Bookings Count */}
                {table.upcomingBookingsCount > 0 && (
                  <div className="upcoming-badge">
                    <span>📆 {table.upcomingBookingsCount} upcoming booking{table.upcomingBookingsCount > 1 ? 's' : ''}</span>
                  </div>
                )}

                {/* Currently Booked Indicator */}
                {table.isCurrentlyBooked && (
                  <div className="currently-booked-badge">
                    <span className="pulse-dot"></span>
                    <span>Currently in use</span>
                  </div>
                )}

                {table.features && table.features.length > 0 && (
                  <div className="table-features">
                    {table.features.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="feature-tag">{feature}</span>
                    ))}
                    {table.features.length > 3 && (
                      <span className="feature-more">+{table.features.length - 3}</span>
                    )}
                  </div>
                )}

                {!table.isActive && (
                  <div className="inactive-badge">⚠️ Inactive</div>
                )}
              </div>

              <div className="table-card-footer">
                <div className="status-buttons">
                  <button 
                    className={`status-btn available ${table.status === 'available' ? 'active' : ''}`}
                    onClick={() => handleStatusChange(table._id, 'available')}
                    title="Mark Available"
                  >✓</button>
                  <button 
                    className={`status-btn occupied ${table.status === 'occupied' ? 'active' : ''}`}
                    onClick={() => handleStatusChange(table._id, 'occupied')}
                    title="Mark Occupied"
                  >●</button>
                  <button 
                    className={`status-btn reserved ${table.status === 'reserved' ? 'active' : ''}`}
                    onClick={() => handleStatusChange(table._id, 'reserved')}
                    title="Mark Reserved"
                  >◐</button>
                  <button 
                    className={`status-btn maintenance ${table.status === 'maintenance' ? 'active' : ''}`}
                    onClick={() => handleStatusChange(table._id, 'maintenance')}
                    title="Mark Maintenance"
                  >⚠</button>
                </div>
                <div className="action-buttons">
                  <button className="edit-btn" onClick={() => openEditModal(table)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button 
                    className={`toggle-btn ${table.isActive ? 'active' : ''}`}
                    onClick={() => handleToggleActive(table._id)}
                    title={table.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {table.isActive ? '👁' : '👁‍🗨'}
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteTable(table._id, table.tableNumber)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Table Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Table</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <form onSubmit={handleAddTable}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Table Number *</label>
                  <input
                    type="text"
                    name="tableNumber"
                    value={formData.tableNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., T1, A1, 01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Table Name</label>
                  <input
                    type="text"
                    name="tableName"
                    value={formData.tableName}
                    onChange={handleInputChange}
                    placeholder="e.g., Window Seat"
                  />
                </div>
                <div className="form-group">
                  <label>Capacity (seats) *</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    min="1"
                    max="20"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Location *</label>
                  <select name="location" value={formData.location} onChange={handleInputChange}>
                    {locations.map(loc => (
                      <option key={loc.value} value={loc.value}>{loc.icon} {loc.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of the table..."
                    rows="2"
                  ></textarea>
                </div>
                <div className="form-group full-width">
                  <label>Features</label>
                  <div className="features-grid">
                    {featureOptions.map(feature => (
                      <label key={feature} className={`feature-checkbox ${formData.features.includes(feature) ? 'checked' : ''}`}>
                        <input
                          type="checkbox"
                          checked={formData.features.includes(feature)}
                          onChange={() => handleFeatureToggle(feature)}
                        />
                        <span>{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-submit">Add Table</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Table Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Table {selectedTable?.tableNumber}</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <form onSubmit={handleUpdateTable}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Table Number *</label>
                  <input
                    type="text"
                    name="tableNumber"
                    value={formData.tableNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Table Name</label>
                  <input
                    type="text"
                    name="tableName"
                    value={formData.tableName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Capacity (seats) *</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    min="1"
                    max="20"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Location *</label>
                  <select name="location" value={formData.location} onChange={handleInputChange}>
                    {locations.map(loc => (
                      <option key={loc.value} value={loc.value}>{loc.icon} {loc.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="2"
                  ></textarea>
                </div>
                <div className="form-group full-width">
                  <label>Features</label>
                  <div className="features-grid">
                    {featureOptions.map(feature => (
                      <label key={feature} className={`feature-checkbox ${formData.features.includes(feature) ? 'checked' : ''}`}>
                        <input
                          type="checkbox"
                          checked={formData.features.includes(feature)}
                          onChange={() => handleFeatureToggle(feature)}
                        />
                        <span>{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="btn-submit">Update Table</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tables;

