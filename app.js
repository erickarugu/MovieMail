const express = require("express");
const path = require("path");
const cron = require("node-cron");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const request = require("request");

const connectDB = require("./config/db");
const User = require("./models/User");
const Movie = require("./models/Movie");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const { sendMovie } = require("./services/sendMovie");
const nodemailer = require("nodemailer");

// load config
dotenv.config();
const { MOVIE_API_KEY } = process.env;
// connect to db
connectDB();

const app = express();

// logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Handle Bars
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

app.use(express.static(path.join(__dirname, "public")));

// The different routes
app.use("/", usersRouter);

// Schedule a cron job
cron.schedule("00 08 * * *", async (e) => {
  try {
    let users = await User.find({ is_verified: true });
    request(`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${MOVIE_API_KEY}&page=1`, async (error, response, body) => {
      if (!error && response.statusCode == 200) {
        let loop = true;
        let count = 0;
        let movie = null;
        while (loop === true && count <= 20) {
          movie = JSON.parse(body).results[Math.floor(Math.random() * JSON.parse(body).results.length) + 0];

          let movieExists = await Movie.findOne({ movie_id: movie.id });
          if (movieExists === null) loop = false;
        }

        await Movie.create({
          movie_id: movie.id,
          overview: movie.overview,
          popularity: movie.popularity,
          poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          title: movie.title,
          vote_average: movie.vote_average,
          vote_count: movie.vote_count,
        });
        users.forEach((user) => {
          sendMovie(user.email, movie);
        });
      }
    });
  } catch (error) {}
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`));
