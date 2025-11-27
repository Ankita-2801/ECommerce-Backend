import { getAdminModel } from "../models/Admin.js";
import { getUserModel } from "../models/User.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto";
import nodemailer from "nodemailer"


//signup 
export const signup = async (req, res) => {
  try {
    const {role, username, phone, email, password } = req.body;
    const Admin = await getAdminModel();
    const User = await getUserModel();

    // check existing user
    const existingEmail =  (await User.findOne({ email })) || (await Admin.findOne({ email }));
if (existingEmail) {
  return res.status(409).json({ success: false, message: "Email is already registered" });
}
const existingPhone =  (await User.findOne({ phone })) || (await Admin.findOne({ phone }));
if (existingPhone) {
  return res.status(409).json({ success: false, message: "Phone Number is already registered" });
}

 // hash password
 
    const hashedPassword = await bcrypt.hash(password, 10);
  let account;
    
   
   if(role==='user'){
     account = new User({
      role,
      username,
      phone,
     email,
      password: hashedPassword,
      
    });
  }
   if(role==='admin'){
     account = new Admin({
      role,
     username,
     phone,
       email,
      password: hashedPassword,
      
    });
  }
    await account.save();

    res.status(201).json({ success: true, message: "Account Created successfully" });
  } catch (err) {
    console.error("Signup error:", err); // log exact cause
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};


//login
export const login = async (req, res) => {
  try {
    const { role, email, password } = req.body;
        const Admin = await getAdminModel();
    const User = await getUserModel();

    let user;

    if (role === 'user') {
      user = await User.findOne({ email });
    }
    if (role === 'admin') {
      user = await Admin.findOne({ email });
    }

    if (!user) {
      return res.status(403).json({ message: 'User does not exist', success: false });
    }

    const pass = await bcrypt.compare(password, user.password);
    if (!pass) {
      return res.status(403).json({ message: 'Incorrect Password', success: false });
    }

   
    const jwtToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        role: user.role,
        username: user.username
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    
    res.status(200).json({
      message: 'Login Successful !!',
      success: true,
      jwtToken,
      email: user.email,
      role: user.role,
      username: user.username
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: 'Login Failed, Please Try Again!!' });
  }
};
//Nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

//ForgotPassword
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
          const Admin = await getAdminModel();
    const User = await getUserModel();

        const user = (await User.findOne({ email })) || (await Admin.findOne({ email }));
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const otp = crypto.randomBytes(3).toString('hex').toUpperCase();
        user.resetPasswordToken = otp;
        user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
        await user.save();

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'OTP sent to your email.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
};

//verify otp
export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
    const Admin = await getAdminModel();
    const User = await getUserModel();

        const user = await User.findOne({ 
            email, 
            resetPasswordToken: otp,
            resetPasswordExpire: { $gt: Date.now() }
        }) || await Admin.findOne({ 
            email, 
            resetPasswordToken: otp,
            resetPasswordExpire: { $gt: Date.now() }
        });;

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired OTP.' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, 
          { expiresIn: '10m' });

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
};

//Reset Password
export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const Admin = await getAdminModel();
    const User = await getUserModel();

        const user = (await User.findById(decoded.id)) || (await Admin.findById(decoded.id));

        if (!user) {
            return res.status(404).json({ error: 'User not found or token is invalid.' });
        }
        if(newPassword.length<8){
          return res.status(400).json({message:'Atleast 8 character'});
        }
       const hashed=await bcrypt.hash(newPassword,10);
        user.password = hashed;
        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Invalid or expired token.' });
    }
};



//login with Google
export const googleCallback = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect(`${process.env.cors_origin}/login?error=AccountNotFound`);
    }
    const Admin = await getAdminModel();
    const User = await getUserModel();

    // Check if this email exists in Admin DB
    let account = await Admin.findOne({ email: req.user.email });
    let role = "admin";

    if (!account) {
      // If not admin, check User DB
      account = await User.findOne({ email: req.user.email });
      role = "user";
    }

    if (!account) {
      // If email is not in either DB → reject
      return res.redirect(`${process.env.cors_origin}/login?error=NoAccount`);
    }
console.log("Google account found:", account);
    //  Create JWT with the DB account info
const token = jwt.sign(
  {
    _id: account._id,
    email: account.email,
    role: role,
    username: account.username || account.name || "Unknown"
  },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

    //  Redirect frontend with token + role
    res.redirect(`${process.env.cors_origin}/login?token=${token}&role=${role}`);
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


