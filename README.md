## Overview
A robust, scalable RESTful API built to power modern e-commerce applications. It handles everything from product catalogs and secure checkouts to inventory management and order processing.

## 🚀 Features
- **User Authentication:** Secure signup/login using JWT and role-based access (Admin/Customer).
- **Google OAuth Login:** Sign in using a Google account.
- **Role-Based Access Control:** Separate access and permissions for Admin and User.
- **Admin Dashboard:** Manage products, orders, users, and monitor overall platform activities.
- **User Dashboard:** View profile, manage orders, wishlist, and shopping cart.
- **Product & Inventory Management:** Advanced filtering, searching, and real-time stock tracking.
- **Shopping Cart & Orders:** Flexible cart management with stateful order processing.
- **Payment Integration:** Generate QR codes for secure digital payments using a React QR code generator.
- **Email Notifications:** Notify users via email about about product discounts and important updates.

## 🛠️ Tech Stack
- **Backend:** Node.js, Express, JavaScript
- **Database:** MongoDB Atlas
- **Authentication:** JWT, Google OAuth
- **Other Libraries:**
  *react*
  *react-dom*
  *react-router-dom*
  *axios*
  *joi*
  *bcryptjs*
  *jsonwebtoken*
  *dotenv*
  *cors*
  *mongoose*
  *express*
  *express-session*
  *express-validator*
  *crypto*
  *cloudinary*
  *nodemailer*
  *passport*
  *passport-google-oauth20*
  
  

## 📂 Project Structure

Backend/
│
├── config/
│   ├── db.js
│   ├── cloudinary.js
│   └── passport.js
│
├── controllers/
│
├── middleware/
│
├── models/
│
├── routes/
│
├── utils/
│
├── uploads/
│
├── .env
├── server.js
├── package.json
└── README.md

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (comes with Node.js)
- MongoDB Atlas account
- Cloudinary account (for image storage)
- Gmail Account with an App Password
- Google OAuth Credentials (for Google Sign-In)
- Git (to clone the repository)
- Code Editor (recommended: Visual Studio Code)

### Installation
1. Clone the repository:
   ```bash
   git clone [https://github.com/Ankita-2801/ECommerce-Backend]

2. Install Dependencies: npm install
3. Create a .env file:
   
PORT=5000
MONGO_admin=your_mongodb_connection_string
MONGO_user=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

MAIL_USER=your_email
MAIL_PASS=your_email_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=cloudinary_apiKey
CLOUD_API_SECRET=cloudinary_secret_key

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CALL_BACK_URL=http://localhost:5000/api/auth/google

OSM_API_KEY=your_osm_apiKey

cors_origin=https://localhost:5173

4. Run the server: npm run dev, Server runs at http://localhost:5000

## 👩‍💻 Author
 *Ankita Paul*
-B.Tech in Information Technology
-Narula Institute of Technology
  
