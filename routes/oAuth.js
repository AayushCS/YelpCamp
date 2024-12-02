const express = require("express");
const catchAsync = require("../utils/catchAsync");
const router = express.Router();
const {
  loadGoogleLogin,
  googleRegisterOrLogin,
} = require("../controllers/oAuth");
const passport = require("passport");
const { storeReturnto } = require("../middleware");

router.get("/google", loadGoogleLogin);

router.get(
  "/google/callback",
  storeReturnto,
  passport.authenticate("google", {
    failureRedirect: "/campgrounds",
    failureFlash: true,
    successFlash: true,
  }),
  catchAsync(googleRegisterOrLogin)
);

module.exports = router;