import React from 'react'
import './Navbar.css'
import {assets} from '../../assets/assets'

const Navbar = () => {
  return (
    <nav className='admin-navbar'>
      <div className="navbar-left">
        <img className='logo' src="/savantxeats.png" alt="SavantX Eats" />
        <div className="navbar-title">
          <span className="title-main">Admin Panel</span>
          <span className="title-sub">Manage your restaurant</span>
        </div>
      </div>
      <div className="navbar-right">
        <div className="navbar-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="text" placeholder="Search..." />
        </div>
        <div className="navbar-notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span className="notification-badge">3</span>
        </div>
        <div className="navbar-profile">
          <img className='profile' src={assets.profile_image} alt="Admin" />
          <div className="profile-info">
            <span className="profile-name">Admin</span>
            <span className="profile-role">Super Admin</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
