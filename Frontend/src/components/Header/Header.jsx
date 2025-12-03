import { useState } from 'react'
import './Header.css'
import { Link } from 'react-router-dom'

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className='header'>
      {/* Overlay */}
      <div className="header-overlay"></div>
      
      <div className='header-contents'>
        {/* Restaurant Badge */}
        <div className="header-badge">
          <span className="badge-icon">🍽️</span>
          <span>Open Now • Closes at 11 PM</span>
        </div>

        <h1>
          Order Delicious Food Online
        </h1>
        <p>
          Explore our menu featuring dishes crafted with the finest ingredients. Fast delivery, fresh taste, every time!
        </p>

        {/* Search Bar */}
        <div className="header-search">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input 
            type="text" 
            placeholder="Search for dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Quick Tags */}
        <div className="header-tags">
          <span className="tag">🍕 Pizza</span>
          <span className="tag">🍔 Burger</span>
          <span className="tag">🍜 Noodles</span>
          <span className="tag">🥗 Salad</span>
          <span className="tag">🍰 Dessert</span>
        </div>

        {/* CTA Button */}
        <Link to='/menu'>
          <button className="btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
            View Full Menu
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Header