const express = require("express");
const dbConfig = require("./config/db.config");
const bcrypt = require("bcrypt");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const app = express();
const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/post.routes");
const { checkForAuthentication } = require("./middleware/auth.middleware");
dbConfig();
const User = require("./models/user.model");
const sendEmail = require("./config/nodemailer");

app.use(cookieParser());

let verifyOtp = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/posts", checkForAuthentication, postRoutes);

app.get("/", (req, res) => {
  res.send("home route");
});

app.post("/sendOtp", async (req, res) => {
  const { email } = req.body;
  console.log(email);

  const otp = Math.floor(100000 + Math.random() * 999999);

  verifyOtp.push(otp);
  const message = `Your verification code is ${otp}`;
  const subject = "email verification";

  await sendEmail(email, subject, message);
  res.send("Otp sent Successfully");
});

app.post("/resetPassword", async (req, res) => {
  const { otp, email, newPassword } = req.body;

  if (!otp) {
    return res.send("please enter otp ");
  }
  console.log(verifyOtp);

  if (otp != verifyOtp[verifyOtp.length - 1]) {
    return res.send("invalid otp");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  const user = await User.findOne({ email });

  if (!user) {
    return res.send("user not found");
  }

  user.password = hashedPassword;

  await user.save();

  res.send("password reset");
});

//protected
app.get("/protected", checkForAuthentication, (req, res) => {
  res.send("you are on protected route");
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
