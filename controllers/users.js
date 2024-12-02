const User = require("../models/user");
const { sendMail } = require("../public/javascripts/sendMail");

const renderRegister = (req, res) => {
  res.render("users/register");
};

const register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const emailText = `
      <h3>Hi ${username},</h3> 
      
      <p>Congratulations! You’ve successfully registered at YelpCamp – the ultimate community for discovering and sharing the best campgrounds around.</p>

      <p>We’re thrilled to have you on board! Whether you're an experienced camper or just getting started, YelpCamp is here to help you find the perfect spot to pitch your tent, enjoy nature, and make unforgettable memories.</p>

      <p>We can’t wait for you to start your journey with us. If you have any questions or need help, feel free to reach out to our support team. We're always happy to assist.</p> <br>
      
      <p>Happy Camping,</p>
      <p>Aayush - YelpCamp Admin </p>
      <a href="https://github.com/aayushcs" target="_blank">Visit my GitHub Profile</a>
      `;
    const text = "";
    const subject = "Welcome to YelpCamp!";
    const registeredUser = await User.register(user, password);
    await sendMail(email, subject, text, emailText);
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
