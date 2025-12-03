import { useContext, useState } from "react";
import { createPortal } from "react-dom";
import "./FoodItem.css";
import { StoreContext } from "../../context/StoreContext";

const FoodItem = ({ 
  id, 
  name, 
  image, 
  price, 
  description,
  rating = 4.0,
  reviews = 0,
  deliveryTime = "25-30 min",
  isVeg = true,
  isBestseller = false,
  isNew = false,
  offer = "",
  status = "available"
}) => {
  const { addToCart, removeFromCart, cartItems, isFavourite, toggleFavourite } = useContext(StoreContext);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('add'); // 'add', 'remove', 'favourite'
  
  const isLiked = isFavourite(id);
  
  // Check if item is available for ordering
  const isAvailable = !status || status === 'available';
  const isOutOfStock = status === 'out_of_stock';

  // Safely check if cartItems exists and has the item
  const cartItemCount = cartItems?.[id] || 0;

  // Handle add to cart with notification
  const handleAddToCart = () => {
    addToCart(id);
    setToastMessage(`${name} added to cart!`);
    setToastType('add');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  // Handle remove from cart with notification
  const handleRemoveFromCart = () => {
    removeFromCart(id);
    if (cartItemCount <= 1) {
      setToastMessage(`${name} removed from cart`);
    } else {
      setToastMessage(`${name} quantity updated`);
    }
    setToastType('remove');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  // Format rating color based on value
  const getRatingClass = () => {
    if (rating >= 4.5) return 'rating-excellent';
    if (rating >= 4.0) return 'rating-good';
    if (rating >= 3.5) return 'rating-average';
    return 'rating-low';
  };

  return (
    <div className={`food-item ${!isAvailable ? 'item-unavailable' : ''}`}>
      {/* Image Container */}
      <div className="food-item-img-container">
        <img className="food-item-image" src={image} alt={name} />
        
        {/* Unavailable/Out of Stock Overlay */}
        {!isAvailable && (
          <div className="food-item-status-overlay">
            <div className={`status-badge-large ${isOutOfStock ? 'out-of-stock' : 'unavailable'}`}>
              {isOutOfStock ? (
                <>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>Out of Stock</span>
                </>
              ) : (
                <>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                  </svg>
                  <span>Currently Unavailable</span>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Offer Badge */}
        {offer && isAvailable && (
          <div className="food-item-offer">
            <span>{offer}</span>
          </div>
        )}

        {/* Badges Container */}
        <div className="food-item-badges">
          {isBestseller && (
            <span className="badge badge-bestseller">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              Bestseller
            </span>
          )}
          {isNew && (
            <span className="badge badge-new">NEW</span>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          className={`food-item-wishlist ${isLiked ? 'liked' : ''}`}
          onClick={() => {
            toggleFavourite(id);
            setToastMessage(isLiked ? `${name} removed from favourites` : `${name} added to favourites!`);
            setToastType('favourite');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2500);
          }}
          aria-label={isLiked ? "Remove from favourites" : "Add to favourites"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={isLiked ? "#e23744" : "none"} stroke={isLiked ? "#e23744" : "white"} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Add to Cart - Only show if available */}
        <div className="food-item-cart-actions">
          {isAvailable ? (
            !cartItemCount ? (
              <button 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
              >
                ADD
                <span className="plus-icon">+</span>
              </button>
            ) : (
              <div className="food-item-counter">
                <button onClick={handleRemoveFromCart} className="counter-btn minus">
                  −
                </button>
                <span className="counter-value">{cartItemCount}</span>
                <button onClick={handleAddToCart} className="counter-btn plus">
                  +
                </button>
              </div>
            )
          ) : (
            <button className="add-to-cart-btn disabled" disabled>
              {isOutOfStock ? 'OUT OF STOCK' : 'UNAVAILABLE'}
            </button>
          )}
        </div>
      </div>

      {/* Toast Notification - Rendered at body level using Portal */}
      {showToast && createPortal(
        <div className={`food-item-toast ${toastType}`}>
          <div className="toast-icon">
            {toastType === 'add' && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            )}
            {toastType === 'remove' && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M15 9l-6 6M9 9l6 6"/>
              </svg>
            )}
            {toastType === 'favourite' && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            )}
          </div>
          <span className="toast-message">{toastMessage}</span>
          <button className="toast-close" onClick={() => setShowToast(false)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>,
        document.body
      )}

      {/* Food Info */}
      <div className="food-item-info">
        {/* Header Row */}
        <div className="food-item-header">
          <div className="food-item-title-row">
            {/* Veg/Non-veg Indicator */}
            <span className={`veg-indicator ${isVeg ? 'veg' : 'non-veg'}`}>
              <span className="indicator-dot"></span>
            </span>
            <h3 className="food-item-name">{name}</h3>
          </div>
          
          {/* Rating Badge */}
          <div className={`food-item-rating ${getRatingClass()}`}>
            <span className="rating-value">{rating}</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
          </div>
        </div>

        {/* Price & Delivery Row */}
        <div className="food-item-meta">
          <span className="food-item-price">₹{price}</span>
          <span className="meta-divider">•</span>
          <span className="food-item-delivery">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            {deliveryTime}
          </span>
        </div>

        {/* Description */}
        <p className="food-item-description">{description}</p>

        {/* Reviews */}
        <div className="food-item-reviews">
          <span className="reviews-count">{reviews.toLocaleString()} reviews</span>
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
