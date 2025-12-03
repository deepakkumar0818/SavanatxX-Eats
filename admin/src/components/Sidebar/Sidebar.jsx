import React from 'react'
import './Sidebar.css'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <aside className='admin-sidebar'>
      <div className="sidebar-menu">
        <div className="menu-section">
          <span className="menu-label">Menu</span>
          
          <NavLink to="/add" className='sidebar-item'>
            <div className="item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
            </div>
            <span className="item-text">Add Item</span>
          </NavLink>
          
          <NavLink to="/list" className='sidebar-item'>
            <div className="item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </div>
            <span className="item-text">Menu Items</span>
          </NavLink>
        </div>

        <div className="menu-section">
          <span className="menu-label">Orders & Tables</span>
          
          <NavLink to="/orders" className='sidebar-item'>
            <div className="item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <span className="item-text">Orders</span>
            <span className="item-badge">New</span>
          </NavLink>
          
          <NavLink to="/tables" className='sidebar-item'>
            <div className="item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="8" width="18" height="4" rx="1"/>
                <path d="M5 12v8"/>
                <path d="M19 12v8"/>
                <path d="M4 8V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"/>
              </svg>
            </div>
            <span className="item-text">Manage Tables</span>
          </NavLink>
          
          <NavLink to="/bookings" className='sidebar-item'>
            <div className="item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <span className="item-text">Table Bookings</span>
          </NavLink>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="help-card">
          <div className="help-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <span className="help-title">Need Help?</span>
          <span className="help-text">Check our docs</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
