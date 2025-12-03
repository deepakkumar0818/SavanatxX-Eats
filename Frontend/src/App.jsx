import { Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/navbar/Navbar';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Footer from './components/Footer/Footer';
import { useState } from 'react';
import LoginPopup from './components/LoginPopup/LoginPopup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify/Verify';
import MyOrders from './pages/MyOrders/MyOrders';
import Menu from './pages/Menu/Menu';
import BookTable from './pages/BookTable/BookTable';
import Contact from './pages/Contact/Contact';
import Favourites from './pages/Favourites/Favourites';
import MyBookings from './pages/MyBookings/MyBookings';

function App() {
  const[showLogin, setShowLogin] = useState(false);
  return (
    <>
    <ToastContainer/>
    {showLogin? <LoginPopup setShowLogin={setShowLogin} />:
    <></>}
     <div className='app'>
      <Navbar setShowLogin={setShowLogin}/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/menu' element={<Menu />} />
        <Route path='/book-table' element={<BookTable />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/order' element={<PlaceOrder />} />
        <Route path='/verify' element={<Verify />} />
        <Route path='/myorders' element={<MyOrders />} />
        <Route path='/favourites' element={<Favourites />} />
        <Route path='/my-bookings' element={<MyBookings />} />
      </Routes>
    
    </div>
    <Footer/>
    </>
   
  );
}

export default App;
