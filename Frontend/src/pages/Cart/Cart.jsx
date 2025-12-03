import React, { useContext, useState } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext';
import { useNavigate, Link } from 'react-router-dom';

const Cart = () => {
    const {cartItems, food_list, removeFromCart, addToCart, getTotalcartAmount, token} = useContext(StoreContext);
    const [promoCode, setPromoCode] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);
    const [promoDiscount, setPromoDiscount] = useState(0);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState('');

    const navigate = useNavigate();
    
    const handleCheckout = () => {
        if (!token) {
            alert("Please login to proceed to checkout");
            return;
        }
        setShowPaymentModal(true);
    };

    const handlePaymentSelect = (method) => {
        setSelectedPayment(method);
    };

    const handleProceedWithPayment = () => {
        if (!selectedPayment) {
            alert("Please select a payment method");
            return;
        }
        // Store payment method in context or localStorage
        localStorage.setItem('paymentMethod', selectedPayment);
        setShowPaymentModal(false);
        navigate('/order', { state: { paymentMethod: selectedPayment } });
    };

    const handleApplyPromo = () => {
        if (promoCode.toUpperCase() === 'WELCOME50') {
            setPromoDiscount(Math.round(getTotalcartAmount() * 0.5));
            setPromoApplied(true);
        } else if (promoCode.toUpperCase() === 'FIRST50') {
            setPromoDiscount(Math.round(getTotalcartAmount() * 0.5));
            setPromoApplied(true);
        } else if (promoCode.toUpperCase() === 'SAVE20') {
            setPromoDiscount(Math.round(getTotalcartAmount() * 0.2));
            setPromoApplied(true);
        } else {
            alert('Invalid promo code');
        }
    };

    const removePromo = () => {
        setPromoCode('');
        setPromoApplied(false);
        setPromoDiscount(0);
    };

    // Get cart items count
    const getCartItemsCount = () => {
        let count = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                count += cartItems[item];
            }
        }
        return count;
    };

    // Get unique items count
    const getUniqueItemsCount = () => {
        let count = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                count++;
            }
        }
        return count;
    };

    const deliveryFee = getTotalcartAmount() === 0 ? 0 : 40;
    const finalTotal = getTotalcartAmount() === 0 ? 0 : getTotalcartAmount() + deliveryFee - promoDiscount;

    // Check if cart is empty
    const isCartEmpty = getCartItemsCount() === 0;

    return (
        <div className='cart-page'>
            {/* Payment Method Modal */}
            {showPaymentModal && (
                <div className="payment-modal-overlay" onClick={() => setShowPaymentModal(false)}>
                    <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="payment-modal-header">
                            <h2>Select Payment Method</h2>
                            <button className="close-payment-modal" onClick={() => setShowPaymentModal(false)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                        
                        <div className="payment-options">
                            {/* Cash on Delivery */}
                            <div 
                                className={`payment-option ${selectedPayment === 'COD' ? 'selected' : ''}`}
                                onClick={() => handlePaymentSelect('COD')}
                            >
                                <div className="payment-option-icon cod">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                                        <line x1="1" y1="10" x2="23" y2="10"/>
                                    </svg>
                                </div>
                                <div className="payment-option-info">
                                    <h3>Cash on Delivery</h3>
                                    <p>Pay when your order arrives</p>
                                </div>
                                <div className="payment-option-check">
                                    {selectedPayment === 'COD' && (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60b246" strokeWidth="3">
                                            <path d="M20 6L9 17l-5-5"/>
                                        </svg>
                                    )}
                                </div>
                            </div>

                            {/* UPI Payment */}
                            <div 
                                className={`payment-option ${selectedPayment === 'UPI' ? 'selected' : ''}`}
                                onClick={() => handlePaymentSelect('UPI')}
                            >
                                <div className="payment-option-icon upi">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                                        <path d="M8 21h8M12 17v4"/>
                                    </svg>
                                </div>
                                <div className="payment-option-info">
                                    <h3>UPI Payment</h3>
                                    <p>GPay, PhonePe, Paytm & more</p>
                                    <div className="upi-logos">
                                        <span className="upi-badge">GPay</span>
                                        <span className="upi-badge">PhonePe</span>
                                        <span className="upi-badge">Paytm</span>
                                    </div>
                                </div>
                                <div className="payment-option-check">
                                    {selectedPayment === 'UPI' && (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60b246" strokeWidth="3">
                                            <path d="M20 6L9 17l-5-5"/>
                                        </svg>
                                    )}
                                </div>
                            </div>

                            {/* Card Payment */}
                            <div 
                                className={`payment-option ${selectedPayment === 'CARD' ? 'selected' : ''}`}
                                onClick={() => handlePaymentSelect('CARD')}
                            >
                                <div className="payment-option-icon card">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                                        <line x1="1" y1="10" x2="23" y2="10"/>
                                        <line x1="6" y1="14" x2="6" y2="14.01"/>
                                        <line x1="10" y1="14" x2="14" y2="14"/>
                                    </svg>
                                </div>
                                <div className="payment-option-info">
                                    <h3>Credit / Debit Card</h3>
                                    <p>Visa, Mastercard, RuPay</p>
                                </div>
                                <div className="payment-option-check">
                                    {selectedPayment === 'CARD' && (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60b246" strokeWidth="3">
                                            <path d="M20 6L9 17l-5-5"/>
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="payment-modal-footer">
                            <div className="payment-amount">
                                <span>Amount to pay</span>
                                <strong>₹{finalTotal}</strong>
                            </div>
                            <button 
                                className={`proceed-payment-btn ${selectedPayment ? 'active' : ''}`}
                                onClick={handleProceedWithPayment}
                                disabled={!selectedPayment}
                            >
                                {selectedPayment === 'COD' ? 'Place Order' : 'Continue to Pay'}
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                            </button>
                        </div>

                        <div className="payment-secure-note">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                            <span>Your payment information is secure and encrypted</span>
                        </div>
                    </div>
                </div>
            )}
            {/* Cart Header */}
            <div className="cart-header">
                <div className="cart-header-left">
                    <div className="cart-icon-big">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="9" cy="21" r="1"/>
                            <circle cx="20" cy="21" r="1"/>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                        </svg>
                    </div>
                    <div className="cart-header-text">
                        <h1>Your Cart</h1>
                        <p>{getCartItemsCount()} items • {getUniqueItemsCount()} unique dishes</p>
                    </div>
                </div>
                <Link to="/menu" className="continue-shopping-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Add More Items
                </Link>
            </div>

            {isCartEmpty ? (
                /* Empty Cart State */
                <div className="empty-cart">
                    <div className="empty-cart-icon">
                        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1">
                            <circle cx="9" cy="21" r="1"/>
                            <circle cx="20" cy="21" r="1"/>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                        </svg>
                    </div>
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added anything to your cart yet</p>
                    <Link to="/menu" className="browse-menu-btn">
                        Browse Menu
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </Link>
                </div>
            ) : (
                <div className="cart-content">
                    {/* Cart Items */}
                    <div className='cart-items-section'>
                        <div className="cart-items-header">
                            <h2>Order Summary</h2>
                            <span className="items-count-badge">{getCartItemsCount()} items</span>
                        </div>
                        
                        <div className="cart-items-list">
                            {food_list.map((item, index) => {
                                if (cartItems[item._id] > 0) {
                                    return (
                                        <div key={index} className="cart-item-card">
                                            <div className="cart-item-image">
                                                <img src={item.image} alt={item.name} />
                                                {item.isVeg !== undefined && (
                                                    <span className={`veg-badge ${item.isVeg ? 'veg' : 'non-veg'}`}>
                                                        <span className="dot"></span>
                                                    </span>
                                                )}
                                            </div>
                                            <div className="cart-item-details">
                                                <div className="cart-item-info">
                                                    <h3>{item.name}</h3>
                                                    <p className="item-description">{item.description?.slice(0, 50)}...</p>
                                                    <p className="item-price">₹{item.price} per item</p>
                                                </div>
                                                <div className="cart-item-actions">
                                                    <div className="quantity-controls">
                                                        <button 
                                                            className="qty-btn minus"
                                                            onClick={() => removeFromCart(item._id)}
                                                        >
                                                            −
                                                        </button>
                                                        <span className="qty-value">{cartItems[item._id]}</span>
                                                        <button 
                                                            className="qty-btn plus"
                                                            onClick={() => addToCart(item._id)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <p className="item-total">₹{item.price * cartItems[item._id]}</p>
                                                </div>
                                            </div>
                                            <button 
                                                className="remove-item-btn"
                                                onClick={() => {
                                                    for(let i = 0; i < cartItems[item._id]; i++) {
                                                        removeFromCart(item._id);
                                                    }
                                                }}
                                                title="Remove item"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                                </svg>
                                            </button>
                                        </div>
                                    )
                                }
                                return null;
                            })}
                        </div>

                        {/* Special Instructions */}
                        <div className="special-instructions">
                            <div className="instructions-header">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                                <span>Add cooking instructions (optional)</span>
                            </div>
                            <textarea 
                                placeholder="E.g., Less spicy, no onions, extra cheese..."
                                rows="2"
                            ></textarea>
                        </div>
                    </div>

                    {/* Cart Summary */}
                    <div className='cart-summary-section'>
                        {/* Promo Code */}
                        <div className="promo-section">
                            <div className="promo-header">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                                    <line x1="7" y1="7" x2="7.01" y2="7"/>
                                </svg>
                                <span>Apply Promo Code</span>
                            </div>
                            {!promoApplied ? (
                                <div className="promo-input-group">
                                    <input 
                                        type="text" 
                                        placeholder="Enter promo code"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                    />
                                    <button onClick={handleApplyPromo}>Apply</button>
                                </div>
                            ) : (
                                <div className="promo-applied">
                                    <div className="promo-success">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60b246" strokeWidth="2.5">
                                            <path d="M20 6L9 17l-5-5"/>
                                        </svg>
                                        <span>'{promoCode.toUpperCase()}' applied</span>
                                    </div>
                                    <button className="remove-promo" onClick={removePromo}>Remove</button>
                                </div>
                            )}
                            <div className="available-promos">
                                <p>Try: <span onClick={() => setPromoCode('WELCOME50')}>WELCOME50</span>, <span onClick={() => setPromoCode('SAVE20')}>SAVE20</span></p>
                            </div>
                        </div>

                        {/* Bill Details */}
                        <div className="bill-details">
                            <h3>Bill Details</h3>
                            <div className="bill-row">
                                <span>Item Total</span>
                                <span>₹{getTotalcartAmount()}</span>
                            </div>
                            <div className="bill-row">
                                <span>Delivery Fee</span>
                                <span className="delivery-fee">
                                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                                </span>
                            </div>
                            {promoApplied && (
                                <div className="bill-row discount">
                                    <span>Promo Discount</span>
                                    <span>-₹{promoDiscount}</span>
                                </div>
                            )}
                            <div className="bill-row total">
                                <span>To Pay</span>
                                <span>₹{finalTotal}</span>
                            </div>
                            {promoApplied && (
                                <div className="savings-badge">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                    </svg>
                                    You're saving ₹{promoDiscount} on this order!
                                </div>
                            )}
                        </div>

                        {/* Checkout Button */}
                        <button className="checkout-btn" onClick={handleCheckout}>
                            <span>Proceed to Checkout</span>
                            <span className="checkout-amount">₹{finalTotal}</span>
                        </button>

                        {/* Trust Badges */}
                        <div className="trust-badges">
                            <div className="trust-item">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                                <span>Secure Payment</span>
                            </div>
                            <div className="trust-item">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                </svg>
                                <span>Safe & Hygienic</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Cart
