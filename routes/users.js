const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const { storeReturnto } = require("../middleware");
const {
  renderRegister,
  register,
  login,
  logout,
  renderlogin,
} = require("../controllers/users");

router.route("/register").get(renderRegister).post(catchAsync(register));

router
  .route("/login")
  .get(renderlogin)
  .post(
    storeReturnto,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    login
  );

router.get("/logout", logout);

module.exports = router;
