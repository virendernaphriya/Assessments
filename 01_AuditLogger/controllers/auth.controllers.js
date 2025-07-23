const User=require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleUserRegistration = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        console.log("req.body",req.body);
        console.log(req.file)
        const profilePicture = req.file ? req.file.path : null; 
        console.log("profile",profilePicture);

        
        const existingUser = await User.find({ $or: [{ username }, { email }] });
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        const salt=await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ name, username, email, password: hashedPassword, profilePicture });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'User registration failed', error: error.message });
    }
}


const handleUserLogin=async(req,res)=>{
    try{
        const {username,password}=req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        const payload = {
            userId: user._id,
            username: user.username
        };
        const token= jwt.sign(payload, process.env.JWT_SECRET,);
        res.cookie('token',token);
        res.status(200).json({ message: 'User logged in successfully', token, user: { id: user._id, username: user.username } });
    } catch (error) {
        res.status(500).json({ message: 'User login failed', error: error.message });
    }
}


const handleUserLogout = (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'User logout failed', error: error.message });
    }
}

const handleSentOtptoEmail=async(req,res)=>{
    const { email } = req.body;
  console.log(email);

  const otp = Math.floor(100000+Math.random() * 999999);

  verifyOtp.push(otp);
  const message = `Your verification code is ${otp}`;
  const subject = "email verification";

  await sendEmail(email, subject, message);
  res.send("Otp sent Successfully");
}

module.exports = {
    handleUserRegistration,
    handleUserLogin,
    handleUserLogout
};