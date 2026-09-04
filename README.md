🌾 CropEra — Smart Agriculture & Farming Assistant

CropEra is a smart agriculture web application designed to help farmers make better decisions using weather information, crop-specific recommendations, agricultural products, and emerging farming technologies.

The platform combines React, Node.js, Express.js, Firebase Authentication, and OpenWeatherMap to provide a simple and user-friendly digital agriculture experience.

🚀 Features
🌱 Crop-Based Recommendations

CropEra provides agricultural recommendations based on the selected crop and environmental conditions such as:

Temperature
Humidity
Rainfall
Weather conditions

Supported crops include:

🌾 Rice
🌾 Wheat
🌿 Cotton
🎋 Sugar Cane
🍅 Tomato
🍆 Brinjal

The recommendation system currently uses a rule-based agricultural decision engine to generate crop-specific suggestions.

🌦️ Weather Information

Users can check current and forecast weather information using OpenWeatherMap.

Features include:

Current temperature
Feels-like temperature
Humidity
Wind speed
Atmospheric pressure
Visibility
Sunrise and sunset
Rain information
Weather conditions
24-hour forecast
City-based weather search
Current-location weather

Weather conditions also dynamically change the application's visual background.

💧 Smart Irrigation Advice

CropEra analyzes weather conditions to provide irrigation guidance.

Examples include:

When irrigation may not be required because of rainfall
Increased watering requirements during hot and dry conditions
Moderate watering recommendations
Situations where immediate watering may not be necessary
🧴 Spray Recommendations

The application also provides weather-based guidance for agricultural spraying.

For example:

Avoid spraying during rainfall
Avoid spraying during strong winds
Favor low-wind conditions
Consider upcoming weather before spraying
🛒 Agricultural Store

CropEra includes an agricultural products marketplace where users can:

Browse agricultural products
View product information
Add products to cart
Remove products from cart
View cart totals
Proceed through the checkout flow
❤️ Wishlist

Users can save products they are interested in using the wishlist interface.

🔐 Authentication

Authentication is implemented using Firebase Authentication.

Supported authentication methods include:

Email and password
Google authentication
Email verification

User information and selected crop information are used to personalize the application.

👤 User Profile

Users can view and update their selected crop from their profile.

Changing the selected crop allows the application to provide recommendations relevant to the user's current crop.

🤖 Agricultural Technology Predictions

The Technology Predictions section presents information about emerging agricultural technologies such as:

Precision Farming
Drip Irrigation
Vertical Farming
Soil Moisture Sensors
Agricultural Drones
Hydroponics

Users can filter predictions using parameters such as:

Technology
Type
Confidence
Target year

Note: The current implementation uses a predefined technology dataset and filtering system rather than a machine-learning prediction model.

🏗️ Project Architecture
                         ┌──────────────────────┐
                         │       CropEra        │
                         │    React Frontend    │
                         └───────────┬──────────┘
                                     │
                  ┌──────────────────┼──────────────────┐
                  │                  │                  │
                  ▼                  ▼                  ▼
             Firebase          Express.js        OpenWeatherMap
           Authentication         API                  API
                  │                  │                  │
                  │                  ▼                  │
                  │          Recommendation             │
                  │             Engine                  │
                  │                  │                  │
                  │                  ▼                  │
                  │          Crop + Weather             │
                  │           Recommendations          │
                  │                                     │
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
                              CropEra Dashboard
                                     │
                ┌────────────────────┼────────────────────┐
                │                    │                    │
                ▼                    ▼                    ▼
             Weather              Store          Technology
           & Irrigation        Cart/Wishlist      Predictions

🛠️ Tech Stack
Frontend
React.js
React Router
JavaScript
CSS
Formik
Yup
React Icons
Firebase Authentication
Backend
Node.js
Express.js
CORS
JWT
bcrypt
dotenv
APIs & Services
OpenWeatherMap API
Firebase Authentication
Data

The current backend uses JavaScript-based data structures and files for:

Users
Cart information
Agricultural products
Technology predictions
Crop recommendations
📁 Project Structure
Major_Project/
│
├── client/
│   │
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── ...
│   │
│   ├── src/
│   │   ├── App.js
│   │   ├── Home.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── CropSelect.js
│   │   ├── Profile.js
│   │   ├── Weather.js
│   │   ├── Store.js
│   │   ├── Cart.js
│   │   ├── Wishlist.js
│   │   ├── TechPredictions.js
│   │   ├── About.js
│   │   ├── Terms.js
│   │   ├── firebase.js
│   │   └── ...
│   │
│   └── package.json
│
├── server/
│   ├── index.js
│   ├── products.js
│   ├── techPredictions.js
│   └── package.json
│
├── package.json
├── package-lock.json
├── .gitignore
└── README.md

