import React, { useContext, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({setShowLogin}) => {
  const [menu, setMenu] = useState("home");
  const{getTotalcartAmount, token, setToken, cartItems} = useContext(StoreContext)
  const navigate = useNavigate();

  // Calculate total number of items in cart
  const getCartItemCount = () => {
    let count = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        count += cartItems[item];
      }
    }
    return count;
  };

  const cartCount = getCartItemCount();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setShowLogin(true);
    navigate("/");
  };

  return (
    <div className='navbar'>
     <Link to="/"> <img className='logo' src="/savantxeats.png" alt="SavantX Eats" /></Link>
      <ul className="navbar-menu">
        <Link to='/' onClick={() => setMenu("home")} className={menu === 'home' ? 'active' : ''}>Home</Link>
        <Link to='/menu' onClick={() => setMenu("menu")} className={menu === 'menu' ? 'active' : ''}>Menu</Link>
        <Link to='/book-table' onClick={() => setMenu("book-table")} className={menu === 'book-table' ? 'active' : ''}>Book Table</Link>
        <Link to='/contact' onClick={() => setMenu("contact")} className={menu === 'contact' ? 'active' : ''}>Contact Us</Link>
      </ul>
      <div className='navbar-right'>
        <img src={assets.search_icon} alt="Search Icon" />
        <div className='navbar-basket'>
         <Link to='/cart'><img src={assets.basket_icon} alt="Basket Icon" /></Link> 
         {cartCount > 0 && (
           <span className="cart-count-badge">{cartCount > 99 ? '99+' : cartCount}</span>
         )}
        </div>
        {!token?<button onClick={() => setShowLogin(true)} className='sign-in-button'>Sign In</button>: <div className='navbar-profile'>
          <img src={assets.profile_icon} alt="User Icon" />
          <ul className="nav-profile-dropdown">
            <li onClick={() => navigate("/myorders")}> <img src= {assets.bag_icon} alt="" /> <p>Orders</p></li>
            <hr />
            <li onClick={() => navigate("/my-bookings")}> 
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <p>My Bookings</p>
            </li>
            <hr />
            <li onClick={() => navigate("/favourites")}> 
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#e23744" stroke="#e23744" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <p>Favourites</p>
            </li>
            <hr />
            <li onClick={handleLogout}><img src={assets.logout_icon} alt="" /> <p>Logout</p></li>
          </ul>
          </div>}
        
      </div>
    </div>
  );
};

export default Navbar;
