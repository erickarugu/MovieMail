const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Movie = require("../models/Movie");
const { sendCode } = require("../services/sendCode");
const {sendMovie} = require("../services/sendMovie");

// @desc      Process add form
// @route     GET /stories
router.post("/subscribe", async (req, res) => {
  let verification_code = (Math.floor(Math.random() * 99999) + 10000).toString();
  console.log(req.body, verification_code)
  await User.create({
    ...req.body,
    verification_code,
  })
    .then(async (user) => {
      await sendCode(user.email, verification_code)
        .then((e) => {
          return res.render("verify", {
            email: user.email,
            name: user.name,
          });
        })
        .catch((err) => {
          return res.render("error/500");
        });
    })
    .catch((err) => {
      return res.render("error/500");
    });
});
// @desc      Process add form
// @route     GET /stories
router.post("/unsubscribe", async (req, res) => {
  await User.findOneAndDelete({
    email: req.body.email,
  })
    .then(async (response) => {
      return res.redirect("/dashboard");
    })
    .catch((err) => {
      return res.render("error/500");
    });
});
// @desc      Process add form
// @route     GET /stories
router.post("/verify", async (req, res) => {
  let email = req.body.email;
  let clientCode = req.body.n_one + req.body.n_two + req.body.n_three + req.body.n_four + req.body.n_five;
  await User.find({
    email,
  })
    .then(async (user) => {
      if (user[0].verification_code === clientCode) {
        await User.findOneAndUpdate(
          {
            email,
          },
          {
            verification_code: null,
            is_verified: true,
          }
        )
          .then(async (e) => {
            await Movie.find()
              .limit(1)
              .sort({ $natural: -1 })
              .then(async (movie) => {
                sendMovie(user[0].email, movie[0]);
                return res.render("success");
              });
          })
          .catch((err) => {
            return res.render("verify", {
              message: "operation was unsuccessful!",
            });
          });
      } else {
        return res.render("verify", {
          message: "code did not match!",
        });
      }
    })
    .catch((err) => {
      return res.render("error/500");
    });
});
// @desc      Process add form
// @route     GET /stories
router.get("/", async (req, res) => {
  return res.redirect("/dashboard")
})
// @desc      Process add form
// @route     GET /stories
router.get("/dashboard", async (req, res) => {
  await Movie.find()
    .limit(1)
    .sort({ $natural: -1 })
    .then((movie) => {
      return res.render("dashboard", {
        title: movie[0].title,
        poster: movie[0].poster_path,
        overview: movie[0].overview,
        vote_average: movie[0].vote_average,
      });
    });
});
// @desc      Process add form
// @route     GET /stories
router.get("/subscribe", async (req, res) => {
  return res.render("register");
});
// @desc      Process add form
// @route     GET /stories
router.get("/unsubscribe", async (req, res) => {
  return res.render("unsubscribe");
});

module.exports = router;
