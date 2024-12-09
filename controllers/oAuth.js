const passport = require("passport");

const loadGoogleLogin = async (req, res, next) => {
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })(req, res, next);
};

const googleRegisterOrLogin = async (req, res, next) => {
  req.flash("success", "welcome back google user");
  const redirectURL = res.locals.returnTo || "/campgrounds";
  res.redirect(redirectURL);
};

module.exports = { loadGoogleLogin, googleRegisterOrLogin };
