const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError.js");
const { campgroundSchema } = require("../schemas.js");
const Campground = require("../models/campgrounds.js");
const {
  isLoggedIn,
  validateCampground,
  isAuthor,
} = require("../middleware.js");
const {
  index,
  renderNewForm,
  createCampground,
  showCampground,
  renderEditForm,
  editCampground,
  deleteCampground,
} = require("../controllers/campgrounds.js");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(index))
  .post(
    isLoggedIn,
    upload.array("campground[image]"),
    validateCampground,
    catchAsync(createCampground)
  );

router.get("/new", isLoggedIn, renderNewForm);

router
  .route("/:id")
  .get(catchAsync(showCampground))
  .delete(isLoggedIn, isAuthor, catchAsync(deleteCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("campground[images]"),
    validateCampground,
    catchAsync(editCampground)
  );

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(renderEditForm));

module.exports = router;
