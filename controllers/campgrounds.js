const { render } = require("ejs");
const Campground = require("../models/campgrounds");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding-v6");
const mapboxtoken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxtoken });

const index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

const renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

const createCampground = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  const newCamp = new Campground(req.body.campground);
  newCamp.geometry = geoData.body.features[0].geometry;
  newCamp.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  newCamp.author = req.user._id;
  await newCamp.save();
  req.flash("success", "successfully made a new campground!");
  res.redirect(`/campgrounds/${newCamp._id}`);
};

const showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (campground) {
    res.render("campgrounds/show", { campground });
  } else {
    req.flash("error", "Cannot find that campground");
    res.redirect("/campgrounds");
  }
};

const renderEditForm = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash("error", "Cannot find that campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

const editCampground = async (req, res) => {
  const { id } = req.params;
  const camp = await Campground.findByIdAndUpdate(id, req.body.campground);
  camp.images.push(
    ...req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }))
  );
  await camp.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await camp.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${camp._id}`);
};

const deleteCampground = async (req, res) => {
  const { id } = req.params;
  const camp = await Campground.findByIdAndDelete(id, req.body.campground);
  req.flash("success", "Successfully updated campground!");
  res.redirect("/campgrounds");
};

module.exports = {
  index,
  renderNewForm,
  createCampground,
  showCampground,
  renderEditForm,
  editCampground,
  deleteCampground,
};
