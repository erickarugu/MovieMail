
require("dotenv").config();
const nodemailer = require("nodemailer");
const { APP_EMAIL, APP_EMAILPWD } = process.env;

module.exports = {
  sendMovie: async (emailTo, movie) => {
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
      return ` <h2><b>Here is today's movie pick, We hope you will love it.</b></h2>
      <br>
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="Movie Official Poster">
      <h3>${movie.title}</h3>
      <p>${movie.overview}</p>
      <p><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-half"></i> (${movie.vote_average})</p>
      
      `;
    };

    const emailMsg = messageHandler(movie);
    const mailOptions = {
      from: `${APP_EMAIL}`,
      to: emailTo,
      subject: "Movie Mailer - Today's Movie Pick",
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
