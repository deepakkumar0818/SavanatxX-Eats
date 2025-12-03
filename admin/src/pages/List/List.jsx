import React, { useEffect, useState } from 'react'
import './List.css'
import { toast } from "react-toastify";
import axios from 'axios'

const List = ({url}) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')

  const fetchList = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${url}/api/food/list`)
      if(response.data.success){
        setList(response.data.data)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error("Failed to fetch items")
    }
    setLoading(false)
  }

  const deleteFood = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to delete food item.");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await axios.post(`${url}/api/food/status`, { id, status });
      if (response.data.success) {
        toast.success(`Item marked as ${status.replace('_', ' ')}`);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchList()
  }, [])

  // Get unique categories
  const categories = ['All', ...new Set(list.map(item => item.category))]

  // Status options
  const statusOptions = [
    { value: 'All', label: 'All Status' },
    { value: 'available', label: 'Available' },
    { value: 'unavailable', label: 'Unavailable' },
    { value: 'out_of_stock', label: 'Out of Stock' }
  ]

  // Get status counts
  const statusCounts = {
    available: list.filter(item => item.status === 'available' || !item.status).length,
    unavailable: list.filter(item => item.status === 'unavailable').length,
    out_of_stock: list.filter(item => item.status === 'out_of_stock').length
  }

  // Filter items
  const filteredList = list.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    const itemStatus = item.status || 'available'
    const matchesStatus = selectedStatus === 'All' || itemStatus === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="list-page">
      <div className="page-header">
        <div className="header-left">
          <h1>Menu Items</h1>
          <p>Manage your restaurant menu</p>
        </div>
        <button className="btn-refresh" onClick={fetchList}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="list-stats">
        <div className="stat-card">
          <div className="stat-icon total">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-number">{list.length}</span>
            <span className="stat-label">Total Items</span>
          </div>
        </div>
        <div className="stat-card available">
          <div className="stat-icon available">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-number">{statusCounts.available}</span>
            <span className="stat-label">Available</span>
          </div>
        </div>
        <div className="stat-card unavailable">
          <div className="stat-icon unavailable">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-number">{statusCounts.unavailable}</span>
            <span className="stat-label">Unavailable</span>
          </div>
        </div>
        <div className="stat-card out-of-stock">
          <div className="stat-icon out-of-stock">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-number">{statusCounts.out_of_stock}</span>
            <span className="stat-label">Out of Stock</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="list-filters">
        <div className="search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input 
            type="text" 
            placeholder="Search items..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-groups">
          <div className="category-filter">
            <span className="filter-label">Category:</span>
            {categories.map((cat, idx) => (
              <button 
                key={idx}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="status-filter">
            <span className="filter-label">Status:</span>
            {statusOptions.map((opt, idx) => (
              <button 
                key={idx}
                className={`filter-btn status-btn ${selectedStatus === opt.value ? 'active' : ''} ${opt.value !== 'All' ? opt.value : ''}`}
                onClick={() => setSelectedStatus(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Loading items...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p>No items found</p>
          <span>Try adjusting your search or filter</span>
        </div>
      ) : (
        <div className="items-grid">
          {filteredList.map((item, index) => {
            const itemStatus = item.status || 'available';
            return (
              <div key={index} className={`item-card ${itemStatus !== 'available' ? 'inactive' : ''}`}>
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                  <span className="item-category">{item.category}</span>
                  <span className={`item-status-badge ${itemStatus}`}>
                    {itemStatus === 'available' && '✓ Available'}
                    {itemStatus === 'unavailable' && '✗ Unavailable'}
                    {itemStatus === 'out_of_stock' && '⚠ Out of Stock'}
                  </span>
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-description">{item.description?.slice(0, 60)}...</p>
                  
                  {/* Status Controls */}
                  <div className="status-controls">
                    <span className="status-label">Status:</span>
                    <div className="status-buttons">
                      <button 
                        className={`status-toggle available ${itemStatus === 'available' ? 'active' : ''}`}
                        onClick={() => updateStatus(item._id, 'available')}
                        title="Mark as Available"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </button>
                      <button 
                        className={`status-toggle unavailable ${itemStatus === 'unavailable' ? 'active' : ''}`}
                        onClick={() => updateStatus(item._id, 'unavailable')}
                        title="Mark as Unavailable"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                      <button 
                        className={`status-toggle out_of_stock ${itemStatus === 'out_of_stock' ? 'active' : ''}`}
                        onClick={() => updateStatus(item._id, 'out_of_stock')}
                        title="Mark as Out of Stock"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="8" x2="12" y2="12"/>
                          <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="item-footer">
                    <span className="item-price">₹{item.price}</span>
                    <button 
                      className="delete-btn"
                      onClick={() => deleteFood(item._id, item.name)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
}

export default List
