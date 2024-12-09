const passport = require("passport");

const loadGithubLogin = async (req, res, next) => {
  passport.authenticate("github", {
    scope: ["user:email"],
  })(req, res, next);
};

const githubRegisterOrLogin = async (req, res, next) => {
  req.flash("success", "welcome back github user");
  const redirectURL = res.locals.returnTo || "/campgrounds";
  res.redirect(redirectURL);
};

module.exports = { loadGithubLogin, githubRegisterOrLogin };
