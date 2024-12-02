const GoogleUser = require("../models/user");
const { sendMail } = require("../public/javascripts/sendMail");

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
      const emailText = `
     <div style="width:100%;height:auto;">
    <img src="https://media.giphy.com/media/Ae7SI3LoPYj8Q/giphy.gif" alt="Welcome GIF" style="max-width: 100%; height: 200px;" />
    </div>
      <h3>Hi ${newGoogleUser.username},</h3> 
      
      <p>Congratulations! You’ve successfully registered at YelpCamp – the ultimate community for discovering and sharing the best campgrounds around.</p>

      <p>We’re thrilled to have you on board! Whether you're an experienced camper or just getting started, YelpCamp is here to help you find the perfect spot to pitch your tent, enjoy nature, and make unforgettable memories.</p>

      <p>We can’t wait for you to start your journey with us. If you have any questions or need help, feel free to reach out to our support team. We're always happy to assist.</p> <br>
      
      <p>Happy Camping,</p>
      <p>Aayush - YelpCamp Admin </p>
      <a href="https://github.com/aayushcs" target="_blank">Visit my GitHub Profile</a>
      `;
      const text = "";
      const subject = "Welcome to YelpCamp!";
      await sendMail(newGoogleUser.email, subject, text, emailText);
      return done(null, newGoogleUser);
    } else {
      return done(null, false, req.flash("error", "You are already logged in"));
    }
  } catch (e) {
    req.flash("error", e.message);
    return done(e, null);
  }
};
