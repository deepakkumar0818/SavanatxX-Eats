import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/sidebar/Sidebar'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import Bookings from './pages/Bookings/Bookings'
import Tables from './pages/Tables/Tables'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const url = 'http://localhost:4000'

  return (
    <div className="app-container">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Navbar/>
      <div className='app-content'>
        <Sidebar/>
        <main className='main-content'>
          <Routes>
            <Route path='/' element={<Navigate to="/orders" replace />} />
            <Route path='/add' element={<Add url={url}/>} />
            <Route path='/list' element={<List url={url}/>} />
            <Route path='/orders' element={<Orders url={url}/>} />
            <Route path='/bookings' element={<Bookings url={url}/>} />
            <Route path='/tables' element={<Tables url={url}/>} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
