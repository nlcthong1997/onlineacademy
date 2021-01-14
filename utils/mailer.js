const nodemailer = require("nodemailer");
require('dotenv').config();

module.exports = {
  sendMail: async ({ mailsTo, subject, text, html }) => {
    const transporter = await nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER, // sender address
      to: mailsTo, //"bar@example.com, baz@example.com", // list of receivers
      subject,//: "Hello ✔", // Subject line
      text,//: "Hello world?", // plain text body
      html,//: "<b>Hello world?</b>", // html body
    });
  }
}