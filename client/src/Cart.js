import React, { useEffect, useState } from 'react';
import './Cart.css';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);
  const [paying, setPaying] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const email = user?.email;
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      setMessage('Please log in to view your cart.');
      setLoading(false);
      return;
    }
    fetch(`/api/cart?email=${encodeURIComponent(email)}`)
      .then(res => res.json())
      .then(data => {
        setCart(data);
        setLoading(false);
      });
  }, [email]);

  const removeFromCart = async (productId) => {
    setMessage('Removing...');
    const res = await fetch('/api/remove-from-cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, email })
    });
    const data = await res.json();
    if (res.ok) {
      setCart(data.cart);
      setMessage('Removed from cart!');
    } else {
      setMessage(data.message || 'Error removing from cart');
    }
    setTimeout(() => setMessage(''), 1200);
  };

  const checkout = async () => {
    setCheckingOut(true);
    setMessage('Processing checkout...');
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (res.ok) {
      setCart([]);
      setMessage('Checkout successful! Thank you for your order.');
    } else {
      setMessage(data.message || 'Checkout failed');
    }
    setCheckingOut(false);
    setTimeout(() => setMessage(''), 2000);
  };

  const payNow = async () => {
    setPaying(true);
    setMessage('Processing payment...');
    const res = await fetch('/api/pay', { method: 'POST' });
    const data = await res.json();
    if (res.ok && data.success) {
      setMessage('Payment successful! (Fake)');
    } else {
      setMessage(data.message || 'Payment failed');
    }
    setPaying(false);
    setTimeout(() => setMessage(''), 2000);
  };

  const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <div className="cart-bg">
      <div className="cart-header">
        <h1>Your Cart</h1>
        <Link to="/store" className="store-link">Back to Store</Link>
      </div>
      {message && <div className="cart-message">{message}</div>}
      {loading ? <div className="cart-loading">Loading cart...</div> : (
        <div className="cart-list">
          {cart.length === 0 ? (
            <div className="cart-empty">Your cart is empty.</div>
          ) : (
            <>
              {cart.map((item, idx) => (
                <div className="cart-item" key={item.id + '-' + idx}>
                  <div className="cart-item-main">
                    <div className="cart-item-title">{item.name}</div>
                    <div className="cart-item-details">
                      <span className="cart-chip">{item.category}</span>
                      <span className="cart-chip">{item.crop}</span>
                    </div>
                  </div>
                  <div className="cart-item-actions">
                    <div className="cart-item-price">₹{item.price} <span className="cart-unit">/{item.unit}</span></div>
                    <button className="cart-remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
                  </div>
                </div>
              ))}
              <div className="cart-total-row">
                <div className="cart-total-label">Total:</div>
                <div className="cart-total-value">₹{total}</div>
              </div>
              <button className="cart-checkout-btn" onClick={checkout} disabled={checkingOut}>Checkout</button>
              <button className="cart-pay-btn" onClick={payNow} disabled={paying || cart.length === 0} style={{marginTop: 10}}>
                {paying ? 'Paying...' : 'Pay Now'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
} 