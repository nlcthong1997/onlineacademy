const nodemailer = require("nodemailer");
const path = require('path');
const handlebars = require('handlebars');
require('dotenv').config();

const file = require('./file');

module.exports = {
  sendMail: async ({ mailsTo, subject, fileTemplateEmail, data }) => {
    console.log('fileTemplateEmail', fileTemplateEmail);
    const transporter = await nodemailer.createTransport({
      // host: process.env.EMAIL_HOST,
      // port: process.env.EMAIL_PORT || 465,
      // secure: true, // true for 465, false for other ports
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
    });

    let htmlPath = path.join(__dirname + '/../' + fileTemplateEmail);
    console.log('htmlPath', htmlPath);
    let html = file.readFile(htmlPath);
    console.log('html', html);
    let template = handlebars.compile(html);

    let replacements = {
      link: 'http://localhost:3030/api/user/active-account/fsfsdfsdfsdfsd'
    };
    let htmlToSend = template(replacements);
    console.log('htmlToSend', htmlToSend);
    console.log('mailsTo', mailsTo);
    // https://myaccount.google.com/lesssecureapps : bat truy cap kem an toan
    await transporter.sendMail({
      from: process.env.EMAIL_USER, // sender address
      to: mailsTo, //"bar@example.com, baz@example.com", // list of receivers
      subject,
      html: htmlToSend
    }, (info, err) => {
      console.log('info', info);
      console.log('err', err);
    });
  }
}