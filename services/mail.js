require("dotenv").config();
const nodemailer = require("nodemailer");
const { APP_EMAIL, APP_EMAILPWD } = process.env;

module.exports = {
  sendMail: async (emailTo, code) => {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: `${APP_EMAIL}`,
        pass: `${APP_EMAILPWD}`,
      },
    });
    const messageHandler = (code) => {
      return ` <b>Click the link below to reset your Device Zone's password</b>
      <br>
      <p>${code}</P>`;
    };

    const emailMsg = messageHandler(code);
    const mailOptions = {
      from: `${APP_EMAIL}`,
      to: emailTo,
      subject: "Movie Mailer - Email Confirmation",
      html: `${emailMsg}`,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return false;
      }
      return true;
    });
  },
};
