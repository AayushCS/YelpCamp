const Campground = require("../models/campgrounds.js");
const Review = require("../models/review.js");

const createReview = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await Promise.all([review.save(), campground.save()]);
  req.flash("success", "Created new review!");
  res.redirect(`/campgrounds/${campground._id}`);
};

const deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "successfully deleted review!");
  res.redirect(`/campgrounds/${id}`);
};

module.exports = { createReview, deleteReview };
