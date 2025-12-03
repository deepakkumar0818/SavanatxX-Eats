import React, { useState, useEffect } from 'react';
import './Bookings.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const Bookings = ({ url }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Fetch all bookings
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/booking/list`);
      if (response.data.success) {
        setBookings(response.data.data);
      } else {
        toast.error('Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Error loading bookings');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Update booking status
  const updateStatus = async (bookingId, newStatus) => {
    try {
      const response = await axios.post(`${url}/api/booking/status`, {
        bookingId,
        status: newStatus
      });
      
      if (response.data.success) {
        toast.success(`Booking ${newStatus.toLowerCase()}`);
        fetchBookings();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error updating booking status');
    }
  };

  // Delete booking
  const deleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;

    try {
      const response = await axios.post(`${url}/api/booking/delete`, { bookingId });
      
      if (response.data.success) {
        toast.success('Booking deleted');
        fetchBookings();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Error deleting booking');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Format time ago
  const timeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return formatDate(dateString);
  };

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  // Get stats
  const getStats = () => {
    return {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'Pending').length,
      confirmed: bookings.filter(b => b.status === 'Confirmed').length,
      completed: bookings.filter(b => b.status === 'Completed').length,
      cancelled: bookings.filter(b => b.status === 'Cancelled').length,
      today: bookings.filter(b => {
        const bookingDate = new Date(b.date).toDateString();
        const today = new Date().toDateString();
        return bookingDate === today;
      }).length
    };
  };

  const stats = getStats();

  return (
    <div className="bookings-page">
      {/* Header */}
      <div className="bookings-header">
        <div className="header-left">
          <h2>🗓️ Table Reservations</h2>
          <p>{bookings.length} total bookings</p>
        </div>
        <button className="refresh-btn" onClick={fetchBookings}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="booking-stats">
        <div className="stat-card total" onClick={() => setFilter('all')}>
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-card today">
          <span className="stat-number">{stats.today}</span>
          <span className="stat-label">Today</span>
        </div>
        <div className="stat-card pending" onClick={() => setFilter('Pending')}>
          <span className="stat-number">{stats.pending}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card confirmed" onClick={() => setFilter('Confirmed')}>
          <span className="stat-number">{stats.confirmed}</span>
          <span className="stat-label">Confirmed</span>
        </div>
        <div className="stat-card completed" onClick={() => setFilter('Completed')}>
          <span className="stat-number">{stats.completed}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-card cancelled" onClick={() => setFilter('Cancelled')}>
          <span className="stat-number">{stats.cancelled}</span>
          <span className="stat-label">Cancelled</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
          All
        </button>
        <button className={filter === 'Pending' ? 'active' : ''} onClick={() => setFilter('Pending')}>
          Pending
        </button>
        <button className={filter === 'Confirmed' ? 'active' : ''} onClick={() => setFilter('Confirmed')}>
          Confirmed
        </button>
        <button className={filter === 'Completed' ? 'active' : ''} onClick={() => setFilter('Completed')}>
          Completed
        </button>
        <button className={filter === 'Cancelled' ? 'active' : ''} onClick={() => setFilter('Cancelled')}>
          Cancelled
        </button>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="empty-state">
          <p>No bookings found</p>
        </div>
      ) : (
        <div className="bookings-list">
          {filteredBookings.map((booking) => (
            <div key={booking._id} className={`booking-card ${booking.status.toLowerCase()}`}>
              <div className="booking-card-header">
                <div className="booking-id">
                  <span className="id-hash">#</span>
                  {booking._id.slice(-8).toUpperCase()}
                </div>
                <div className="booking-meta">
                  <span className="created-at">{timeAgo(booking.createdAt)}</span>
                  <span className={`status-badge ${booking.status.toLowerCase()}`}>
                    {booking.status === 'Pending' && '⏳'}
                    {booking.status === 'Confirmed' && '✅'}
                    {booking.status === 'Completed' && '🎉'}
                    {booking.status === 'Cancelled' && '❌'}
                    {booking.status}
                  </span>
                </div>
              </div>

              <div className="booking-card-body">
                <div className="booking-customer">
                  <div className="customer-avatar">
                    {booking.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="customer-info">
                    <h4>{booking.name}</h4>
                    <p>{booking.email}</p>
                    <p>{booking.phone}</p>
                  </div>
                </div>

                <div className="booking-details">
                  <div className="detail-row">
                    <span className="detail-icon">📅</span>
                    <span className="detail-text">{formatDate(booking.date)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-icon">🕐</span>
                    <span className="detail-text">{booking.time}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-icon">👥</span>
                    <span className="detail-text">{booking.guests} Guest{booking.guests !== '1' ? 's' : ''}</span>
                  </div>
                  {booking.tableNumber && (
                    <div className="detail-row table-detail">
                      <span className="detail-icon">🪑</span>
                      <span className="detail-text">
                        Table {booking.tableNumber}
                        {booking.tableName && <span className="table-name-badge"> • {booking.tableName}</span>}
                      </span>
                    </div>
                  )}
                  {booking.occasion && (
                    <div className="detail-row">
                      <span className="detail-icon">🎉</span>
                      <span className="detail-text">{booking.occasion}</span>
                    </div>
                  )}
                </div>

                {booking.specialRequests && (
                  <div className="special-requests">
                    <span className="requests-label">Special Requests:</span>
                    <p>{booking.specialRequests}</p>
                  </div>
                )}

                {/* Pre-Order Badge */}
                {booking.hasPreOrder && booking.preOrderedItems && booking.preOrderedItems.length > 0 && (
                  <div className="preorder-badge">
                    <span className="preorder-icon">🍽️</span>
                    <span className="preorder-text">
                      {booking.preOrderedItems.length} items pre-ordered • ₹{booking.preOrderTotal}
                    </span>
                    <span className={`payment-pill ${booking.preOrderPayment ? 'paid' : 'pending'}`}>
                      {booking.preOrderPayment ? '💳 Paid' : '⏳ Unpaid'}
                    </span>
                  </div>
                )}
              </div>

              <div className="booking-card-footer">
                <div className="status-select">
                  <label>Update Status:</label>
                  <select
                    value={booking.status}
                    onChange={(e) => updateStatus(booking._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="action-buttons">
                  <button 
                    className="view-btn"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    View Details
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteBooking(booking._id)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="booking-modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Booking Details</h3>
              <button className="close-btn" onClick={() => setSelectedBooking(null)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h4>Customer Information</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Name</span>
                    <span className="info-value">{selectedBooking.name}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email</span>
                    <span className="info-value">{selectedBooking.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Phone</span>
                    <span className="info-value">{selectedBooking.phone}</span>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h4>Reservation Details</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Date</span>
                    <span className="info-value">{formatDate(selectedBooking.date)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Time</span>
                    <span className="info-value">{selectedBooking.time}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Guests</span>
                    <span className="info-value">{selectedBooking.guests}</span>
                  </div>
                  {selectedBooking.tableNumber && (
                    <div className="info-item table-info">
                      <span className="info-label">Table</span>
                      <span className="info-value">
                        🪑 Table {selectedBooking.tableNumber}
                        {selectedBooking.tableName && ` - ${selectedBooking.tableName}`}
                      </span>
                    </div>
                  )}
                  <div className="info-item">
                    <span className="info-label">Occasion</span>
                    <span className="info-value">{selectedBooking.occasion || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {selectedBooking.specialRequests && (
                <div className="modal-section">
                  <h4>Special Requests</h4>
                  <p className="special-text">{selectedBooking.specialRequests}</p>
                </div>
              )}

              {/* Pre-Ordered Food Section */}
              {selectedBooking.hasPreOrder && selectedBooking.preOrderedItems && selectedBooking.preOrderedItems.length > 0 && (
                <div className="modal-section preorder-section">
                  <h4>🍽️ Pre-Ordered Food</h4>
                  <div className="preorder-items-list">
                    {selectedBooking.preOrderedItems.map((item, idx) => (
                      <div key={idx} className="preorder-item">
                        <img src={item.image} alt={item.name} className="preorder-item-img" />
                        <div className="preorder-item-details">
                          <span className="preorder-item-name">{item.name}</span>
                          <span className="preorder-item-qty">Qty: {item.quantity}</span>
                        </div>
                        <span className="preorder-item-price">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="preorder-total">
                    <span>Food Total</span>
                    <span>₹{selectedBooking.preOrderTotal}</span>
                  </div>
                  <div className={`preorder-payment-status ${selectedBooking.preOrderPayment ? 'paid' : 'pending'}`}>
                    {selectedBooking.preOrderPayment ? (
                      <>
                        <span className="payment-icon">✅</span>
                        <span className="payment-label">Payment Received</span>
                        {selectedBooking.paymentId && (
                          <span className="payment-id">ID: {selectedBooking.paymentId}</span>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="payment-icon">⏳</span>
                        <span className="payment-label">Payment Pending</span>
                        <span className="payment-note">Collect at restaurant</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="modal-section">
                <h4>Booking Status</h4>
                <div className="status-timeline">
                  <div className={`timeline-item ${selectedBooking.status === 'Pending' ? 'current' : selectedBooking.status !== 'Cancelled' ? 'done' : ''}`}>
                    <span className="timeline-dot">1</span>
                    <span className="timeline-label">Pending</span>
                  </div>
                  <div className={`timeline-item ${selectedBooking.status === 'Confirmed' ? 'current' : selectedBooking.status === 'Completed' ? 'done' : ''}`}>
                    <span className="timeline-dot">2</span>
                    <span className="timeline-label">Confirmed</span>
                  </div>
                  <div className={`timeline-item ${selectedBooking.status === 'Completed' ? 'current done' : ''}`}>
                    <span className="timeline-dot">3</span>
                    <span className="timeline-label">Completed</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="confirm-btn"
                onClick={() => {
                  updateStatus(selectedBooking._id, 'Confirmed');
                  setSelectedBooking(null);
                }}
                disabled={selectedBooking.status === 'Confirmed' || selectedBooking.status === 'Completed'}
              >
                ✅ Confirm Booking
              </button>
              <button 
                className="complete-btn"
                onClick={() => {
                  updateStatus(selectedBooking._id, 'Completed');
                  setSelectedBooking(null);
                }}
                disabled={selectedBooking.status === 'Completed'}
              >
                🎉 Mark Completed
              </button>
              <button 
                className="cancel-btn"
                onClick={() => {
                  updateStatus(selectedBooking._id, 'Cancelled');
                  setSelectedBooking(null);
                }}
                disabled={selectedBooking.status === 'Cancelled'}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;

