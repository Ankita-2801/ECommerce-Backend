## Overview
A robust, scalable RESTful API built to power modern e-commerce applications. It handles everything from product catalogs and secure checkouts to inventory management and order processing.

## 🚀 Features
- **User Authentication:** Secure signup/login using JWT and role-based access (Admin/Customer).
- **Google OAuth Login:** Sign in using a Google account.
- *Role-Based Access Control:* Separate access and permissions for Admin and User.
- **Product & Inventory Management:** Advanced filtering, searching, and real-time stock tracking.
- **Shopping Cart & Orders:** Flexible cart management with stateful order processing.
- **Payment Integration:** Secure payment processing integrated with [Stripe/PayPal].
- **Background Workers:** Asynchronous email notifications for order confirmations via [BullMQ/Celery].

## 🛠️ Tech Stack
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL (Main DB), Redis (Caching & Session management)
- **ORM:** Prisma / Sequelize
- **Testing:** Jest, Supertest

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL
- Redis (optional, for caching)

### Installation
1. Clone the repository:
   ```bash
   git clone [https://github.com/yourusername/ecommerce-backend.git](https://github.com/yourusername/ecommerce-backend.git)
   cd ecommerce-backend
