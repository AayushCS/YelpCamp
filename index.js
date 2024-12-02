if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const helmet = require("helmet");
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
const monogoSanitize = require("express-mongo-sanitize");
const dbUrl = process.env.DB_URL;
const MongoStore = require("connect-mongo");
const sessionSecret = process.env.SESSION_SECRET;

const sessionConfig = {
  name: "sid",
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
  store: MongoStore.create({
    mongoUrl: dbUrl,
    secret: sessionSecret,
    touchAfter: 24 * 60 * 60,
  }),
};

sessionConfig.store.on("error", function (e) {
  console.log();
});

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
app.use(monogoSanitize());
app.use(helmet());

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com",
  "https://api.tiles.mapbox.com",
  "https://api.mapbox.com",
  "https://kit.fontawesome.com",
  "https://cdnjs.cloudflare.com",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com",
  "https://stackpath.bootstrapcdn.com",
  "https://api.mapbox.com",
  "https://api.tiles.mapbox.com",
  "https://fonts.googleapis.com",
  "https://use.fontawesome.com",
  "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
  "https://api.mapbox.com",
  "https://*.tiles.mapbox.com",
  "https://events.mapbox.com",
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      childSrc: ["blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/duza28dny/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        "https://images.unsplash.com",
        "https://dec.ny.gov",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// mongodb://localhost:27017/yelp-camp

mongoose
  .connect(dbUrl)
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
  res.render("home");
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
