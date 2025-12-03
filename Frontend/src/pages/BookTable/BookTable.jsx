import { useState, useContext, useEffect } from 'react';
import './BookTable.css';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';

const BookTable = () => {
  const { url, food_list } = useContext(StoreContext);
  
  // Multi-step form
  const [step, setStep] = useState(1); // 1: Details, 2: Pre-order Food, 3: Review, 4: Payment
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    occasion: '',
    specialRequests: ''
  });

  // Table selection state
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tablesLoading, setTablesLoading] = useState(false);
  const [showTableSelection, setShowTableSelection] = useState(false);

  // Pre-order state
  const [preOrderItems, setPreOrderItems] = useState({});
  const [wantPreOrder, setWantPreOrder] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [hasPreOrder, setHasPreOrder] = useState(false);
  const [paymentId, setPaymentId] = useState('');
  const [isPaid, setIsPaid] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch available tables when date, time, and guests are selected
  const fetchAvailableTables = async () => {
    if (!formData.date || !formData.time || !formData.guests) return;
    
    setTablesLoading(true);
    try {
      const response = await axios.get(`${url}/api/table/available`, {
        params: {
          date: formData.date,
          time: formData.time,
          guests: formData.guests
        }
      });
      
      if (response.data.success) {
        setAvailableTables(response.data.data);
        setShowTableSelection(true);
        // Auto-select first table if available
        if (response.data.data.length > 0 && !selectedTable) {
          setSelectedTable(response.data.data[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching tables:', err);
    }
    setTablesLoading(false);
  };

  // Fetch tables when required fields change
  useEffect(() => {
    if (formData.date && formData.time && formData.guests) {
      fetchAvailableTables();
    } else {
      setShowTableSelection(false);
      setSelectedTable(null);
    }
  }, [formData.date, formData.time, formData.guests]);

  const getLocationIcon = (location) => {
    switch(location) {
      case 'indoor': return '🏠';
      case 'outdoor': return '🌳';
      case 'balcony': return '🌅';
      case 'private': return '🚪';
      case 'rooftop': return '🌃';
      default: return '🪑';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  // Pre-order functions
  const addPreOrderItem = (itemId) => {
    setPreOrderItems(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removePreOrderItem = (itemId) => {
    setPreOrderItems(prev => {
      const newItems = { ...prev };
      if (newItems[itemId] > 1) {
        newItems[itemId]--;
      } else {
        delete newItems[itemId];
      }
      return newItems;
    });
  };

  const getPreOrderTotal = () => {
    let total = 0;
    for (const itemId in preOrderItems) {
      const item = food_list.find(f => f._id === itemId);
      if (item) {
        total += item.price * preOrderItems[itemId];
      }
    }
    return total;
  };

  const getPreOrderItemsArray = () => {
    const items = [];
    for (const itemId in preOrderItems) {
      const item = food_list.find(f => f._id === itemId);
      if (item && preOrderItems[itemId] > 0) {
        items.push({
          _id: item._id,
          name: item.name,
          price: item.price,
          quantity: preOrderItems[itemId],
          image: item.image
        });
      }
    }
    return items;
  };

  const getPreOrderItemCount = () => {
    return Object.values(preOrderItems).reduce((sum, qty) => sum + qty, 0);
  };

  // Get unique categories
  const categories = ['All', ...new Set(food_list.map(item => item.category))];

  // Filter food by category
  const filteredFood = selectedCategory === 'All' 
    ? food_list 
    : food_list.filter(item => item.category === selectedCategory);

  // Handle Razorpay Payment
  const handlePayment = async (bookingIdParam) => {
    try {
      const amount = getPreOrderTotal();
      
      // Create Razorpay order
      const orderResponse = await axios.post(`${url}/api/booking/payment/create`, {
        bookingId: bookingIdParam,
        amount: amount
      });

      if (!orderResponse.data.success) {
        setError(orderResponse.data.message);
        return false;
      }

      const { order, key } = orderResponse.data;

      // Razorpay options
      const options = {
        key: key,
        amount: order.amount,
        currency: order.currency,
        name: "SavantX Eats",
        description: `Pre-Order Payment for Booking #${bookingIdParam.slice(-8).toUpperCase()}`,
        order_id: order.id,
        handler: async function (response) {
          // Verify payment
          try {
            const verifyResponse = await axios.post(`${url}/api/booking/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: bookingIdParam
            });

            if (verifyResponse.data.success) {
              setPaymentId(response.razorpay_payment_id);
              setIsPaid(true);
              setIsSubmitted(true);
            } else {
              setError('Payment verification failed. Please contact support.');
            }
          } catch (err) {
            console.error('Payment verification error:', err);
            setError('Payment verification failed.');
          }
          setIsLoading(false);
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#e23744"
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
            setError('Payment was cancelled. Your booking is saved but payment is pending.');
            setIsSubmitted(true); // Show success but payment pending
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      return true;
    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment initialization failed.');
      setIsLoading(false);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const preOrderedItems = getPreOrderItemsArray();
      const preOrderTotal = getPreOrderTotal();

      const bookingData = {
        ...formData,
        tableId: selectedTable?._id || null,
        tableNumber: selectedTable?.tableNumber || '',
        tableName: selectedTable?.tableName || '',
        preOrderedItems: wantPreOrder ? preOrderedItems : [],
        preOrderTotal: wantPreOrder ? preOrderTotal : 0
      };

      const response = await axios.post(`${url}/api/booking/create`, bookingData);
      
      if (response.data.success) {
        const newBookingId = response.data.bookingId;
        setBookingId(newBookingId);
        setHasPreOrder(response.data.hasPreOrder);

        // If pre-order exists and has items, initiate payment
        if (response.data.hasPreOrder && preOrderTotal > 0) {
          await handlePayment(newBookingId);
        } else {
          // No pre-order, complete booking directly
          setIsSubmitted(true);
          setIsLoading(false);
        }
      } else {
        setError(response.data.message || 'Failed to book table. Please try again.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Booking error:', err);
      setError('Something went wrong. Please try again later.');
      setIsLoading(false);
    }
  };

  // Validate step 1
  const canProceedToStep2 = () => {
    return formData.name && formData.email && formData.phone && formData.date && formData.time && formData.guests;
  };

  // Get today's date for min date attribute
  const today = new Date().toISOString().split('T')[0];

  // Time slots
  const timeSlots = [
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM',
    '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'
  ];

  // Occasions
  const occasions = [
    'Birthday', 'Anniversary', 'Date Night', 'Business Meal', 
    'Family Gathering', 'Celebration', 'Other'
  ];

  // Success Screen
  if (isSubmitted) {
    const preOrderedItems = getPreOrderItemsArray();
    return (
      <div className="book-table-page">
        <div className="booking-success">
          <div className="success-icon">✓</div>
          <h2>Reservation Confirmed!</h2>
          <p>Thank you, {formData.name}! Your table has been booked.</p>
          
          {bookingId && (
            <div className="booking-id-section">
              <span className="booking-id-label">Booking ID</span>
              <span className="booking-id-value">#{bookingId.slice(-8).toUpperCase()}</span>
            </div>
          )}

          <div className="booking-details">
            <div className="detail-item">
              <span className="detail-icon">📅</span>
              <div>
                <span className="detail-label">Date</span>
                <span className="detail-value">{new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">🕐</span>
              <div>
                <span className="detail-label">Time</span>
                <span className="detail-value">{formData.time}</span>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">👥</span>
              <div>
                <span className="detail-label">Guests</span>
                <span className="detail-value">{formData.guests} {formData.guests === '1' ? 'Guest' : 'Guests'}</span>
              </div>
            </div>
            {selectedTable && (
              <div className="detail-item">
                <span className="detail-icon">🪑</span>
                <div>
                  <span className="detail-label">Table</span>
                  <span className="detail-value">
                    Table {selectedTable.tableNumber}
                    {selectedTable.tableName && ` - ${selectedTable.tableName}`}
                    <span className="table-location-badge">{getLocationIcon(selectedTable.location)} {selectedTable.location}</span>
                  </span>
                </div>
              </div>
            )}
            {formData.occasion && (
              <div className="detail-item">
                <span className="detail-icon">🎉</span>
                <div>
                  <span className="detail-label">Occasion</span>
                  <span className="detail-value">{formData.occasion}</span>
                </div>
              </div>
            )}
          </div>

          {/* Pre-ordered Items */}
          {hasPreOrder && preOrderedItems.length > 0 && (
            <div className="success-preorder">
              <h3>🍽️ Pre-Ordered Food</h3>
              <div className="preorder-items-list">
                {preOrderedItems.map((item, idx) => (
                  <div key={idx} className="preorder-item-row">
                    <span className="item-name">{item.name}</span>
                    <span className="item-qty">×{item.quantity}</span>
                    <span className="item-price">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="preorder-total-row">
                <span>Food Total</span>
                <span>₹{getPreOrderTotal()}</span>
              </div>
              
              {/* Payment Status */}
              <div className={`payment-status-box ${isPaid ? 'paid' : 'pending'}`}>
                {isPaid ? (
                  <>
                    <span className="payment-status-icon">✅</span>
                    <div className="payment-status-info">
                      <span className="payment-status-label">Payment Successful</span>
                      <span className="payment-id">ID: {paymentId}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="payment-status-icon">⏳</span>
                    <div className="payment-status-info">
                      <span className="payment-status-label">Payment Pending</span>
                      <span className="payment-note">Please pay at the restaurant</span>
                    </div>
                  </>
                )}
              </div>
              
              <p className="preorder-note">Your food will be ready when you arrive!</p>
            </div>
          )}

          <div className="booking-status-info">
            <span className="status-badge pending">⏳ Pending Confirmation</span>
            <p>Our team will confirm your reservation shortly.</p>
          </div>

          <p className="confirmation-note">A confirmation email has been sent to {formData.email}</p>
          <button className="new-booking-btn" onClick={() => {
            setIsSubmitted(false);
            setBookingId('');
            setStep(1);
            setPreOrderItems({});
            setWantPreOrder(false);
            setFormData({
              name: '', email: '', phone: '', date: '', time: '',
              guests: '2', occasion: '', specialRequests: ''
            });
          }}>
            Make Another Reservation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="book-table-page">
      {/* Hero Section */}
      <div className="book-table-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Reserve Your Table</h1>
          <p>Book a table and pre-order your favorite dishes</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="booking-steps">
        <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <span className="step-number">1</span>
          <span className="step-label">Reservation Details</span>
        </div>
        <div className="step-line"></div>
        <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <span className="step-number">2</span>
          <span className="step-label">Pre-Order Food</span>
        </div>
        <div className="step-line"></div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <span className="step-number">3</span>
          <span className="step-label">Confirm Booking</span>
        </div>
      </div>

      {/* Step 1: Reservation Details */}
      {step === 1 && (
        <div className="booking-section">
          <div className="booking-container">
            {/* Info Side */}
            <div className="booking-info">
              <h2>Dine With Us</h2>
              <p>Experience exceptional cuisine in an elegant atmosphere. Our team is ready to make your visit memorable.</p>
              
              <div className="info-cards">
                <div className="info-card">
                  <span className="info-icon">🕐</span>
                  <div>
                    <h4>Opening Hours</h4>
                    <p>Mon - Fri: 11 AM - 10 PM</p>
                    <p>Sat - Sun: 10 AM - 11 PM</p>
                  </div>
                </div>
                <div className="info-card">
                  <span className="info-icon">📍</span>
                  <div>
                    <h4>Location</h4>
                    <p>123 Food Street</p>
                    <p>New York, NY 10001</p>
                  </div>
                </div>
                <div className="info-card">
                  <span className="info-icon">📞</span>
                  <div>
                    <h4>Contact</h4>
                    <p>+91 98765 43210</p>
                    <p>reservations@tomato.com</p>
                  </div>
                </div>
              </div>

              <div className="features">
                <div className="feature">
                  <span>✓</span> Free Parking
                </div>
                <div className="feature">
                  <span>✓</span> Wheelchair Accessible
                </div>
                <div className="feature">
                  <span>✓</span> Private Dining Available
                </div>
                <div className="feature">
                  <span>✓</span> Pre-Order Your Food
                </div>
              </div>
            </div>

            {/* Form Side */}
            <div className="booking-form-container">
              <h3>Step 1: Reservation Details</h3>
              
              {error && (
                <div className="booking-error">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M15 9l-6 6M9 9l6 6"/>
                  </svg>
                  {error}
                </div>
              )}

              <div className="booking-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="date">Date *</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={today}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="time">Time *</label>
                    <select
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Time</option>
                      {timeSlots.map((slot, index) => (
                        <option key={index} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="guests">Number of Guests *</label>
                    <select
                      id="guests"
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      required
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                      <option value="10+">10+ Guests</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="occasion">Occasion (Optional)</label>
                    <select
                      id="occasion"
                      name="occasion"
                      value={formData.occasion}
                      onChange={handleChange}
                    >
                      <option value="">Select Occasion</option>
                      {occasions.map((occ, index) => (
                        <option key={index} value={occ}>{occ}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Table Selection */}
                {showTableSelection && (
                  <div className="table-selection-section">
                    <div className="table-selection-header">
                      <label>🪑 Select Your Table</label>
                      {tablesLoading && <span className="table-loading-text">Loading tables...</span>}
                    </div>
                    
                    {!tablesLoading && availableTables.length === 0 ? (
                      <div className="no-tables-message">
                        <span className="no-tables-icon">😔</span>
                        <p>No tables available for {formData.guests} guests at {formData.time}.</p>
                        <span>Try a different time or date.</span>
                      </div>
                    ) : (
                      <div className="available-tables-grid">
                        {availableTables.map((table) => (
                          <div 
                            key={table._id} 
                            className={`table-option-card ${selectedTable?._id === table._id ? 'selected' : ''}`}
                            onClick={() => setSelectedTable(table)}
                          >
                            <div className="table-option-header">
                              <span className="table-location-icon">{getLocationIcon(table.location)}</span>
                              <div className="table-option-title">
                                <h4>Table {table.tableNumber}</h4>
                                {table.tableName && <span className="table-name-sub">{table.tableName}</span>}
                              </div>
                              {selectedTable?._id === table._id && (
                                <span className="table-selected-badge">✓</span>
                              )}
                            </div>
                            <div className="table-option-details">
                              <span className="table-detail">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                  <circle cx="9" cy="7" r="4"/>
                                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                </svg>
                                {table.capacity} seats
                              </span>
                              <span className="table-detail location">
                                {table.location}
                              </span>
                            </div>
                            {table.features && table.features.length > 0 && (
                              <div className="table-option-features">
                                {table.features.slice(0, 2).map((f, idx) => (
                                  <span key={idx} className="feature-mini">{f}</span>
                                ))}
                                {table.features.length > 2 && (
                                  <span className="feature-more-count">+{table.features.length - 2}</span>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="specialRequests">Special Requests (Optional)</label>
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    placeholder="Any dietary restrictions, seating preferences, or special arrangements..."
                    rows="3"
                  ></textarea>
                </div>

                <button 
                  type="button" 
                  className="submit-btn"
                  onClick={() => setStep(2)}
                  disabled={!canProceedToStep2()}
                >
                  <span>Continue to Pre-Order Food</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Pre-Order Food */}
      {step === 2 && (
        <div className="preorder-section">
          <div className="preorder-header">
            <h2>🍽️ Would you like to pre-order food?</h2>
            <p>Have your food ready when you arrive - no waiting!</p>
            
            <div className="preorder-choice">
              <button 
                className={`choice-btn ${wantPreOrder ? 'active' : ''}`}
                onClick={() => setWantPreOrder(true)}
              >
                <span className="choice-icon">✓</span>
                Yes, Pre-Order Food
              </button>
              <button 
                className={`choice-btn skip ${!wantPreOrder ? 'active' : ''}`}
                onClick={() => setWantPreOrder(false)}
              >
                <span className="choice-icon">→</span>
                Skip, Order at Restaurant
              </button>
            </div>
          </div>

          {wantPreOrder && (
            <div className="preorder-content">
              {/* Category Filter */}
              <div className="category-filter">
                {categories.map((cat, idx) => (
                  <button
                    key={idx}
                    className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Food Grid */}
              <div className="preorder-food-grid">
                {filteredFood.map((item) => (
                  <div key={item._id} className="preorder-food-item">
                    <img src={item.image} alt={item.name} />
                    <div className="food-item-info">
                      <h4>{item.name}</h4>
                      <p className="food-price">₹{item.price}</p>
                    </div>
                    <div className="food-item-actions">
                      {!preOrderItems[item._id] ? (
                        <button className="add-btn" onClick={() => addPreOrderItem(item._id)}>
                          + Add
                        </button>
                      ) : (
                        <div className="qty-controls">
                          <button onClick={() => removePreOrderItem(item._id)}>−</button>
                          <span>{preOrderItems[item._id]}</span>
                          <button onClick={() => addPreOrderItem(item._id)}>+</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pre-Order Cart Summary */}
              {getPreOrderItemCount() > 0 && (
                <div className="preorder-cart-summary">
                  <div className="cart-summary-header">
                    <h3>🛒 Pre-Order Summary</h3>
                    <span className="item-count">{getPreOrderItemCount()} items</span>
                  </div>
                  <div className="cart-items">
                    {getPreOrderItemsArray().map((item, idx) => (
                      <div key={idx} className="cart-item">
                        <span className="cart-item-name">{item.name}</span>
                        <span className="cart-item-qty">×{item.quantity}</span>
                        <span className="cart-item-price">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="cart-total">
                    <span>Total</span>
                    <span>₹{getPreOrderTotal()}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="step-navigation">
            <button className="back-btn" onClick={() => setStep(1)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back
            </button>
            <button className="next-btn" onClick={() => setStep(3)}>
              Review & Confirm
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Confirm */}
      {step === 3 && (
        <div className="review-section">
          <h2>📋 Review Your Booking</h2>
          
          <div className="review-content">
            {/* Reservation Details */}
            <div className="review-card">
              <h3>📅 Reservation Details</h3>
              <div className="review-details">
                <div className="review-row">
                  <span className="label">Name</span>
                  <span className="value">{formData.name}</span>
                </div>
                <div className="review-row">
                  <span className="label">Email</span>
                  <span className="value">{formData.email}</span>
                </div>
                <div className="review-row">
                  <span className="label">Phone</span>
                  <span className="value">{formData.phone}</span>
                </div>
                <div className="review-row">
                  <span className="label">Date</span>
                  <span className="value">{new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="review-row">
                  <span className="label">Time</span>
                  <span className="value">{formData.time}</span>
                </div>
                <div className="review-row">
                  <span className="label">Guests</span>
                  <span className="value">{formData.guests} {formData.guests === '1' ? 'Guest' : 'Guests'}</span>
                </div>
                {selectedTable && (
                  <div className="review-row table-row">
                    <span className="label">Table</span>
                    <span className="value table-value">
                      <span className="table-icon">{getLocationIcon(selectedTable.location)}</span>
                      Table {selectedTable.tableNumber}
                      {selectedTable.tableName && <span className="table-name-badge">{selectedTable.tableName}</span>}
                      <span className="table-capacity">{selectedTable.capacity} seats • {selectedTable.location}</span>
                    </span>
                  </div>
                )}
                {formData.occasion && (
                  <div className="review-row">
                    <span className="label">Occasion</span>
                    <span className="value">{formData.occasion}</span>
                  </div>
                )}
                {formData.specialRequests && (
                  <div className="review-row">
                    <span className="label">Special Requests</span>
                    <span className="value">{formData.specialRequests}</span>
                  </div>
                )}
              </div>
              <button className="edit-btn" onClick={() => setStep(1)}>Edit</button>
            </div>

            {/* Pre-Order Summary */}
            <div className="review-card">
              <h3>🍽️ Food Pre-Order</h3>
              {wantPreOrder && getPreOrderItemCount() > 0 ? (
                <>
                  <div className="review-preorder-items">
                    {getPreOrderItemsArray().map((item, idx) => (
                      <div key={idx} className="review-preorder-item">
                        <img src={item.image} alt={item.name} />
                        <div className="item-details">
                          <span className="item-name">{item.name}</span>
                          <span className="item-qty">Qty: {item.quantity}</span>
                        </div>
                        <span className="item-price">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="review-preorder-total">
                    <span>Food Total</span>
                    <span>₹{getPreOrderTotal()}</span>
                  </div>
                  <p className="preorder-info">💡 Food will be prepared fresh and ready when you arrive!</p>
                </>
              ) : (
                <div className="no-preorder">
                  <p>No food pre-ordered</p>
                  <span>You can order at the restaurant</span>
                </div>
              )}
              <button className="edit-btn" onClick={() => setStep(2)}>Edit</button>
            </div>
          </div>

          {error && (
            <div className="booking-error">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M15 9l-6 6M9 9l6 6"/>
              </svg>
              {error}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="step-navigation">
            <button className="back-btn" onClick={() => setStep(2)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back
            </button>
            <button className="confirm-btn" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  <span>Confirming...</span>
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  Confirm Booking
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookTable;
