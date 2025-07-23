const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/SaaS");
    console.log("database connected");
  } catch (error) {
    console.log("error in connecting with db : ", error);
  }
};

module.exports = connectDb;
