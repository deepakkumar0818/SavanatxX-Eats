import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import AppDownload from '../../components/AppDownload/AppDownload';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../../components/FoodItem/FoodItem';

const Home = () => {
  const [category, setCategory] = useState('all');
  const { food_list } = useContext(StoreContext);

  // Get bestseller dishes
  const bestsellerDishes = food_list.filter(item => item.isBestseller).slice(0, 8);
  
  // Get dishes with offers
  const offerDishes = food_list.filter(item => item.offer).slice(0, 6);

  return (
    <div className="home">
      {/* Hero Banner */}
      <Header />

      {/* Restaurant Info Bar */}
      <div className="restaurant-info-bar">
        <div className="info-item">
          <div className="info-icon">⭐</div>
          <div className="info-content">
            <span className="info-value">4.5</span>
            <span className="info-label">Rating</span>
          </div>
        </div>
        <div className="info-divider"></div>
        <div className="info-item">
          <div className="info-icon">🕐</div>
          <div className="info-content">
            <span className="info-value">25-30 min</span>
            <span className="info-label">Delivery</span>
          </div>
        </div>
        <div className="info-divider"></div>
        <div className="info-item">
          <div className="info-icon">💰</div>
          <div className="info-content">
            <span className="info-value">₹500</span>
            <span className="info-label">For Two</span>
          </div>
        </div>
        <div className="info-divider"></div>
        <div className="info-item">
          <div className="info-icon">🚚</div>
          <div className="info-content">
            <span className="info-value">Free</span>
            <span className="info-label">Delivery</span>
          </div>
        </div>
      </div>

      {/* Offers Section */}
      {offerDishes.length > 0 && (
        <div className="offers-section">
          <div className="section-header">
            <h2>
              <span className="section-icon">🏷️</span>
              Today's Offers
            </h2>
            <Link to="/menu" className="see-all-link">
              See all
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
          <div className="offers-scroll">
            {offerDishes.map((item) => (
              <div key={item._id} className="offer-dish-card">
                <div className="offer-dish-img">
                  <img src={item.image} alt={item.name} />
                  <span className="offer-badge">{item.offer}</span>
                </div>
                <div className="offer-dish-info">
                  <h4>{item.name}</h4>
                  <div className="offer-dish-meta">
                    <span className="offer-price">₹{item.price}</span>
                    <span className="offer-rating">
                      ⭐ {item.rating}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Explore Our Menu Section */}
      <ExploreMenu category={category} setCategory={setCategory} />

      {/* Bestsellers Section */}
      {bestsellerDishes.length > 0 && (
        <div className="bestsellers-section">
          <div className="section-header">
            <h2>
              <span className="section-icon">🔥</span>
              Bestsellers
            </h2>
            <Link to="/menu" className="see-all-link">
              See all
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
          <div className="bestsellers-grid">
            {bestsellerDishes.slice(0, 4).map((item) => (
              <FoodItem
                key={item._id}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
                rating={item.rating}
                reviews={item.reviews}
                deliveryTime={item.deliveryTime}
                isVeg={item.isVeg}
                isBestseller={item.isBestseller}
                isNew={item.isNew}
                offer={item.offer}
                status={item.status}
              />
            ))}
          </div>
        </div>
      )}

      {/* Food Display */}
      <FoodDisplay category={category} />

      {/* Promo Banner */}
      <div className="promo-banner-section">
        <div className="promo-banner">
          <div className="promo-content">
            <span className="promo-tag">FIRST ORDER</span>
            <h3>Get 50% OFF!</h3>
            <p>Use code <strong>WELCOME50</strong> at checkout</p>
            <Link to="/menu">
              <button className="promo-btn">Order Now</button>
            </Link>
          </div>
          <div className="promo-images">
            <span>🍕</span>
            <span>🍔</span>
            <span>🍜</span>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="features-section">
        <h2>Why Order From Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🍳</div>
            <h4>Fresh Ingredients</h4>
            <p>We use only the freshest ingredients sourced daily</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h4>Fast Delivery</h4>
            <p>Hot food delivered to your door in 30 minutes or less</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👨‍🍳</div>
            <h4>Expert Chefs</h4>
            <p>Our dishes are crafted by experienced culinary experts</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💯</div>
            <h4>Quality Promise</h4>
            <p>100% satisfaction guaranteed or your money back</p>
          </div>
        </div>
      </div>

      {/* App Download */}
      <AppDownload />
    </div>
  );
};

export default Home;
