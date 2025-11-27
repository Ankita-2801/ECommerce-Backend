import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { getAdminModel } from "../models/Admin.js";
import { getUserModel } from "../models/User.js";


dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALL_BACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        // Check Admin DB first
        const Admin = await getAdminModel();

        let account = await Admin.findOne({ email });
        if (account) {
          return done(null, { ...account.toObject(), role: "admin" });
        }

        // Check User DB
        const User = await getUserModel();

        account = await User.findOne({ email });
        if (account) {
          return done(null, { ...account.toObject(), role: "user" });
        }

        // If not found, reject login (or auto-create user)
        return done(null, false, { message: "Account not found" });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
