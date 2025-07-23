const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, message) => {
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  transport.sendMail(
    {
      from: "hey from novem",
      to: email,
      subject,
      text: message,
    },
    (err, info) => {
      if (err) console.log(err);
      else {
        console.log("info is", info);
      }
    }
  );
};

module.exports = sendEmail;
