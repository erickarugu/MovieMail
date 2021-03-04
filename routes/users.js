const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { sendMail } = require("../services/mail");

// @desc      Process add form
// @route     GET /stories
router.post("/subscribe", async (req, res) => {
  let verification_code = (Math.floor(Math.random() * 99999) + 10000).toString();
  await User.create({
    ...req.body,
    verification_code,
  })
    .then(async (user) => {
      await sendMail(user.email, verification_code)
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
      message = "Email not found!"
      if(response !== null) message = "Unsubscribed successfully!"
      return res.render("dashboard", {
        message
      });
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
          .then((e) => {
            return res.render("success");
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
router.get("/dashboard", async (req, res) => {
  return res.render("dashboard");
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
