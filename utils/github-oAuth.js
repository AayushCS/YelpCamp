const GithubUser = require("../models/user");

exports.authuser = async (req, accessToken, refreshToken, profile, done) => {
  try {
    if (!req.user) {
      const githubUser = await GithubUser.findOne({ githubID: profile.id });
      let existingUser = await GithubUser.findOne({
        email: profile.emails[0].value,
      });
      if (githubUser) {
        return done(null, githubUser);
      }
      if (existingUser) {
        existingUser = await GithubUser.findOneAndUpdate(
          {
            email: profile.emails[0].value,
          },
          { githubID: profile.id, github_token: accessToken },
          {
            new: true,
          }
        );
        return done(null, existingUser);
      }

      const newGithubUser = new GithubUser({
        githubID: profile.id,
        github_token: accessToken,
        username: profile.username,
        email: profile.emails[0].value,
      });
      await newGithubUser.save();
      return done(null, newGithubUser);
    } else {
      return done(null, false, req.flash("error", "You are already logged in"));
    }
  } catch (e) {
    req.flash("error", e.message);
    return done(e, null);
  }
};
