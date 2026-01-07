import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import router from './routes/authroutes.js'
import adminRoutes from './routes/adminRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import wishlistRoutes from './routes/wishlistRoutes.js'
import { connectAdminDB,connectUserDB } from './config/db.js'
import "./config/passport.js"
import session from 'express-session';

import passport from 'passport'
dotenv.config();
const app = express();
const port = process.env.PORT || 5000 
app.use(express.json());
app.use(cors({origin:process.env.cors_origin}))

app.use(express.urlencoded({ extended: true }));
app.use(cors({
   origin: process.env.cors_origin,
   credentials: true,
}));

app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

(async () => {
  try {
    await connectUserDB();
     console.log(" Connected to  UserDB ");
    await connectAdminDB();
    console.log(" Connected to  AdminDB");
  } catch (err) {
    console.error(" DB connection error:", err);
  }
})();

//app.use(bodyParser.json());
app.use('/api',router)
app.use('/api/admin', adminRoutes);
app.use('/api/admin/products', productRoutes);
app.use('/api/user',userRoutes);
app.use('/api/orders', orderRoutes); 
app.use('/api/reviews',reviewRoutes)
app.use('/api/wishlist', wishlistRoutes); // Wishlist routes)

// Health check route
app.get('/api/user/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});


console.log("hii");
app.listen(port, () => {
   console.log(`Listening on port ${port}`)
})
