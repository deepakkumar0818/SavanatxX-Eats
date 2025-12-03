import React, { useContext, useState } from 'react';
import './Favourites.css';
import { StoreContext } from '../../context/StoreContext';
import { Link, useNavigate } from 'react-router-dom';

const Favourites = () => {
  const { food_list, favourites, removeFromFavourites, addToCart, cartItems } = useContext(StoreContext);
  const navigate = useNavigate();
  
  // Single item order state
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  // Order All state
  const [showOrderAllModal, setShowOrderAllModal] = useState(false);
  const [orderAllItems, setOrderAllItems] = useState([]);
  const [orderAllSuccess, setOrderAllSuccess] = useState(false);

  // Get favourite food items
  const favouriteItems = food_list.filter(item => favourites.includes(item._id));

  // Handle single item quick order
  const handleQuickOrder = (item) => {
    setSelectedItem(item);
    setQuantity(1);
    setShowOrderModal(true);
    setOrderSuccess(false);
  };

  // Handle order all favourites
  const handleOrderAll = () => {
    // Initialize all items with quantity 1
    const items = favouriteItems.map(item => ({
      ...item,
      orderQty: 1
    }));
    setOrderAllItems(items);
    setShowOrderAllModal(true);
    setOrderAllSuccess(false);
  };

  // Update quantity for an item in order all
  const updateOrderAllQty = (itemId, change) => {
    setOrderAllItems(prev => 
      prev.map(item => 
        item._id === itemId 
          ? { ...item, orderQty: Math.max(1, item.orderQty + change) }
          : item
      )
    );
  };

  // Remove item from order all
  const removeFromOrderAll = (itemId) => {
    setOrderAllItems(prev => prev.filter(item => item._id !== itemId));
  };

  // Calculate order all total
  const getOrderAllTotal = () => {
    return orderAllItems.reduce((sum, item) => sum + (item.price * item.orderQty), 0);
  };

  // Get total items count for order all
  const getOrderAllItemCount = () => {
    return orderAllItems.reduce((sum, item) => sum + item.orderQty, 0);
  };

  // Add to cart and go to checkout (single item)
  const handleAddAndCheckout = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(selectedItem._id);
    }
    setOrderSuccess(true);
  };

  // Add all items to cart
  const handleAddAllToCart = () => {
    orderAllItems.forEach(item => {
      for (let i = 0; i < item.orderQty; i++) {
        addToCart(item._id);
      }
    });
    setOrderAllSuccess(true);
  };

  // Get item count in cart
  const getItemCartCount = (itemId) => {
    return cartItems?.[itemId] || 0;
  };

  return (
    <div className="favourites-page">
      {/* Header */}
      <div className="favourites-header">
        <div className="header-content">
          <div className="header-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <div>
            <h1>My Favourites</h1>
            <p>{favouriteItems.length} dish{favouriteItems.length !== 1 ? 'es' : ''} saved</p>
          </div>
        </div>
        {/* Order All Button in Header */}
        {favouriteItems.length > 0 && (
          <button className="header-order-all-btn" onClick={handleOrderAll}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            Order All Favourites
          </button>
        )}
      </div>

      {/* Content */}
      {favouriteItems.length === 0 ? (
        <div className="empty-favourites">
          <div className="empty-icon">
            <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <h2>No favourites yet</h2>
          <p>Start adding dishes you love by clicking the heart icon on any dish!</p>
          <Link to="/menu" className="browse-menu-btn">
            Browse Menu
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      ) : (
        <>
          {/* Quick Actions */}
          <div className="favourites-actions">
            <button className="order-all-btn" onClick={handleOrderAll}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              Quick Order All ({favouriteItems.length} items)
            </button>
            <button 
              className="clear-all-btn"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all favourites?')) {
                  favourites.forEach(id => removeFromFavourites(id));
                }
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
              Clear All
            </button>
          </div>

          {/* Favourites Grid */}
          <div className="favourites-grid">
            {favouriteItems.map((item) => (
              <div key={item._id} className="favourite-item-card">
                {/* Remove Button */}
                <button 
                  className="remove-favourite-btn"
                  onClick={() => removeFromFavourites(item._id)}
                  title="Remove from favourites"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>

                {/* Item Image */}
                <div className="fav-item-image">
                  <img src={item.image} alt={item.name} />
                  {item.offer && <span className="fav-offer-badge">{item.offer}</span>}
                  {item.isBestseller && <span className="fav-bestseller-badge">⭐ Bestseller</span>}
                </div>

                {/* Item Info */}
                <div className="fav-item-info">
                  <div className="fav-item-header">
                    <span className={`fav-veg-indicator ${item.isVeg ? 'veg' : 'non-veg'}`}>
                      <span></span>
                    </span>
                    <h3>{item.name}</h3>
                  </div>
                  <p className="fav-item-description">{item.description}</p>
                  <div className="fav-item-meta">
                    <span className="fav-item-price">₹{item.price}</span>
                    <span className="fav-item-rating">
                      ⭐ {item.rating || 4.0}
                    </span>
                    <span className="fav-item-time">
                      🕐 {item.deliveryTime || '25-30 min'}
                    </span>
                  </div>
                  
                  {/* Cart Status */}
                  {getItemCartCount(item._id) > 0 && (
                    <div className="fav-cart-status">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                      </svg>
                      {getItemCartCount(item._id)} in cart
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="fav-item-actions">
                  <button 
                    className="fav-add-cart-btn"
                    onClick={() => addToCart(item._id)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    Add to Cart
                  </button>
                  <button 
                    className="fav-order-btn"
                    onClick={() => handleQuickOrder(item)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    Quick Order
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Suggestion */}
          <div className="favourites-suggestion">
            <h3>🍽️ Hungry for more?</h3>
            <p>Explore our menu to discover new dishes</p>
            <Link to="/menu" className="explore-btn">
              Explore Menu
            </Link>
          </div>
        </>
      )}

      {/* Single Item Quick Order Modal */}
      {showOrderModal && selectedItem && (
        <div className="quick-order-modal-overlay" onClick={() => setShowOrderModal(false)}>
          <div className="quick-order-modal" onClick={(e) => e.stopPropagation()}>
            {!orderSuccess ? (
              <>
                <div className="qo-modal-header">
                  <h3>Quick Order</h3>
                  <button className="qo-close-btn" onClick={() => setShowOrderModal(false)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>

                <div className="qo-item-preview">
                  <img src={selectedItem.image} alt={selectedItem.name} />
                  <div className="qo-item-details">
                    <div className="qo-item-name-row">
                      <span className={`qo-veg-indicator ${selectedItem.isVeg ? 'veg' : 'non-veg'}`}>
                        <span></span>
                      </span>
                      <h4>{selectedItem.name}</h4>
                    </div>
                    <p className="qo-item-price">₹{selectedItem.price}</p>
                    <div className="qo-item-rating">
                      ⭐ {selectedItem.rating || 4.0} • {selectedItem.deliveryTime || '25-30 min'}
                    </div>
                  </div>
                </div>

                <div className="qo-quantity-section">
                  <span className="qo-qty-label">Quantity</span>
                  <div className="qo-quantity-controls">
                    <button 
                      className="qo-qty-btn"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <span className="qo-qty-value">{quantity}</span>
                    <button 
                      className="qo-qty-btn"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="qo-total-section">
                  <div className="qo-total-row">
                    <span>Item Total</span>
                    <span>₹{selectedItem.price * quantity}</span>
                  </div>
                  <div className="qo-total-row">
                    <span>Delivery Fee</span>
                    <span>₹40</span>
                  </div>
                  <div className="qo-total-row qo-grand-total">
                    <span>Grand Total</span>
                    <span>₹{selectedItem.price * quantity + 40}</span>
                  </div>
                </div>

                <button className="qo-checkout-btn" onClick={handleAddAndCheckout}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  Add {quantity} to Cart - ₹{selectedItem.price * quantity}
                </button>
              </>
            ) : (
              <div className="qo-success">
                <div className="qo-success-icon">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#60b246" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <h3>Added to Cart! 🎉</h3>
                <p>{quantity}x {selectedItem.name} added successfully</p>
                <div className="qo-success-actions">
                  <button 
                    className="qo-continue-btn"
                    onClick={() => setShowOrderModal(false)}
                  >
                    Continue Browsing
                  </button>
                  <button 
                    className="qo-goto-cart-btn"
                    onClick={() => navigate('/cart')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    Go to Cart
                  </button>
                  <button 
                    className="qo-checkout-now-btn"
                    onClick={() => navigate('/order')}
                  >
                    Checkout Now →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order All Modal */}
      {showOrderAllModal && (
        <div className="quick-order-modal-overlay" onClick={() => setShowOrderAllModal(false)}>
          <div className="quick-order-modal order-all-modal" onClick={(e) => e.stopPropagation()}>
            {!orderAllSuccess ? (
              <>
                <div className="qo-modal-header order-all-header">
                  <div>
                    <h3>Order All Favourites</h3>
                    <span className="order-all-subtitle">{orderAllItems.length} items</span>
                  </div>
                  <button className="qo-close-btn" onClick={() => setShowOrderAllModal(false)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>

                {/* Items List */}
                <div className="order-all-items-list">
                  {orderAllItems.length === 0 ? (
                    <div className="order-all-empty">
                      <p>No items to order</p>
                    </div>
                  ) : (
                    orderAllItems.map((item) => (
                      <div key={item._id} className="order-all-item">
                        <img src={item.image} alt={item.name} className="order-all-item-img" />
                        <div className="order-all-item-info">
                          <div className="order-all-item-name">
                            <span className={`order-all-veg ${item.isVeg ? 'veg' : 'non-veg'}`}>
                              <span></span>
                            </span>
                            <h4>{item.name}</h4>
                          </div>
                          <p className="order-all-item-price">₹{item.price} each</p>
                        </div>
                        <div className="order-all-item-controls">
                          <div className="order-all-qty">
                            <button onClick={() => updateOrderAllQty(item._id, -1)} disabled={item.orderQty <= 1}>−</button>
                            <span>{item.orderQty}</span>
                            <button onClick={() => updateOrderAllQty(item._id, 1)}>+</button>
                          </div>
                          <span className="order-all-item-total">₹{item.price * item.orderQty}</span>
                          <button 
                            className="order-all-remove-btn"
                            onClick={() => removeFromOrderAll(item._id)}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Order All Summary */}
                {orderAllItems.length > 0 && (
                  <>
                    <div className="qo-total-section order-all-summary">
                      <div className="qo-total-row">
                        <span>Items Total ({getOrderAllItemCount()} items)</span>
                        <span>₹{getOrderAllTotal()}</span>
                      </div>
                      <div className="qo-total-row">
                        <span>Delivery Fee</span>
                        <span>₹40</span>
                      </div>
                      <div className="qo-total-row qo-grand-total">
                        <span>Grand Total</span>
                        <span>₹{getOrderAllTotal() + 40}</span>
                      </div>
                    </div>

                    <button className="qo-checkout-btn order-all-checkout-btn" onClick={handleAddAllToCart}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                      </svg>
                      Add All to Cart - ₹{getOrderAllTotal()}
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="qo-success">
                <div className="qo-success-icon">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#60b246" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <h3>All Items Added! 🎉</h3>
                <p>{getOrderAllItemCount()} items worth ₹{getOrderAllTotal()} added to cart</p>
                <div className="qo-success-actions">
                  <button 
                    className="qo-continue-btn"
                    onClick={() => setShowOrderAllModal(false)}
                  >
                    Continue Browsing
                  </button>
                  <button 
                    className="qo-goto-cart-btn"
                    onClick={() => navigate('/cart')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    Go to Cart
                  </button>
                  <button 
                    className="qo-checkout-now-btn"
                    onClick={() => navigate('/order')}
                  >
                    Checkout Now →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Favourites;
