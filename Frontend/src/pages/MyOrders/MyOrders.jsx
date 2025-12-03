import React, { useContext, useEffect, useState, useRef } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const invoiceRef = useRef();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${url}/api/order/userorders`, {}, { headers: { token } });
      // Sort orders by date (newest first)
      const sortedOrders = response.data.data.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

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

  // Format date for invoice
  const formatInvoiceDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Generate Invoice Number
  const generateInvoiceNumber = (orderId, date) => {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    return `INV-${year}${month}-${orderId.slice(-6).toUpperCase()}`;
  };

  // Print Invoice
  const handlePrintInvoice = () => {
    const printContent = invoiceRef.current;
    const originalContents = document.body.innerHTML;
    
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  // Download Invoice as Image (alternative method)
  const handleDownloadInvoice = () => {
    handlePrintInvoice();
  };

  return (
    <div className="my-orders-page">
      {/* Header */}
      <div className="orders-header">
        <h2>📦 My Orders</h2>
        <button className="refresh-btn" onClick={fetchOrders}>
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
          <span className="stat-label">On the Way</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{orders.filter(o => o.status === 'Delivered').length}</span>
          <span className="stat-label">Delivered</span>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <p>No orders yet. Start ordering delicious food!</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order, index) => (
            <div key={order._id || index} className="order-card">
              <div className="order-card-header">
                <div className="order-id">
                  <span className="order-hash">#</span>
                  {(order._id || '').slice(-8).toUpperCase()}
                </div>
                <div className="order-meta">
                  <span className="order-date">{formatDate(order.date)}</span>
                  <span className={`payment-badge ${order.paymentMethod === 'COD' ? 'cod' : 'online'}`}>
                    {order.paymentMethod === 'COD' ? '💵 COD' : '💳 Online'}
                  </span>
                  <span className={`payment-status ${order.payment ? 'paid' : 'pending'}`}>
                    {order.payment ? '✓ Paid' : '⏳ Pending'}
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

                <div className="order-delivery">
                  <div className="delivery-address">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span>
                      {order.address.street}, {order.address.city}, {order.address.state} - {order.address.zipCode}
                    </span>
                  </div>
                </div>

                <div className="order-summary">
                  <div className="summary-row">
                    <span>Items</span>
                    <span>{order.items.length}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>₹{order.amount}</span>
                  </div>
                </div>

                <div className="order-status-section">
                  <span className="status-label">Status</span>
                  <div className={`status-badge ${order.status === 'Delivered' ? 'delivered' : order.status === 'Out for delivery' ? 'shipping' : 'processing'}`}>
                    {order.status === 'Food Processing' && '🍳'}
                    {order.status === 'Out for delivery' && '🚚'}
                    {order.status === 'Delivered' && '✅'}
                    <span>{order.status}</span>
                  </div>
                  <div className="order-actions">
                    <button className="track-btn" onClick={fetchOrders}>
                      Track
                    </button>
                    <button className="invoice-btn" onClick={() => setSelectedOrder(order)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10 9 9 9 8 9"/>
                      </svg>
                      Invoice
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invoice Modal */}
      {selectedOrder && (
        <div className="invoice-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="invoice-modal" onClick={(e) => e.stopPropagation()}>
            <div className="invoice-modal-header">
              <h3>Order Invoice</h3>
              <div className="invoice-actions">
                <button className="print-btn" onClick={handlePrintInvoice}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 6 2 18 2 18 9"/>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                    <rect x="6" y="14" width="12" height="8"/>
                  </svg>
                  Print
                </button>
                <button className="close-invoice-btn" onClick={() => setSelectedOrder(null)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Printable Invoice Content */}
            <div className="invoice-content" ref={invoiceRef}>
              <div className="invoice-printable">
                {/* Invoice Header */}
                <div className="invoice-header">
                  <div className="invoice-brand">
                    <img src="/savantxeats.png" alt="SavantX Eats" className="invoice-logo" />
                    <p>Food Delivery</p>
                  </div>
                  <div className="invoice-title">
                    <h2>INVOICE</h2>
                    <p className="invoice-number">{generateInvoiceNumber(selectedOrder._id, selectedOrder.date)}</p>
                  </div>
                </div>

                {/* Invoice Info */}
                <div className="invoice-info">
                  <div className="invoice-from">
                    <h4>From</h4>
                    <p><strong>SavantX Eats</strong></p>
                    <p>123 Food Street</p>
                    <p>Culinary City, State 12345</p>
                    <p>Phone: +91 98765 43210</p>
                    <p>Email: orders@tomato.com</p>
                  </div>
                  <div className="invoice-to">
                    <h4>Bill To</h4>
                    <p><strong>{selectedOrder.address.firstName} {selectedOrder.address.lastName}</strong></p>
                    <p>{selectedOrder.address.street}</p>
                    <p>{selectedOrder.address.city}, {selectedOrder.address.state} - {selectedOrder.address.zipCode}</p>
                    <p>Phone: {selectedOrder.address.phone}</p>
                    <p>Email: {selectedOrder.address.email}</p>
                  </div>
                  <div className="invoice-details">
                    <h4>Invoice Details</h4>
                    <p><strong>Invoice No:</strong> {generateInvoiceNumber(selectedOrder._id, selectedOrder.date)}</p>
                    <p><strong>Order ID:</strong> #{selectedOrder._id.slice(-8).toUpperCase()}</p>
                    <p><strong>Date:</strong> {formatInvoiceDate(selectedOrder.date)}</p>
                    <p><strong>Payment:</strong> {selectedOrder.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</p>
                    <p><strong>Status:</strong> {selectedOrder.payment ? 'Paid' : 'Pending'}</p>
                  </div>
                </div>

                {/* Invoice Items Table */}
                <div className="invoice-table">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                          <td>₹{item.price}</td>
                          <td>₹{item.price * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Invoice Summary */}
                <div className="invoice-summary">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>₹{selectedOrder.amount - 40}</span>
                  </div>
                  <div className="summary-row">
                    <span>Delivery Fee</span>
                    <span>₹40</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax (Inclusive)</span>
                    <span>₹0</span>
                  </div>
                  <div className="summary-row grand-total">
                    <span>Grand Total</span>
                    <span>₹{selectedOrder.amount}</span>
                  </div>
                </div>

                {/* Invoice Footer */}
                <div className="invoice-footer">
                  <div className="thank-you">
                    <p>Thank you for ordering with us!</p>
                    <p className="tagline">Fresh Food, Fast Delivery 🍕</p>
                  </div>
                  <div className="invoice-note">
                    <p><strong>Note:</strong> This is a computer-generated invoice and does not require a signature.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
