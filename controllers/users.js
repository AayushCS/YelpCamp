const User = require("../models/user");

const renderRegister = (req, res) => {
  res.render("users/register");
};

const register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to YelpCamp");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

const renderlogin = (req, res) => {
  res.render("users/login");
};

const login = (req, res) => {
  req.flash("success", "welcome back!");
  const redirectUrl = res.locals.returnTo || "campgrounds";
  console.log(redirectUrl);
  res.redirect(`${redirectUrl}`);
};

const logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    return res.redirect("/campgrounds");
  });
};

module.exports = { login, logout, register, renderRegister, renderlogin };