🔄 Application Flow
User
 │
 ▼
Register / Login
 │
 ▼
Firebase Authentication
 │
 ▼
Select Crop
 │
 ▼
Personalized Home
 │
 ├───────────────┐
 │               │
 ▼               ▼
Weather         Store
 │               │
 ▼               ├── Cart
Crop + Weather  └── Wishlist
 │
 ▼
Agricultural Recommendation
 │
 ├── Irrigation Advice
 └── Spray Advice

🌦️ Weather & Recommendation Flow
Enter City / Use Current Location
                │
                ▼
        OpenWeatherMap API
                │
                ▼
       Weather Information
                │
       ┌────────┴────────┐
       ▼                 ▼
   Temperature        Humidity
       │                 │
       └────────┬────────┘
                ▼
             Rainfall
                │
                ▼
        Selected Crop
                │
                ▼
      Recommendation Engine
                │
        ┌───────┴────────┐
        ▼                ▼
 Irrigation Advice   Spray Advice

🔌 API Endpoints

The Express backend currently provides endpoints for users, products, carts, recommendations, and technology predictions.

User APIs
POST /register
POST /login
GET /users
PATCH /update-crop
GET /protected

Product API
GET /api/products

Cart APIs
GET /api/cart
POST /api/cart
DELETE /api/cart

Recommendation API
GET /api/recommendations


Example:

/api/recommendations?crop=Rice&temp=30&humidity=60&rain=0

Technology Prediction APIs
GET /api/tech-predictions
GET /api/tech-predictions/:technology

⚙️ Installation
1. Clone the repository
git clone https://github.com/uday-tinku23/Major_Project.git

cd Major_Project

2. Install frontend dependencies
cd client
npm install

3. Install backend dependencies

Open another terminal:

cd server
npm install

🔑 Environment Configuration

Create the required environment configuration for your local setup.

For the frontend, configure your Firebase project credentials and weather API configuration.

Example:

REACT_APP_WEATHER_API_KEY=your_openweathermap_api_key

REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id


Important: Never commit real API keys, Firebase credentials, passwords, or other secrets to GitHub.

▶️ Running the Project
Start the backend
cd server
npm start


The backend runs on:

http://localhost:5000

Start the frontend

Open another terminal:

cd client
npm start


The frontend will normally be available at:

http://localhost:3000

🧪 Development

The frontend communicates with the Express backend through API requests.

React
  │
  │ HTTP Requests
  ▼
Express Server
  │
  ├── Products
  ├── Cart
  ├── Users
  ├── Recommendations
  └── Technology Predictions


Weather information is retrieved from OpenWeatherMap, while authentication is handled through Firebase.

🎯 Main Objectives

CropEra was developed with the following objectives:

Provide farmers with accessible agricultural information.
Combine weather information with crop-specific recommendations.
Help farmers make better irrigation and spraying decisions.
Provide an online platform for agricultural products.
Introduce farmers to modern agricultural technologies.
Demonstrate how web technologies can be applied to smart agriculture.
🔮 Future Enhancements

The project can be extended with:

🧠 Machine-learning-based crop disease detection
🌱 Crop yield prediction
🌦️ More advanced weather forecasting
🗄️ MongoDB database integration
🔐 Unified authentication and authorization
💳 Real payment gateway integration
❤️ Complete wishlist backend
📱 Improved mobile responsiveness
🌐 Multi-language support for farmers
📍 Location-based agricultural recommendations
📊 Farmer analytics dashboard
🤖 AI-powered agricultural chatbot
📷 Plant disease detection using images
🌾 Soil-based crop recommendations
📡 IoT sensor integration for soil moisture and temperature
⚠️ Current Limitations

This project is currently a prototype/academic project.

Some backend information is stored in memory or static JavaScript files rather than a persistent production database.

The agricultural recommendation engine is currently rule-based, and the technology prediction section uses predefined data rather than a trained machine-learning model.

Payment processing is also a prototype flow and should not be considered a real payment system.

👨‍💻 Project

CropEra — Smart Agriculture & Farming Assistant

Repository:

Major_Project

Built using modern web technologies to explore how digital platforms can support smarter and more efficient agriculture.

📜 License

This project is intended for educational and academic purposes.
