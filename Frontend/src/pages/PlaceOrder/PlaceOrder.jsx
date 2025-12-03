import React, { useContext, useState, useEffect } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const PlaceOrder = () => {
    const {cartItems, food_list, url, getTotalcartAmount, token, setCartItem, setToken} = useContext(StoreContext);
    const location = useLocation();
    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [orderAmount, setOrderAmount] = useState(0);
    const [orderId, setOrderId] = useState('');
    const [paymentId, setPaymentId] = useState('');
    
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        phone: ""
    });

    // Load Razorpay script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    useEffect(() => {
        // Get payment method from navigation state or localStorage
        const method = location.state?.paymentMethod || localStorage.getItem('paymentMethod');
        if (method) {
            setPaymentMethod(method);
        }
    }, [location]);

    // Handle order errors related to authentication
    const handleOrderError = (message) => {
        if (message && (message.includes("token") || message.includes("log in") || message.includes("authorized") || message.includes("authentication"))) {
            // Clear invalid token
            localStorage.removeItem('token');
            setToken("");
            setShowLoginPrompt(true);
        } else {
            alert(message || "Order failed. Please try again.");
        }
    };

    // Handle re-login
    const handleReLogin = () => {
        localStorage.removeItem('token');
        setToken("");
        navigate('/');
        // This will trigger the login popup through App.jsx
        window.location.reload();
    };

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handle Razorpay Payment
    const handleRazorpayPayment = async (orderItems, totalAmount, currentToken) => {
        try {
            // Create Razorpay order
            const orderResponse = await axios.post(
                `${url}/api/order/create-razorpay`,
                {
                    items: orderItems,
                    amount: totalAmount,
                    address: data,
                    paymentMethod: paymentMethod
                },
                { headers: { token: currentToken } }
            );

            if (!orderResponse.data.success) {
                handleOrderError(orderResponse.data.message);
                return false;
            }

            const { order, orderId: newOrderId, key } = orderResponse.data;

            // Razorpay options
            const options = {
                key: key,
                amount: order.amount,
                currency: order.currency,
                name: "SavantX Eats",
                description: `Order #${newOrderId.slice(-8).toUpperCase()}`,
                order_id: order.id,
                handler: async function (response) {
                    // Verify payment
                    try {
                        const verifyResponse = await axios.post(`${url}/api/order/verify-razorpay`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderId: newOrderId
                        });

                        if (verifyResponse.data.success) {
                            setOrderAmount(totalAmount);
                            setOrderId(newOrderId);
                            setPaymentId(response.razorpay_payment_id);
                            setOrderSuccess(true);
                            localStorage.removeItem('paymentMethod');
                            setCartItem({});
                        } else {
                            alert('Payment verification failed. Please contact support.');
                        }
                    } catch (err) {
                        console.error('Payment verification error:', err);
                        alert('Payment verification failed.');
                    }
                    setIsProcessing(false);
                },
                prefill: {
                    name: `${data.firstName} ${data.lastName}`,
                    email: data.email,
                    contact: data.phone
                },
                theme: {
                    color: "#e23744"
                },
                modal: {
                    ondismiss: function() {
                        setIsProcessing(false);
                        alert('Payment was cancelled. Please try again.');
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
            return true;
        } catch (err) {
            console.error('Razorpay error:', err);
            alert('Payment initialization failed.');
            setIsProcessing(false);
            return false;
        }
    };

    const placeOrder = async (e) => {
        e.preventDefault();
        
        // Get fresh token from localStorage
        const currentToken = token || localStorage.getItem('token');
        
        if (!currentToken) {
            alert("Please login to place order");
            navigate('/');
            return;
        }
        
        setIsProcessing(true);

        let orderItems = [];
        food_list.forEach((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = { ...item };
                itemInfo["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo);
            }
        });

        // Store the amount before clearing cart
        const totalAmount = getTotalcartAmount() + 40;

        try {
            if (paymentMethod === 'COD') {
                // For Cash on Delivery, place order directly
                let orderData = {
                    address: data,
                    items: orderItems,
                    amount: totalAmount,
                    paymentMethod: paymentMethod
                };
                
                let response = await axios.post(`${url}/api/order/place-cod`, orderData, { headers: { token: currentToken } });
                console.log("COD Order Response:", response.data);
                if (response.data.success) {
                    // Store order details before clearing cart
                    setOrderAmount(totalAmount);
                    setOrderId(response.data.orderId || '');
                    setOrderSuccess(true);
                    localStorage.removeItem('paymentMethod');
                    // Clear cart after successful order
                    setCartItem({});
                } else {
                    handleOrderError(response.data.message);
                }
                setIsProcessing(false);
            } else {
                // For UPI/Card, use Razorpay
                await handleRazorpayPayment(orderItems, totalAmount, currentToken);
            }
        } catch (error) {
            console.error("Order error:", error);
            alert("Something went wrong. Please try again.");
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate("/cart");
        } else if (getTotalcartAmount() === 0 && !orderSuccess) {
            navigate("/cart");
        }
    }, [token, navigate, getTotalcartAmount, orderSuccess]);

    const getPaymentMethodLabel = () => {
        switch (paymentMethod) {
            case 'COD': return 'Cash on Delivery';
            case 'UPI': return 'UPI Payment';
            case 'CARD': return 'Credit/Debit Card';
            default: return 'Online Payment';
        }
    };

    // Order Success Screen
    if (orderSuccess) {
        return (
            <div className="order-success-page">
                <div className="success-animation">
                    <div className="success-icon">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#60b246" strokeWidth="2">
                            <path d="M20 6L9 17l-5-5"/>
                        </svg>
                    </div>
                </div>
                <h1>Order Placed Successfully!</h1>
                <p>Thank you for your order. Your delicious food is being prepared.</p>
                {orderId && (
                    <p className="order-id-text">Order ID: <strong>#{orderId.slice(-8).toUpperCase()}</strong></p>
                )}
                <div className="order-info-box">
                    <div className="info-row">
                        <span>Payment Method</span>
                        <strong>{getPaymentMethodLabel()}</strong>
                    </div>
                    {paymentId && (
                        <div className="info-row payment-success-row">
                            <span>Payment ID</span>
                            <strong className="payment-id-value">{paymentId}</strong>
                        </div>
                    )}
                    <div className="info-row">
                        <span>Total Amount</span>
                        <strong>₹{orderAmount}</strong>
                    </div>
                    <div className="info-row">
                        <span>Estimated Delivery</span>
                        <strong>30-45 minutes</strong>
                    </div>
                    {paymentMethod !== 'COD' && (
                        <div className="payment-status-badge paid">
                            ✅ Payment Successful
                        </div>
                    )}
                </div>
                <div className="success-actions">
                    <button onClick={() => navigate('/myorders')} className="track-order-btn">
                        Track Your Order
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </button>
                    <button onClick={() => navigate('/')} className="back-home-btn">
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="place-order-page">
            {/* Login Required Modal */}
            {showLoginPrompt && (
                <div className="login-prompt-overlay">
                    <div className="login-prompt-modal">
                        <div className="login-prompt-icon">
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#e23744" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                        </div>
                        <h2>Session Expired</h2>
                        <p>Your login session has expired. Please log in again to continue with your order.</p>
                        <p className="note">Don't worry, your cart items are saved!</p>
                        <button onClick={handleReLogin} className="relogin-btn">
                            Log In Again
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={placeOrder} className='place-order'>
                <div className="place-order-left">
                    <div className="section-card">
                        <div className="section-header">
                            <div className="section-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                    <circle cx="12" cy="10" r="3"/>
                                </svg>
                            </div>
                            <h2>Delivery Information</h2>
                        </div>
                        
                        <div className="form-grid">
                            <div className="multi-fields">
                                <div className="input-group">
                                    <label>First Name</label>
                                    <input required type="text" placeholder='John' onChange={onChangeHandler} value={data.firstName} name="firstName" />
                                </div>
                                <div className="input-group">
                                    <label>Last Name</label>
                                    <input required type="text" placeholder='Doe' onChange={onChangeHandler} value={data.lastName} name="lastName" />
                                </div>
                            </div>
                            
                            <div className="input-group full-width">
                                <label>Email Address</label>
                                <input required type="email" placeholder='john@example.com' onChange={onChangeHandler} value={data.email} name="email"/>
                            </div>
                            
                            <div className="input-group full-width">
                                <label>Street Address</label>
                                <input required type="text" placeholder='123 Main Street, Apartment 4B' onChange={onChangeHandler} value={data.street} name="street"/>
                            </div>
                            
                            <div className="multi-fields">
                                <div className="input-group">
                                    <label>City</label>
                                    <input required type="text" placeholder='Mumbai' onChange={onChangeHandler} value={data.city} name="city"/>
                                </div>
                                <div className="input-group">
                                    <label>State</label>
                                    <input required type="text" placeholder='Maharashtra' onChange={onChangeHandler} value={data.state} name="state" />
                                </div>
                            </div>
                            
                            <div className="multi-fields">
                                <div className="input-group">
                                    <label>PIN Code</label>
                                    <input required type="text" placeholder='400001' onChange={onChangeHandler} value={data.zipCode} name="zipCode"/>
                                </div>
                                <div className="input-group">
                                    <label>Country</label>
                                    <input required type="text" placeholder='India' onChange={onChangeHandler} value={data.country} name="country" />
                                </div>
                            </div>
                            
                            <div className="input-group full-width">
                                <label>Phone Number</label>
                                <input required type="tel" placeholder='9876543210' onChange={onChangeHandler} value={data.phone} name="phone" maxLength={10} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="place-order-right">
                    {/* Payment Method Display */}
                    <div className="payment-method-card">
                        <div className="payment-method-header">
                            <h3>Payment Method</h3>
                            <button type="button" className="change-payment-btn" onClick={() => navigate('/cart')}>
                                Change
                            </button>
                        </div>
                        <div className="selected-payment">
                            <div className={`payment-icon ${paymentMethod.toLowerCase()}`}>
                                {paymentMethod === 'COD' && (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                                        <line x1="1" y1="10" x2="23" y2="10"/>
                                    </svg>
                                )}
                                {paymentMethod === 'UPI' && (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                                        <path d="M8 21h8M12 17v4"/>
                                    </svg>
                                )}
                                {paymentMethod === 'CARD' && (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                                        <line x1="1" y1="10" x2="23" y2="10"/>
                                    </svg>
                                )}
                            </div>
                            <div className="payment-details">
                                <span className="payment-name">{getPaymentMethodLabel()}</span>
                                {paymentMethod === 'COD' && <span className="payment-note">Pay when order arrives</span>}
                                {paymentMethod === 'UPI' && <span className="payment-note">Pay via GPay, PhonePe, Paytm</span>}
                                {paymentMethod === 'CARD' && <span className="payment-note">Secure payment via Razorpay</span>}
                            </div>
                        </div>
                    </div>

                    {/* Cart Summary */}
                    <div className='cart-total-card'>
                        <h3>Order Summary</h3>
                        
                        <div className="order-items-preview">
                            {food_list.map((item, index) => {
                                if (cartItems[item._id] > 0) {
                                    return (
                                        <div key={index} className="preview-item">
                                            <span className="item-qty">{cartItems[item._id]}x</span>
                                            <span className="item-name">{item.name}</span>
                                            <span className="item-price">₹{item.price * cartItems[item._id]}</span>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>

                        <div className="cart-calculations">
                            <div className="calc-row">
                                <span>Subtotal</span>
                                <span>₹{getTotalcartAmount()}</span>
                            </div>
                            <div className="calc-row">
                                <span>Delivery Fee</span>
                                <span className="delivery-fee">₹{getTotalcartAmount() === 0 ? 0 : 40}</span>
                            </div>
                            <div className="calc-row total">
                                <span>Total</span>
                                <span>₹{getTotalcartAmount() === 0 ? 0 : getTotalcartAmount() + 40}</span>
                            </div>
                        </div>

                        <button type='submit' className="place-order-btn" disabled={isProcessing}>
                            {isProcessing ? (
                                <>
                                    <span className="spinner"></span>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    {paymentMethod === 'COD' ? 'Place Order' : 'Proceed to Pay'}
                                    <span className="btn-amount">₹{getTotalcartAmount() + 40}</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="trust-indicators">
                        <div className="trust-item">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            </svg>
                            <span>100% Secure</span>
                        </div>
                        <div className="trust-item">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 6v6l4 2"/>
                            </svg>
                            <span>Fast Delivery</span>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default PlaceOrder
