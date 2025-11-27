import { getUserModel } from "../models/User.js"
export const fetchProfile=async(req,res)=>{
      try {
           const userId = req.user._id;
        
          const User = await getUserModel();
let user = await User.findById(userId).select('-password -resetPasswordToken -resetPasswordExpire');
          
         if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      address: user.address || '',
      role: user.role,
      googleId: user.googleId
    });
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({ msg: 'Server error while fetching profile' });
  }
}

export const updateProfile=async(req,res)=>{
  try{
  const User=await getUserModel();
  if (!User ) {
      return res.status(500).json({ msg: 'Models not initialized' });
    }
    
    const { username, email, phone, address } = req.body;
    const userId = req.user._id;
    const userRole = req.user.role;

    let user;
    
      user = await User.findById(userId);
    
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (username) user.username = username;
    if (email) {
      const existingInUser = await User.findOne({ email, _id: { $ne: userId } });
      
      if (existingInUser) {
        return res.status(400).json({ msg: 'Email already in use' });
      }
      user.email = email;
    }
    if (address !== undefined) user.address = address;
    if (phone) {
      const existingInUser = await User.findOne({ phone, _id: { $ne: userId } });
     
      if (existingInUser) {
        return res.status(400).json({ msg: 'Phone number already in use' });
      }
      user.phone = phone;
    }

    await user.save();

    res.json({
      msg: 'Profile updated successfully',
      user: {
       // id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        address: user.address,
       // role: user.role
      }
    });
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ msg: 'Server error while updating profile' });
  }
}

export const fetchByEmail=async(req,res)=>{
  const {email}=req.query;
  try{
        const User=await getUserModel();
        const user=await User.findOne({email})
        if(!user)
        {
          return res.status(400).json({message: "User Not Found"})
        }
        res.status(200).json(user)
  }catch(err){
    return res.status(500).json({message: "falied"})
  }
}