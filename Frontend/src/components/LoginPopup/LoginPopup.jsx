import React, { useState, useContext } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);

  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const newUrl = `${url}/api/user/${currState.toLowerCase()}`;
    
    try {
      const response = await axios.post(newUrl, data);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin(false);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error during login/register:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className='login-popup-container'>
        <div className='login-popup-title'>
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" />
        </div>
        
        <div className='login-popup-inputs'>
          {currState === "Sign Up" && (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder='Your Name'
              required
            />
          )}
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder='Your Email'
            required
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder='Your Password'
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : currState === "Sign Up" ? "Create Account" : "Login"}
        </button>
        
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the Terms of Use and Privacy Policy</p>
        </div>
        
        <div>
          {currState === "Sign Up" ? (
            <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login</span></p>
          ) : (
            <p>Don't have an account? <span onClick={() => setCurrState("Sign Up")}>Sign Up</span></p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPopup;
