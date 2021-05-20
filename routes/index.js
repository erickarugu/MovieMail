const express = require('express');
const router = express.Router();

// @desc      Login/Landing page
// @route     GET /
router.get("/", (req, res) => {
  res.render("register",{
    layout: "main"
  });
});

// @desc      Dashboard
// @route     GET /dashboard
router.get("/dashboard", async (req, res) => {
  try {
    res.render("dashboard");
  } catch (error) {
    res.render("error/500");
  }
});

module.exports = router;
