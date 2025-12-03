import { useState } from "react";
import "./RestaurantCard.css";

const RestaurantCard = ({
  id,
  name,
  image,
  coverImage,
  rating = 4.0,
  reviews = 0,
  deliveryTime = "25-30 min",
  cuisines = [],
  priceForTwo = 30,
  distance = "1 km",
  offer = "",
  isVeg = false,
  isPureVeg = false,
  isPromoted = false
}) => {
  const [isLiked, setIsLiked] = useState(false);

  const getRatingClass = () => {
    if (rating >= 4.5) return 'rating-excellent';
    if (rating >= 4.0) return 'rating-good';
    if (rating >= 3.5) return 'rating-average';
    return 'rating-low';
  };

  return (
    <div className="restaurant-card">
      {/* Image Container */}
      <div className="restaurant-card-img">
        <img src={coverImage || image} alt={name} />
        
        {/* Promoted Badge */}
        {isPromoted && (
          <span className="promoted-badge">Promoted</span>
        )}

        {/* Offer Badge */}
        {offer && (
          <div className="restaurant-offer">
            <span>{offer}</span>
          </div>
        )}

        {/* Wishlist */}
        <button 
          className={`restaurant-wishlist ${isLiked ? 'liked' : ''}`}
          onClick={() => setIsLiked(!isLiked)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill={isLiked ? "#e23744" : "none"} stroke={isLiked ? "#e23744" : "white"} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      {/* Restaurant Info */}
      <div className="restaurant-card-info">
        <div className="restaurant-header">
          <div className="restaurant-name-row">
            <h3 className="restaurant-name">{name}</h3>
            {isPureVeg && (
              <span className="pure-veg-badge">
                <span className="veg-leaf">🌿</span>
                Pure Veg
              </span>
            )}
          </div>
          <div className={`restaurant-rating ${getRatingClass()}`}>
            <span>{rating}</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
          </div>
        </div>

        <div className="restaurant-meta">
          <span className="cuisines">{cuisines.slice(0, 3).join(", ")}</span>
        </div>

        <div className="restaurant-details">
          <span className="detail-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            {deliveryTime}
          </span>
          <span className="detail-divider">•</span>
          <span className="detail-item">₹{priceForTwo} for two</span>
          <span className="detail-divider">•</span>
          <span className="detail-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {distance}
          </span>
        </div>

        <div className="restaurant-footer">
          <span className="reviews-text">{reviews.toLocaleString()} reviews</span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;

