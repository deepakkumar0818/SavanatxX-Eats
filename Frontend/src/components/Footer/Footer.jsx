import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className='footer-content'>
            <div className='footer-content-left'>
              <img src="/savantxeats.png" alt="SavantX Eats" className="footer-logo" />
              <p>Delicious flavors, unforgettable dining experiences. Visit us for fresh ingredients, warm ambiance, and exceptional service. Follow us on social media for updates, specials, and more. Your satisfaction, our priority!</p>
              <div className='footer-social-icons'>
      <img src={assets.facebook_icon} alt="" />
      <img src={assets.twitter_icon} alt="" />
      <img src={assets.linkedin_icon} alt="" />
              </div>
            </div>

            <div className='footer-content-center'>
               <h2>Company</h2>
               <ul>
                <li>Home</li>
                <li>About Us</li>
                <li>Delivery</li>
                <li>Privacy Policy</li>
               </ul>
            </div>


            <div className='footer-content-right'> 
                <h2>Get in Touch</h2>
                <ul>
                    <li>+91 7018318078</li>
                    <li>deepakkumr2098@gmail.com</li>
                </ul>

            </div>

        </div>
        <hr />
        <p className='footer-copyright'>
            Copyright &copy; 2024 SavantX Eats - All Rights Reserved
        </p>
       
        
        </div>
  )
}

export default Footer