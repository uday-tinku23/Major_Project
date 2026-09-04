import React, { useEffect, useState } from 'react';
import './Store.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

export default function Store() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const email = user?.email;

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
    if (email) {
      fetch(`/api/wishlist?email=${email}`)
        .then(res => res.json())
        .then(data => setWishlist(data));
    }
  }, [email]);

  const addToCart = async (productId) => {
    if (!email) {
      setMessage('Please log in to add to cart.');
      return;
    }
    setMessage('Adding...');
    const res = await fetch('/api/add-to-cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, email })
    });
    const data = await res.json();
    if (res.ok) setMessage('Added to cart!');
    else setMessage(data.message || 'Error adding to cart');
    setTimeout(() => setMessage(''), 1200);
  };

  const addToWishlist = async (productId) => {
    if (!email) {
      setMessage('Please log in to add to wishlist.');
      return;
    }
    await fetch('/api/add-to-wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, email })
    });
    fetch(`/api/wishlist?email=${email}`)
      .then(res => res.json())
      .then(data => setWishlist(data));
  };

  const removeFromWishlist = async (productId) => {
    if (!email) return;
    await fetch('/api/remove-from-wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, email })
    });
    fetch(`/api/wishlist?email=${email}`)
      .then(res => res.json())
      .then(data => setWishlist(data));
  };

  const isInWishlist = (productId) => wishlist.some(p => p.id === productId);

  return (
    <div className="store-bg">
      <div className="store-header">
        <h1>Agri Store</h1>
        <div>
          <Link to="/wishlist" className="cart-link" style={{marginRight: 12}}>Wishlist</Link>
          <Link to="/cart" className="cart-link">View Cart</Link>
        </div>
      </div>
      {message && <div className="store-message">{message}</div>}
      {loading ? <div className="store-loading">Loading products...</div> : (
        <div className="store-grid">
          {products.map(product => (
            <div className="store-card" key={product.id}>
              <img className="store-card-img" src={product.image} alt={product.name} />
              <div className="store-card-title">{product.name}</div>
              <div className="store-card-details">
                <span className="store-chip">{product.category}</span>
                <span className="store-chip">{product.crop}</span>
              </div>
              <div className="store-card-price">₹{product.price} <span className="store-unit">/{product.unit}</span></div>
              <button className="store-add-btn" onClick={() => addToCart(product.id)}>Add to Cart</button>
              <button className="store-wishlist-btn" onClick={() => isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product.id)}>
                {isInWishlist(product.id) ? <FaHeart color="#e53935" /> : <FaRegHeart color="#888" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 