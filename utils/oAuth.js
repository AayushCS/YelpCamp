const GoogleUser = require("../models/user");

exports.authUser = async (req, accessToken, refreshToken, profile, done) => {
  try {
    if (!req.user) {
      const googleUser = await GoogleUser.findOne({ googleID: profile.id });
      if (googleUser) {
        return done(null, googleUser);
      }
      const newGoogleUser = new GoogleUser({
        googleID: profile.id,
        google_token: accessToken,
        email: profile.email,
        username: profile.email.split("@")[0],
      });
      await newGoogleUser.save();
      return done(null, newGoogleUser);
    } else {
      return done(null, false, req.flash("error", "You are already logged in"));
    }
  } catch (e) {
    req.flash("error", e.message);
    return done(e, null);
  }
};
