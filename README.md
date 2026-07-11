## Overview
A robust, scalable RESTful API built to power modern e-commerce applications. It handles everything from product catalogs and secure checkouts to inventory management and order processing.

## 📑 Table of Contents

* Features & Funcitionalities
* Technology Stack
* Prerequisites
* Installation & Setup
* Testing and Evaluation
* Future Scope
* Appendix / Demo Section


## 🚀 Features & Funcitionalities
- **User Authentication:** Secure signup/login using JWT and role-based access (Admin/Customer).
- **Google OAuth Login:** Sign in using a Google account.
- **Role-Based Access Control:** Separate access and permissions for Admin and User.
- **Admin Dashboard:** Manage products, orders, users, and monitor overall platform activities.
- **User Dashboard:** View profile, manage orders, wishlist, and shopping cart.
- **Product & Inventory Management:** Advanced filtering, searching, and real-time stock tracking.
- **Shopping Cart & Orders:** Flexible cart management with stateful order processing.
- **Payment Integration:** Generate QR codes for secure digital payments using a React QR code generator.
- **Email Notifications:** Notify users via email about about product discounts and important updates.

## 🛠️ Technology Stack
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

### Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Ankita-2801/ECommerce-Backend

2. Install Dependencies: npm install
   
3. Create a `.env` file:

Create a `.env` file in the project root and add the following variables:

```env
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

cors_origin=http://localhost:5173
```

4. Run the server: npm run dev, Server runs at http://localhost:5000

## ✅ Testing and Evaluation

* Tested all REST API endpoints using **Postman**.
* Verified HTTP status codes (200, 201, 400, 401, 403, 404, and 500)
* Verified user authentication and JWT-protected routes.
* Validated CRUD operations for users, products, cart, wishlist, and orders on MongoDB Atlas.
* Tested Admin and User dashboard functionalities.
* Verified QR code payment generation and product offer email notifications.
* Ensured data integrity with **MongoDB Atlas** and proper error handling.
* Confirmed secure password hashing using **bcrypt** and role-based access control.

## 🚀 Future Scope

* Implement inventory management with real-time stock tracking.
* Integrate payment gateways such as Stripe or PayPal for online transactions.
* Add employee management functionality to manage staff details, roles, permissions, and work-related activities.
* Enable order tracking with real-time delivery updates.
* Develop an analytics dashboard for sales and customer insights.
* Implement AI-based product recommendations for personalized shopping experiences.
* Enhance security with two-factor authentication (2FA) and advanced fraud detection.

## 🎬 Appendix / Demo Section 
* Backend- https://e-commerce-backend-ten-sage.vercel.app
* Frontend- https://e-commerce-frontend-psi-self.vercel.app

## 👩‍💻 Author
```
 Ankita Paul
 - B.Tech in Information Technology, Narula Institute of Technology.

Srijeeta Biswas*
- B.Tech in Artificial Intelligence & Machine Learning, Narula Institute of Technology.

Anushka Banik
- B.Tech in Computer Science & Engineering, Techno Bengal Institute of Technology.
  ```
