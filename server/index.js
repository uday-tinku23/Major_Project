const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const products = require('./products');
const techPredictions = require('./techPredictions');

const app = express();
app.use(express.json());
app.use(cors());

// Temporary storage (replace with MongoDB later)
const users = [];

// JWT secret key (move to .env in production)
const JWT_SECRET = 'your-secret-key';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Register endpoint
app.post('/register', async (req, res) => {
  try {
    const { name, email, crop } = req.body;

    // Check if user already exists
    if (users.find(user => user.email === email)) {
      return res.status(200).json({ message: 'User already exists' });
    }

    // Create new user (no password, since Firebase handles it)
    const user = {
      id: users.length + 1,
      name,
      email,
      createdAt: new Date(),
      ...(crop && { crop })
    };

    // Store user
    users.push(user);

    res.status(201).json({
      message: 'Registration successful',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Create and send JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Protected route example
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// Add this route for the root path
app.get('/', (req, res) => {
  res.send('CropEra backend is running!');
});

// Temporary: View all users (for development only)
app.get('/users', (req, res) => {
  res.json(users);
});

app.patch('/update-crop', (req, res) => {
  const { email, crop } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  user.crop = crop;
  res.json({ message: 'Crop updated', user });
});

// Add after users array:
const recommendations = [
  { crop: "Rice", condition: "temp > 35", action: "Water early morning, use mulch (dry leaves), spray potash to cool crop.", water_level: "Keep 5 cm standing water", spray_time: "Before 9 AM or after 5 PM" },
  { crop: "Rice", condition: "temp < 15", action: "Light irrigation to avoid cold stress.", water_level: "Light irrigation", spray_time: "At noon for maximum absorption" },
  { crop: "Rice", condition: "humidity > 60%", action: "Monitor for fungal diseases, ensure proper ventilation.", water_level: "Maintain moist soil", spray_time: "Early morning for best results" },
  { crop: "Rice", condition: "humidity < 60%", action: "Increase irrigation frequency to maintain soil moisture.", water_level: "Increase irrigation frequency", spray_time: "After sunset to avoid evaporation" },
  { crop: "Rice", condition: "rainfall > 50mm", action: "Ensure proper drainage, delay irrigation if necessary.", water_level: "Stop irrigation temporarily", spray_time: "During cloudy weather if possible" },
  { crop: "Rice", condition: "no rainfall for 7 days", action: "Water deeply and increase frequency of irrigation.", water_level: "Deep irrigation every alternate day", spray_time: "Avoid spraying during rainfall" },
  { crop: "Wheat", condition: "temp > 35", action: "Water early morning, use mulch (dry leaves), spray potash to cool crop.", water_level: "Keep 5 cm standing water", spray_time: "Before 9 AM or after 5 PM" },
  { crop: "Wheat", condition: "temp < 15", action: "Light irrigation to avoid cold stress.", water_level: "Light irrigation", spray_time: "At noon for maximum absorption" },
  { crop: "Wheat", condition: "humidity > 80%", action: "Monitor for fungal diseases, ensure proper ventilation.", water_level: "Maintain moist soil", spray_time: "Early morning for best results" },
  { crop: "Wheat", condition: "humidity < 30%", action: "Increase irrigation frequency to maintain soil moisture.", water_level: "Increase irrigation frequency", spray_time: "After sunset to avoid evaporation" },
  { crop: "Wheat", condition: "rainfall > 50mm", action: "Ensure proper drainage, delay irrigation if necessary.", water_level: "Stop irrigation temporarily", spray_time: "During cloudy weather if possible" },
  { crop: "Wheat", condition: "no rainfall for 7 days", action: "Water deeply and increase frequency of irrigation.", water_level: "Deep irrigation every alternate day", spray_time: "Avoid spraying during rainfall" },
  { crop: "Cotton", condition: "temp > 35", action: "Water early morning, use mulch (dry leaves), spray potash to cool crop.", water_level: "Keep 5 cm standing water", spray_time: "Before 9 AM or after 5 PM" },
  { crop: "Cotton", condition: "temp < 15", action: "Light irrigation to avoid cold stress.", water_level: "Light irrigation", spray_time: "At noon for maximum absorption" },
  { crop: "Cotton", condition: "humidity > 80%", action: "Monitor for fungal diseases, ensure proper ventilation.", water_level: "Maintain moist soil", spray_time: "Early morning for best results" },
  { crop: "Cotton", condition: "humidity < 30%", action: "Increase irrigation frequency to maintain soil moisture.", water_level: "Increase irrigation frequency", spray_time: "After sunset to avoid evaporation" },
  { crop: "Cotton", condition: "rainfall > 50mm", action: "Ensure proper drainage, delay irrigation if necessary.", water_level: "Stop irrigation temporarily", spray_time: "During cloudy weather if possible" },
  { crop: "Cotton", condition: "no rainfall for 7 days", action: "Water deeply and increase frequency of irrigation.", water_level: "Deep irrigation every alternate day", spray_time: "Avoid spraying during rainfall" },
  { crop: "Sugarcane", condition: "temp > 35", action: "Water early morning, use mulch (dry leaves), spray potash to cool crop.", water_level: "Keep 5 cm standing water", spray_time: "Before 9 AM or after 5 PM" },
  { crop: "Sugarcane", condition: "temp < 15", action: "Light irrigation to avoid cold stress.", water_level: "Light irrigation", spray_time: "At noon for maximum absorption" },
  { crop: "Sugarcane", condition: "humidity > 80%", action: "Monitor for fungal diseases, ensure proper ventilation.", water_level: "Maintain moist soil", spray_time: "Early morning for best results" },
  { crop: "Sugarcane", condition: "humidity < 30%", action: "Increase irrigation frequency to maintain soil moisture.", water_level: "Increase irrigation frequency", spray_time: "After sunset to avoid evaporation" },
  { crop: "Sugarcane", condition: "rainfall > 50mm", action: "Ensure proper drainage, delay irrigation if necessary.", water_level: "Stop irrigation temporarily", spray_time: "During cloudy weather if possible" },
  { crop: "Sugarcane", condition: "no rainfall for 7 days", action: "Water deeply and increase frequency of irrigation.", water_level: "Deep irrigation every alternate day", spray_time: "Avoid spraying during rainfall" },
  { crop: "Tomato", condition: "temp > 35", action: "Water early morning, use mulch (dry leaves), spray potash to cool crop.", water_level: "Keep 5 cm standing water", spray_time: "Before 9 AM or after 5 PM" },
  { crop: "Tomato", condition: "temp < 15", action: "Light irrigation to avoid cold stress.", water_level: "Light irrigation", spray_time: "At noon for maximum absorption" },
  { crop: "Tomato", condition: "humidity > 80%", action: "Monitor for fungal diseases, ensure proper ventilation.", water_level: "Maintain moist soil", spray_time: "Early morning for best results" },
  { crop: "Tomato", condition: "humidity < 30%", action: "Increase irrigation frequency to maintain soil moisture.", water_level: "Increase irrigation frequency", spray_time: "After sunset to avoid evaporation" },
  { crop: "Tomato", condition: "rainfall > 50mm", action: "Ensure proper drainage, delay irrigation if necessary.", water_level: "Stop irrigation temporarily", spray_time: "During cloudy weather if possible" },
  { crop: "Tomato", condition: "no rainfall for 7 days", action: "Water deeply and increase frequency of irrigation.", water_level: "Deep irrigation every alternate day", spray_time: "Avoid spraying during rainfall" },
  { crop: "Brinjal", condition: "temp > 35", action: "Water early morning, use mulch (dry leaves), spray potash to cool crop.", water_level: "Keep 5 cm standing water", spray_time: "Before 9 AM or after 5 PM" },
  { crop: "Brinjal", condition: "temp < 15", action: "Light irrigation to avoid cold stress.", water_level: "Light irrigation", spray_time: "At noon for maximum absorption" },
  { crop: "Brinjal", condition: "humidity > 80%", action: "Monitor for fungal diseases, ensure proper ventilation.", water_level: "Maintain moist soil", spray_time: "Early morning for best results" },
  { crop: "Brinjal", condition: "humidity < 30%", action: "Increase irrigation frequency to maintain soil moisture.", water_level: "Increase irrigation frequency", spray_time: "After sunset to avoid evaporation" },
  { crop: "Brinjal", condition: "rainfall > 50mm", action: "Ensure proper drainage, delay irrigation if necessary.", water_level: "Stop irrigation temporarily", spray_time: "During cloudy weather if possible" },
  { crop: "Brinjal", condition: "no rainfall for 7 days", action: "Water deeply and increase frequency of irrigation.", water_level: "Deep irrigation every alternate day", spray_time: "Avoid spraying during rainfall" }
];

// Add recommendation endpoint
app.get('/api/recommendations', (req, res) => {
  const { crop, temp, humidity, rain } = req.query;
  // Helper to normalize crop names (case/space insensitive, sugar cane fix)
  function normalizeCrop(str) {
    if (!str) return '';
    let s = str.toLowerCase().replace(/\s+/g, '');
    if (s === 'sugarcane') return 'sugarcane';
    return s;
  }
  const normCrop = normalizeCrop(crop);
  const t = temp !== undefined ? parseFloat(temp) : undefined;
  const h = humidity !== undefined ? parseFloat(humidity) : undefined;
  const r = rain !== undefined ? parseFloat(rain) : undefined;
  let debug = [];
  let match = null;
  if (normCrop) {
    // Try temp > 35
    if (t !== undefined && t > 35) {
      match = recommendations.find(r => normalizeCrop(r.crop) === normCrop && r.condition.toLowerCase().includes('temp > 35'));
      debug.push(`Tried temp > 35: ${!!match}`);
    }
    // Try temp < 15
    if (!match && t !== undefined && t < 15) {
      match = recommendations.find(r => normalizeCrop(r.crop) === normCrop && r.condition.toLowerCase().includes('temp < 15'));
      debug.push(`Tried temp < 15: ${!!match}`);
    }
    // Try humidity > 80%
    if (!match && h !== undefined && h > 80) {
      match = recommendations.find(r => normalizeCrop(r.crop) === normCrop && r.condition.toLowerCase().includes('humidity > 80%'));
      debug.push(`Tried humidity > 80%: ${!!match}`);
    }
    // Try humidity < 30%
    if (!match && h !== undefined && h < 30) {
      match = recommendations.find(r => normalizeCrop(r.crop) === normCrop && r.condition.toLowerCase().includes('humidity < 30%'));
      debug.push(`Tried humidity < 30%: ${!!match}`);
    }
    // Try rainfall > 50mm
    if (!match && r !== undefined && r > 50) {
      match = recommendations.find(r => normalizeCrop(r.crop) === normCrop && r.condition.toLowerCase().includes('rainfall > 50mm'));
      debug.push(`Tried rainfall > 50mm: ${!!match}`);
    }
    // Try no rainfall for 7 days (rain === 0)
    if (!match && r !== undefined && r === 0) {
      match = recommendations.find(r => normalizeCrop(r.crop) === normCrop && r.condition.toLowerCase().includes('no rainfall for 7 days'));
      debug.push(`Tried no rainfall for 7 days: ${!!match}`);
    }
  }
  // Debug output
  console.log('Recommendation query:', { crop, temp, humidity, rain, normCrop, debug });
  if (match) {
    res.json(match);
  } else {
    res.status(404).json({ message: 'No matching recommendation found for these conditions.', debug });
  }
});

// --- Products Array ---

// --- In-memory cart per user (by email) ---
const carts = {};

// --- Products endpoint ---
app.get('/api/products', (req, res) => {
  res.json(products);
});

// --- Add to cart ---
app.post('/api/add-to-cart', (req, res) => {
  const { productId, email } = req.body;
  if (!productId || !email) return res.status(400).json({ message: 'Missing productId or email' });
  if (!carts[email]) carts[email] = [];
  const product = products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  carts[email].push(product);
  res.json({ message: 'Added to cart', cart: carts[email] });
});

// --- Get cart ---
app.get('/api/cart', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: 'Missing email' });
  res.json(carts[email] || []);
});

// --- Remove from cart ---
app.post('/api/remove-from-cart', (req, res) => {
  const { productId, email } = req.body;
  if (!productId || !email) return res.status(400).json({ message: 'Missing productId or email' });
  if (!carts[email]) return res.status(404).json({ message: 'Cart not found' });
  carts[email] = carts[email].filter(p => p.id !== productId);
  res.json({ message: 'Removed from cart', cart: carts[email] });
});

// --- Checkout ---
app.post('/api/checkout', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Missing email' });
  carts[email] = [];
  res.json({ message: 'Checkout successful! Your order has been placed.' });
});

// --- Technology Predictions API ---
app.get('/api/tech-predictions', (req, res) => {
  let { technology, type, minConfidence, maxConfidence, year } = req.query;
  let results = techPredictions;
  if (technology) {
    results = results.filter(p => p.technology.toLowerCase().includes(technology.toLowerCase()));
  }
  if (type) {
    results = results.filter(p => p.type.toLowerCase() === type.toLowerCase());
  }
  if (minConfidence) {
    results = results.filter(p => p.confidence >= parseInt(minConfidence));
  }
  if (maxConfidence) {
    results = results.filter(p => p.confidence <= parseInt(maxConfidence));
  }
  if (year) {
    results = results.filter(p => p.targetYear === parseInt(year));
  }
  res.json(results);
});

app.get('/api/tech-predictions/:technology', (req, res) => {
  const { technology } = req.params;
  const results = techPredictions.filter(p => p.technology.toLowerCase() === technology.toLowerCase());
  if (results.length === 0) return res.status(404).json({ message: 'No predictions found for this technology.' });
  res.json(results);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 