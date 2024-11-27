if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}


const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const campgroundRoutes = require("./routes/campgrounds.js");
const reviewRoutes = require("./routes/reviews.js");
const userRoutes = require("./routes/users.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const User = require("./models/user.js");

const sessionConfig = {
  secret: "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

const app = express();
const port = 3000;
const path = require("path");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(flash());
app.use(session(sessionConfig));
app.use(passport.session());
app.use(passport.initialize());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

mongoose
  .connect("mongodb://localhost:27017/yelp-camp")
  .then(() => console.log("Db connected"))
  .catch((err) => console.log(err));

app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.campSuccessMsg = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", userRoutes);

app.use("/campgrounds", campgroundRoutes);

app.use("/campgrounds/:id/reviews", reviewRoutes);

app.get("/", function (req, res) {
  res.send("Hello from yelp camp");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "something went wrong" } = err;
  if (!err.message) err.message = "oh no! something went wrong !";
  res.status(statusCode).render("error", { err });
});

app.listen(port, () => {
  console.log(`server on port ${port}`);
});
