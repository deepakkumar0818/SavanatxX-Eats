import React, { useContext, useState, useMemo, useEffect } from 'react';
import './Menu.css';
import { menu_list } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../../components/FoodItem/FoodItem';

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [showVegOnly, setShowVegOnly] = useState(false);
  const [showOffersOnly, setShowOffersOnly] = useState(false);
  const [showRating4Plus, setShowRating4Plus] = useState(false);
  const [showFastDelivery, setShowFastDelivery] = useState(false);
  const [priceRange, setPriceRange] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const { food_list } = useContext(StoreContext);

  // Location state
  const [userLocation, setUserLocation] = useState({
    address: 'Detecting location...',
    loading: true,
    error: false
  });
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentLocations, setRecentLocations] = useState([
    { id: 1, name: 'Home', address: 'Add your home address', icon: '🏠' },
    { id: 2, name: 'Work', address: 'Add your work address', icon: '💼' }
  ]);

  // Get user location on component mount
  useEffect(() => {
    getUserLocation();
    // Load saved locations from localStorage
    const savedLocations = localStorage.getItem('recentDeliveryLocations');
    if (savedLocations) {
      setRecentLocations(JSON.parse(savedLocations));
    }
  }, []);

  // Function to get user's location
  const getUserLocation = () => {
    setUserLocation({ address: 'Detecting location...', loading: true, error: false });

    if (!navigator.geolocation) {
      setUserLocation({
        address: 'Location not supported',
        loading: false,
        error: true
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Using free reverse geocoding API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await response.json();
          
          if (data && data.address) {
            const { suburb, neighbourhood, city, town, village, state, postcode } = data.address;
            const area = suburb || neighbourhood || town || village || '';
            const cityName = city || town || '';
            const displayAddress = area 
              ? `${area}, ${cityName}` 
              : cityName 
                ? `${cityName}, ${state || ''}` 
                : `${state || 'Your Area'}`;
            
            setUserLocation({
              address: displayAddress,
              loading: false,
              error: false
            });
          } else {
            setUserLocation({
              address: 'Location found',
              loading: false,
              error: false
            });
          }
        } catch (error) {
          console.error('Error getting address:', error);
          setUserLocation({
            address: 'Location detected',
            loading: false,
            error: false
          });
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = 'Unable to get location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timeout';
            break;
          default:
            errorMessage = 'Unable to get location';
        }
        
        setUserLocation({
          address: errorMessage,
          loading: false,
          error: true
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // Cache for 5 minutes
      }
    );
  };

  // Search for locations
  const searchLocations = async (query) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      const data = await response.json();
      
      const results = data.map((item, index) => ({
        id: index,
        name: item.display_name.split(',')[0],
        address: item.display_name,
        lat: item.lat,
        lon: item.lon
      }));
      
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
    setIsSearching(false);
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchLocations(locationSearch);
    }, 500);
    return () => clearTimeout(timer);
  }, [locationSearch]);

  // Select a location from search results or recent
  const selectLocation = (location) => {
    const displayAddress = location.name || location.address.split(',').slice(0, 2).join(', ');
    setUserLocation({
      address: displayAddress,
      loading: false,
      error: false
    });
    
    // Save to recent locations
    const newRecent = {
      id: Date.now(),
      name: displayAddress,
      address: location.address,
      icon: '📍'
    };
    
    const updatedRecent = [newRecent, ...recentLocations.filter(l => l.address !== location.address)].slice(0, 5);
    setRecentLocations(updatedRecent);
    localStorage.setItem('recentDeliveryLocations', JSON.stringify(updatedRecent));
    
    setShowLocationModal(false);
    setLocationSearch('');
    setSearchResults([]);
  };

  // Handle current location button in modal
  const handleUseCurrentLocation = () => {
    setShowLocationModal(false);
    getUserLocation();
  };

  // Get unique categories from food_list
  const categories = ['all', ...new Set(food_list.map(item => item.category))];

  // Filter and sort food
  const filteredFood = useMemo(() => {
    let result = food_list.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVeg = !showVegOnly || item.isVeg;
      const matchesOffers = !showOffersOnly || item.offer;
      const matchesRating = !showRating4Plus || item.rating >= 4.0;
      const matchesFastDelivery = !showFastDelivery || item.deliveryTime?.includes('15-20') || item.deliveryTime?.includes('20-25');
      
      let matchesPrice = true;
      if (priceRange === 'under15') matchesPrice = item.price < 15;
      else if (priceRange === '15to25') matchesPrice = item.price >= 15 && item.price <= 25;
      else if (priceRange === 'above25') matchesPrice = item.price > 25;

      return matchesCategory && matchesSearch && matchesVeg && matchesOffers && matchesRating && matchesFastDelivery && matchesPrice;
    });

    // Sort
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'priceLow':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'priceHigh':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'delivery':
        result.sort((a, b) => {
          const getMinTime = (time) => parseInt(time?.split('-')[0] || 30);
          return getMinTime(a.deliveryTime) - getMinTime(b.deliveryTime);
        });
        break;
      case 'reviews':
        result.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
        break;
      default:
        // Relevance - bestsellers first, then by rating
        result.sort((a, b) => {
          if (a.isBestseller && !b.isBestseller) return -1;
          if (!a.isBestseller && b.isBestseller) return 1;
          return (b.rating || 0) - (a.rating || 0);
        });
    }

    return result;
  }, [food_list, activeCategory, searchQuery, sortBy, showVegOnly, showOffersOnly, showRating4Plus, showFastDelivery, priceRange]);

  // Get count of items per category
  const getCategoryCount = (category) => {
    if (category === 'all') return food_list.length;
    return food_list.filter(item => item.category === category).length;
  };

  // Count active filters
  const activeFiltersCount = [showVegOnly, showOffersOnly, showRating4Plus, showFastDelivery, priceRange !== 'all'].filter(Boolean).length;

  // Clear all filters
  const clearAllFilters = () => {
    setShowVegOnly(false);
    setShowOffersOnly(false);
    setShowRating4Plus(false);
    setShowFastDelivery(false);
    setPriceRange('all');
    setSearchQuery('');
    setActiveCategory('all');
    setSortBy('relevance');
  };

  return (
    <div className='menu-page'>
      {/* Location Modal */}
      {showLocationModal && (
        <div className="location-modal-overlay" onClick={() => setShowLocationModal(false)}>
          <div className="location-modal" onClick={(e) => e.stopPropagation()}>
            <div className="location-modal-header">
              <h3>Select Delivery Location</h3>
              <button className="close-modal-btn" onClick={() => setShowLocationModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            
            <div className="location-search-container">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search for area, street name..."
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                autoFocus
              />
              {locationSearch && (
                <button className="clear-search" onClick={() => { setLocationSearch(''); setSearchResults([]); }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              )}
            </div>

            <button className="use-current-location-btn" onClick={handleUseCurrentLocation}>
              <div className="current-loc-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="22" y1="12" x2="18" y2="12"/>
                  <line x1="6" y1="12" x2="2" y2="12"/>
                  <line x1="12" y1="6" x2="12" y2="2"/>
                  <line x1="12" y1="22" x2="12" y2="18"/>
                </svg>
              </div>
              <div className="current-loc-text">
                <span className="current-loc-title">Use Current Location</span>
                <span className="current-loc-subtitle">Using GPS</span>
              </div>
            </button>

            {/* Search Results */}
            {isSearching && (
              <div className="location-searching">
                <div className="location-spinner"></div>
                <span>Searching...</span>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="search-results-section">
                <h4>Search Results</h4>
                <div className="search-results-list">
                  {searchResults.map((result) => (
                    <div 
                      key={result.id} 
                      className="search-result-item"
                      onClick={() => selectLocation(result)}
                    >
                      <div className="result-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                      </div>
                      <div className="result-info">
                        <span className="result-name">{result.name}</span>
                        <span className="result-address">{result.address}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent/Saved Locations */}
            {!locationSearch && (
              <div className="saved-locations-section">
                <h4>Saved Addresses</h4>
                <div className="saved-locations-list">
                  {recentLocations.map((location) => (
                    <div 
                      key={location.id} 
                      className="saved-location-item"
                      onClick={() => location.address !== 'Add your home address' && location.address !== 'Add your work address' && selectLocation(location)}
                    >
                      <div className="saved-loc-icon">{location.icon}</div>
                      <div className="saved-loc-info">
                        <span className="saved-loc-name">{location.name}</span>
                        <span className="saved-loc-address">{location.address}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Areas */}
            <div className="popular-areas-section">
              <h4>Popular Areas</h4>
              <div className="popular-areas-grid">
                {['Koramangala', 'Indiranagar', 'HSR Layout', 'Whitefield', 'Jayanagar', 'MG Road'].map((area) => (
                  <button 
                    key={area} 
                    className="popular-area-btn"
                    onClick={() => selectLocation({ name: area, address: `${area}, Bangalore, Karnataka` })}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location & Delivery Banner */}
      <div className="menu-delivery-banner">
        <div className="delivery-location" onClick={() => setShowLocationModal(true)}>
          <div className={`location-icon ${userLocation.loading ? 'loading' : ''}`}>
            {userLocation.loading ? (
              <div className="location-spinner"></div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            )}
          </div>
          <div className="location-info">
            <span className="location-label">Deliver to</span>
            <span className={`location-address ${userLocation.error ? 'error' : ''}`}>
              {userLocation.address}
              {!userLocation.loading && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              )}
            </span>
          </div>
          {userLocation.error && (
            <button className="detect-location-btn" onClick={(e) => { e.stopPropagation(); getUserLocation(); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="22" y1="12" x2="18" y2="12"/>
                <line x1="6" y1="12" x2="2" y2="12"/>
                <line x1="12" y1="6" x2="12" y2="2"/>
                <line x1="12" y1="22" x2="12" y2="18"/>
              </svg>
              Detect
            </button>
          )}
        </div>
        <div className="delivery-time-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          <span>15-30 min delivery</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="menu-hero">
        <div className="menu-hero-content">
          <div className="menu-hero-text">
            <h1>Discover Delicious Food</h1>
            <p>Order from 64+ dishes across 8 cuisines. Fresh ingredients, fast delivery.</p>
          </div>
          
          {/* Search Bar */}
          <div className="menu-search">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search for dishes, cuisines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery('')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>
        </div>
        <div className="menu-hero-stats">
          <div className="hero-stat">
            <span className="stat-value">{food_list.length}+</span>
            <span className="stat-label">Dishes</span>
          </div>
          <div className="hero-stat">
            <span className="stat-value">4.5</span>
            <span className="stat-label">Avg Rating</span>
          </div>
          <div className="hero-stat">
            <span className="stat-value">25</span>
            <span className="stat-label">Min Delivery</span>
          </div>
        </div>
      </div>

      {/* Category Scroll */}
      <div className="menu-categories-section">
        <div className="section-header">
          <h2>What's on your mind?</h2>
        </div>
        <div className="menu-categories-scroll">
          {menu_list.map((item, index) => (
            <div
              key={index}
              className={`menu-category-item ${activeCategory === item.menu_name ? 'active' : ''}`}
              onClick={() => setActiveCategory(activeCategory === item.menu_name ? 'all' : item.menu_name)}
            >
              <div className="category-image">
                <img src={item.menu_image} alt={item.menu_name} />
              </div>
              <span className="category-name">{item.menu_name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="menu-filters-bar">
        <div className="filters-left">
          {/* Quick Filters */}
          <button 
            className={`quick-filter ${showVegOnly ? 'active' : ''}`}
            onClick={() => setShowVegOnly(!showVegOnly)}
          >
            <span className="veg-icon"></span>
            Pure Veg
          </button>
          
          <button 
            className={`quick-filter ${showRating4Plus ? 'active' : ''}`}
            onClick={() => setShowRating4Plus(!showRating4Plus)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
            Rating 4.0+
          </button>
          
          <button 
            className={`quick-filter offers ${showOffersOnly ? 'active' : ''}`}
            onClick={() => setShowOffersOnly(!showOffersOnly)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
            Offers
          </button>
          
          <button 
            className={`quick-filter ${showFastDelivery ? 'active' : ''}`}
            onClick={() => setShowFastDelivery(!showFastDelivery)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            Fast Delivery
          </button>

          {/* Price Range Dropdown */}
          <div className="filter-dropdown">
            <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
              <option value="all">All Prices</option>
              <option value="under15">Under ₹300</option>
              <option value="15to25">₹300 - ₹500</option>
              <option value="above25">Above ₹500</option>
            </select>
          </div>
        </div>

        <div className="filters-right">
          {/* Sort Dropdown */}
          <div className="sort-dropdown">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="relevance">Relevance</option>
              <option value="rating">Rating: High to Low</option>
              <option value="delivery">Delivery Time</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="reviews">Most Reviewed</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="view-toggle">
            <button 
              className={viewMode === 'grid' ? 'active' : ''} 
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
              </svg>
            </button>
            <button 
              className={viewMode === 'list' ? 'active' : ''} 
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="active-filters">
          <span className="filters-label">{activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} applied</span>
          <button className="clear-all-btn" onClick={clearAllFilters}>
            Clear All
          </button>
        </div>
      )}

      {/* Category Pills */}
      <div className="menu-category-pills">
        <button
          className={`category-pill ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          All ({food_list.length})
        </button>
        {categories.filter(cat => cat !== 'all').map((category, index) => (
          <button
            key={index}
            className={`category-pill ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category} ({getCategoryCount(category)})
          </button>
        ))}
      </div>

      {/* Results Header */}
      <div className="menu-results-header">
        <div className="results-info">
          <h2>
            {activeCategory === 'all' ? 'All Dishes' : activeCategory}
          </h2>
          <span className="results-count">{filteredFood.length} items found</span>
        </div>
        {searchQuery && (
          <p className="search-query-text">
            Results for "<strong>{searchQuery}</strong>"
          </p>
        )}
      </div>

      {/* Food Grid */}
      {filteredFood.length > 0 ? (
        <div className={`menu-food-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
          {filteredFood.map((item, index) => (
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
      ) : (
        <div className="no-results">
          <div className="no-results-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
          <h3>No dishes found</h3>
          <p>We couldn't find any dishes matching your criteria. Try adjusting your filters.</p>
          <button className="clear-filters-btn" onClick={clearAllFilters}>
            Clear All Filters
          </button>
        </div>
      )}

      {/* Promo Section */}
      <div className="menu-promo-section">
        <div className="promo-card">
          <div className="promo-content">
            <span className="promo-badge">LIMITED OFFER</span>
            <h3>Get 50% OFF on your first order!</h3>
            <p>Use code FIRST50 at checkout</p>
            <button className="promo-btn">Order Now</button>
          </div>
          <div className="promo-decoration">
            <span>🍔</span>
            <span>🍕</span>
            <span>🍜</span>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="menu-stats-section">
        <div className="stat-card">
          <div className="stat-icon">🍽️</div>
          <div className="stat-content">
            <span className="stat-number">{food_list.length}+</span>
            <span className="stat-text">Dishes Available</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <span className="stat-number">4.5</span>
            <span className="stat-text">Average Rating</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚀</div>
          <div className="stat-content">
            <span className="stat-number">25 min</span>
            <span className="stat-text">Avg Delivery</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <span className="stat-number">₹0</span>
            <span className="stat-text">Delivery Fee</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
