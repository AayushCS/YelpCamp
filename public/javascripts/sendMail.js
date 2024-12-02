const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: "yelpcampofficial@gmail.com",
    pass: process.env.MAIL_APP_PASS ,
  },
});

async function sendMail(to, subject, text, html) {
  const info = await transporter.sendMail({
    from: "yelpcampofficial@gmail.com",
    to,
    subject,
    text,
    html,
  });
}

module.exports = { sendMail };
