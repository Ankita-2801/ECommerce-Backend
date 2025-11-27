import mongoose from 'mongoose';
import dotenv from "dotenv"
dotenv.config();
let userDB, adminDB;

export const connectUserDB = async () => {
  if (!userDB) {
    userDB = await mongoose.createConnection(process.env.Mongo_user, //{
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
   // }
   );
  }
  return userDB;
};

export const connectAdminDB = async () => {
  if (!adminDB) {
    adminDB = await mongoose.createConnection(process.env.Mongo_admin, //{
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
   // }
   );
  }
  return adminDB;
};


