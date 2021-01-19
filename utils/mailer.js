const transporter = require('./transporter');
const path = require('path');
const handlebars = require('handlebars');
const file = require('./file');
require('dotenv').config();

module.exports = {
  sendMail: async ({ mailsTo, subject, fileTemplate, replacements }) => {
    let htmlPath = path.join(__dirname + '/../templates' + fileTemplate);
    let html = file.readFile(htmlPath);
    let template = handlebars.compile(html);
    let htmlToSend = template(replacements);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: mailsTo, //"bar@example.com, baz@example.com",
      subject,
      html: htmlToSend
    }, (err, info) => {
      if (err) {
        console.log('Email-error: ', err);
      } else {
        console.log('Email-info: ', info);
      }
    });
    // https://accounts.google.com/b/0/displayunlockcaptcha
    // https://myaccount.google.com/lesssecureapps : bật truy cập kém an toàn
  }
}