import React, { useState, useContext, useEffect } from 'react';
import './MyBookings.css';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { Link } from 'react-router-dom';

const MyBookings = () => {
  const { url, userInfo, token } = useContext(StoreContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchData, setSearchData] = useState({
    email: '',
    phone: ''
  });
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Auto-load bookings when user info is available
  useEffect(() => {
    if (userInfo && userInfo.email) {
      setSearchData(prev => ({ ...prev, email: userInfo.email }));
      fetchBookings(userInfo.email, '');
    } else {
      // Fallback to saved search
      const savedEmail = localStorage.getItem('bookingEmail');
      const savedPhone = localStorage.getItem('bookingPhone');
      if (savedEmail || savedPhone) {
        setSearchData({ email: savedEmail || '', phone: savedPhone || '' });
        fetchBookings(savedEmail, savedPhone);
      }
    }
  }, [userInfo]);

  // Fetch bookings
  const fetchBookings = async (email, phone) => {
    if (!email && !phone) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${url}/api/booking/user-bookings`, { email, phone });
      if (response.data.success) {
        setBookings(response.data.data);
        // Save search for convenience
        localStorage.setItem('bookingEmail', email);
        localStorage.setItem('bookingPhone', phone);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
    setLoading(false);
    setSearched(true);
  };

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    fetchBookings(searchData.email, searchData.phone);
  };

  // Cancel booking
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const response = await axios.post(`${url}/api/booking/cancel`, {
        bookingId,
        email: searchData.email
      });
      
      if (response.data.success) {
        // Refresh bookings
        fetchBookings(searchData.email, searchData.phone);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking');
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

  // Check if booking is upcoming
  const isUpcoming = (dateString) => {
    const bookingDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bookingDate >= today;
  };

  // Get status color class
  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending': return 'pending';
      case 'Confirmed': return 'confirmed';
      case 'Completed': return 'completed';
      case 'Cancelled': return 'cancelled';
      default: return '';
    }
  };

  // Separate upcoming and past bookings
  const upcomingBookings = bookings.filter(b => isUpcoming(b.date) && b.status !== 'Cancelled' && b.status !== 'Completed');
  const pastBookings = bookings.filter(b => !isUpcoming(b.date) || b.status === 'Cancelled' || b.status === 'Completed');

  return (
    <div className="my-bookings-page">
      {/* Header */}
      <div className="bookings-header">
        <div className="header-content">
          <div className="header-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div>
            <h1>My Table Bookings</h1>
            <p>View and manage your reservations</p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="search-section">
        {userInfo ? (
          <div className="logged-in-info">
            <div className="user-info-box">
              <div className="user-avatar">
                {userInfo.name?.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <span className="user-name">{userInfo.name}</span>
                <span className="user-email">{userInfo.email}</span>
              </div>
            </div>
            <p className="auto-load-note">Showing bookings for your account</p>
          </div>
        ) : (
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-inputs">
              <div className="input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={searchData.email}
                  onChange={(e) => setSearchData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <span className="or-divider">OR</span>
              <div className="input-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter your phone"
                  value={searchData.phone}
                  onChange={(e) => setSearchData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>
            <button type="submit" className="search-btn" disabled={!searchData.email && !searchData.phone}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              Find My Bookings
            </button>
          </form>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your bookings...</p>
        </div>
      )}

      {/* Results */}
      {!loading && searched && (
        <>
          {bookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <h2>No Bookings Found</h2>
              <p>We couldn't find any bookings with the provided details.</p>
              <Link to="/book-table" className="book-now-btn">
                Book a Table Now
              </Link>
            </div>
          ) : (
            <div className="bookings-content">
              {/* Stats */}
              <div className="booking-stats">
                <div className="stat-card">
                  <span className="stat-number">{bookings.length}</span>
                  <span className="stat-label">Total</span>
                </div>
                <div className="stat-card upcoming">
                  <span className="stat-number">{upcomingBookings.length}</span>
                  <span className="stat-label">Upcoming</span>
                </div>
                <div className="stat-card completed">
                  <span className="stat-number">{bookings.filter(b => b.status === 'Completed').length}</span>
                  <span className="stat-label">Completed</span>
                </div>
                <div className="stat-card cancelled">
                  <span className="stat-number">{bookings.filter(b => b.status === 'Cancelled').length}</span>
                  <span className="stat-label">Cancelled</span>
                </div>
              </div>

              {/* Upcoming Bookings */}
              {upcomingBookings.length > 0 && (
                <div className="bookings-section">
                  <h2>
                    <span className="section-icon">📅</span>
                    Upcoming Reservations
                  </h2>
                  <div className="bookings-grid">
                    {upcomingBookings.map((booking) => (
                      <div key={booking._id} className={`booking-card ${getStatusClass(booking.status)}`}>
                        <div className="booking-card-header">
                          <div className="booking-id">
                            <span>#</span>{booking._id.slice(-8).toUpperCase()}
                          </div>
                          <span className={`status-badge ${getStatusClass(booking.status)}`}>
                            {booking.status === 'Pending' && '⏳'}
                            {booking.status === 'Confirmed' && '✅'}
                            {booking.status}
                          </span>
                        </div>

                        <div className="booking-card-body">
                          <div className="booking-datetime">
                            <div className="date-block">
                              <span className="day">{new Date(booking.date).getDate()}</span>
                              <span className="month">{new Date(booking.date).toLocaleString('en-US', { month: 'short' })}</span>
                            </div>
                            <div className="time-info">
                              <span className="time">{booking.time}</span>
                              <span className="guests">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                  <circle cx="9" cy="7" r="4"/>
                                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                </svg>
                                {booking.guests} Guest{booking.guests !== '1' ? 's' : ''}
                              </span>
                            </div>
                          </div>

                          {booking.tableNumber && (
                            <div className="booking-table-info">
                              <span className="table-icon">🪑</span>
                              <span className="table-text">
                                Table {booking.tableNumber}
                                {booking.tableName && ` - ${booking.tableName}`}
                              </span>
                            </div>
                          )}

                          {booking.occasion && (
                            <div className="booking-occasion">
                              <span className="occasion-icon">🎉</span>
                              {booking.occasion}
                            </div>
                          )}

                          {booking.specialRequests && (
                            <div className="booking-requests">
                              <span className="requests-label">Special Requests:</span>
                              <p>{booking.specialRequests}</p>
                            </div>
                          )}

                          {/* Pre-Order Badge */}
                          {booking.hasPreOrder && booking.preOrderedItems && booking.preOrderedItems.length > 0 && (
                            <div className="booking-preorder-badge">
                              <span className="preorder-badge-icon">🍽️</span>
                              <span className="preorder-badge-text">
                                {booking.preOrderedItems.length} items pre-ordered • ₹{booking.preOrderTotal}
                              </span>
                              <span className={`payment-status-pill ${booking.preOrderPayment ? 'paid' : 'pending'}`}>
                                {booking.preOrderPayment ? '✅ Paid' : '⏳ Unpaid'}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="booking-card-footer">
                          <button 
                            className="view-btn"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            View Details
                          </button>
                          {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                            <button 
                              className="cancel-btn"
                              onClick={() => handleCancelBooking(booking._id)}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Past Bookings */}
              {pastBookings.length > 0 && (
                <div className="bookings-section past">
                  <h2>
                    <span className="section-icon">📋</span>
                    Past & Cancelled Reservations
                  </h2>
                  <div className="bookings-grid">
                    {pastBookings.map((booking) => (
                      <div key={booking._id} className={`booking-card past ${getStatusClass(booking.status)}`}>
                        <div className="booking-card-header">
                          <div className="booking-id">
                            <span>#</span>{booking._id.slice(-8).toUpperCase()}
                          </div>
                          <span className={`status-badge ${getStatusClass(booking.status)}`}>
                            {booking.status === 'Completed' && '✅'}
                            {booking.status === 'Cancelled' && '❌'}
                            {booking.status === 'Pending' && '⏳'}
                            {booking.status === 'Confirmed' && '✓'}
                            {booking.status}
                          </span>
                        </div>

                        <div className="booking-card-body">
                          <div className="booking-datetime">
                            <div className="date-block">
                              <span className="day">{new Date(booking.date).getDate()}</span>
                              <span className="month">{new Date(booking.date).toLocaleString('en-US', { month: 'short' })}</span>
                            </div>
                            <div className="time-info">
                              <span className="time">{booking.time}</span>
                              <span className="guests">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                  <circle cx="9" cy="7" r="4"/>
                                </svg>
                                {booking.guests} Guest{booking.guests !== '1' ? 's' : ''}
                              </span>
                            </div>
                          </div>

                          {booking.tableNumber && (
                            <div className="booking-table-info">
                              <span className="table-icon">🪑</span>
                              <span className="table-text">
                                Table {booking.tableNumber}
                                {booking.tableName && ` - ${booking.tableName}`}
                              </span>
                            </div>
                          )}

                          {booking.occasion && (
                            <div className="booking-occasion">
                              <span className="occasion-icon">🎉</span>
                              {booking.occasion}
                            </div>
                          )}
                        </div>

                        <div className="booking-card-footer">
                          <button 
                            className="view-btn"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            View Details
                          </button>
                          {booking.status !== 'Cancelled' && (
                            <Link to="/book-table" className="rebook-btn">
                              Book Again
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Book More CTA */}
              <div className="book-more-cta">
                <h3>Planning another visit?</h3>
                <Link to="/book-table" className="book-table-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Book a New Table
                </Link>
              </div>
            </div>
          )}
        </>
      )}

      {/* Initial State */}
      {!loading && !searched && !userInfo && (
        <div className="initial-state">
          <div className="initial-icon">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
          <h3>Enter your email or phone number</h3>
          <p>to view your booking history</p>
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
              <div className="modal-booking-id">
                <span className="label">Booking ID</span>
                <span className="value">#{selectedBooking._id.slice(-8).toUpperCase()}</span>
              </div>

              <div className={`modal-status ${getStatusClass(selectedBooking.status)}`}>
                {selectedBooking.status === 'Pending' && '⏳'}
                {selectedBooking.status === 'Confirmed' && '✅'}
                {selectedBooking.status === 'Completed' && '🎉'}
                {selectedBooking.status === 'Cancelled' && '❌'}
                {selectedBooking.status}
              </div>

              <div className="modal-details">
                <div className="detail-group">
                  <span className="detail-icon">📅</span>
                  <div>
                    <span className="detail-label">Date</span>
                    <span className="detail-value">{formatDate(selectedBooking.date)}</span>
                  </div>
                </div>
                <div className="detail-group">
                  <span className="detail-icon">🕐</span>
                  <div>
                    <span className="detail-label">Time</span>
                    <span className="detail-value">{selectedBooking.time}</span>
                  </div>
                </div>
                <div className="detail-group">
                  <span className="detail-icon">👥</span>
                  <div>
                    <span className="detail-label">Guests</span>
                    <span className="detail-value">{selectedBooking.guests} Guest{selectedBooking.guests !== '1' ? 's' : ''}</span>
                  </div>
                </div>
                {selectedBooking.tableNumber && (
                  <div className="detail-group table-detail">
                    <span className="detail-icon">🪑</span>
                    <div>
                      <span className="detail-label">Table</span>
                      <span className="detail-value">
                        Table {selectedBooking.tableNumber}
                        {selectedBooking.tableName && ` - ${selectedBooking.tableName}`}
                      </span>
                    </div>
                  </div>
                )}
                {selectedBooking.occasion && (
                  <div className="detail-group">
                    <span className="detail-icon">🎉</span>
                    <div>
                      <span className="detail-label">Occasion</span>
                      <span className="detail-value">{selectedBooking.occasion}</span>
                    </div>
                  </div>
                )}
              </div>

              {selectedBooking.specialRequests && (
                <div className="modal-requests">
                  <span className="requests-title">Special Requests</span>
                  <p>{selectedBooking.specialRequests}</p>
                </div>
              )}

              {/* Pre-Ordered Food */}
              {selectedBooking.hasPreOrder && selectedBooking.preOrderedItems && selectedBooking.preOrderedItems.length > 0 && (
                <div className="modal-preorder">
                  <h4>🍽️ Pre-Ordered Food</h4>
                  <div className="modal-preorder-items">
                    {selectedBooking.preOrderedItems.map((item, idx) => (
                      <div key={idx} className="modal-preorder-item">
                        <img src={item.image} alt={item.name} />
                        <div className="preorder-item-info">
                          <span className="preorder-item-name">{item.name}</span>
                          <span className="preorder-item-qty">Qty: {item.quantity}</span>
                        </div>
                        <span className="preorder-item-price">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="modal-preorder-total">
                    <span>Food Total</span>
                    <span>₹{selectedBooking.preOrderTotal}</span>
                  </div>
                  <div className={`modal-payment-status ${selectedBooking.preOrderPayment ? 'paid' : 'pending'}`}>
                    {selectedBooking.preOrderPayment ? (
                      <>
                        <span className="payment-status-icon">✅</span>
                        <span className="payment-status-text">Payment Completed</span>
                        {selectedBooking.paymentId && (
                          <span className="payment-id-text">ID: {selectedBooking.paymentId}</span>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="payment-status-icon">⏳</span>
                        <span className="payment-status-text">Payment Pending</span>
                        <span className="payment-note-text">Pay at the restaurant</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="modal-contact">
                <h4>Contact Details</h4>
                <p><strong>Name:</strong> {selectedBooking.name}</p>
                <p><strong>Email:</strong> {selectedBooking.email}</p>
                <p><strong>Phone:</strong> {selectedBooking.phone}</p>
              </div>
            </div>

            <div className="modal-footer">
              {(selectedBooking.status === 'Pending' || selectedBooking.status === 'Confirmed') && isUpcoming(selectedBooking.date) && (
                <button 
                  className="cancel-booking-btn"
                  onClick={() => {
                    handleCancelBooking(selectedBooking._id);
                    setSelectedBooking(null);
                  }}
                >
                  Cancel Booking
                </button>
              )}
              <button className="close-modal-btn" onClick={() => setSelectedBooking(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;

