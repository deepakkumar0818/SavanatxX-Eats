import React from "react";
import "./Orders.css";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { assets } from "../../assets/assets";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrder = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        // Sort orders by date (newest first)
        const sortedOrders = response.data.data.sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        setOrders(sortedOrders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch orders");
    }
    setLoading(false);
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: event.target.value
      });
      if (response.data.success) {
        toast.success("Order status updated!");
        await fetchAllOrder();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchAllOrder();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Food Processing': return '#f59e0b';
      case 'Out for delivery': return '#3b82f6';
      case 'Delivered': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h2>📦 All Orders</h2>
        <button className="refresh-btn" onClick={fetchAllOrder}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          Refresh
        </button>
      </div>

      {/* Order Stats */}
      <div className="order-stats">
        <div className="stat-card">
          <span className="stat-number">{orders.length}</span>
          <span className="stat-label">Total Orders</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{orders.filter(o => o.status === 'Food Processing').length}</span>
          <span className="stat-label">Processing</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{orders.filter(o => o.status === 'Out for delivery').length}</span>
          <span className="stat-label">Out for Delivery</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{orders.filter(o => o.paymentMethod === 'COD').length}</span>
          <span className="stat-label">COD Orders</span>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <p>No orders yet</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order, index) => (
            <div key={index} className="order-card">
                <div className="order-card-header">
                <div className="order-id">
                  <span className="order-hash">#</span>
                  {order._id.slice(-8).toUpperCase()}
                </div>
                <div className="order-meta">
                  <span className="order-date">{formatDate(order.date)}</span>
                  <span className={`payment-badge ${order.paymentMethod === 'COD' ? 'cod' : 'online'}`}>
                    {order.paymentMethod === 'COD' ? '💵 COD' : '💳 Online'}
                  </span>
                  <span className={`payment-status ${order.payment || (order.paymentMethod === 'COD' && order.status === 'Delivered') ? 'paid' : 'pending'}`}>
                    {order.payment || (order.paymentMethod === 'COD' && order.status === 'Delivered') 
                      ? '✓ Paid' 
                      : order.paymentMethod === 'COD' 
                        ? '📦 Pay on Delivery' 
                        : '⏳ Pending'}
                  </span>
                </div>
              </div>

              <div className="order-card-body">
                <div className="order-items-section">
                  <img src={assets.parcel_icon} alt="Order" className="parcel-icon" />
                  <div className="items-list">
                    {order.items.map((item, idx) => (
                      <span key={idx} className="item-tag">
                        {item.name} × {item.quantity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="order-customer">
                  <div className="customer-name">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    {order.address.firstName} {order.address.lastName}
                  </div>
                  <div className="customer-address">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {order.address.street}, {order.address.city}, {order.address.state} - {order.address.zipCode}
                  </div>
                  <div className="customer-phone">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    {order.address.phone}
                  </div>
                </div>

                <div className="order-summary">
                  <div className="summary-row">
                    <span>Items</span>
                    <span>{order.items.length}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Amount</span>
                    <span>₹{order.amount}</span>
                  </div>
                </div>

                <div className="order-status-section">
                  <label>Status:</label>
                  <select 
                    value={order.status} 
                    onChange={(event) => statusHandler(event, order._id)}
                    style={{ borderColor: getStatusColor(order.status) }}
                  >
                    <option value="Food Processing">🍳 Food Processing</option>
                    <option value="Out for delivery">🚚 Out for Delivery</option>
                    <option value="Delivered">✅ Delivered</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
