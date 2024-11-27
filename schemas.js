const joi = require("joi");

module.exports.campgroundSchema = joi.object({
  campground: joi
    .object({
      title: joi.string().required(),
      price: joi.number().min(0).required(),
      // image: joi.string().required(),
      description: joi.string().required(),
      location: joi.string().required(),
    })
    .required(),
  deleteImages: joi.array(),
});

module.exports.reviewSchema = joi.object({
  review: joi
    .object({
      rating: joi.number().required(),
      body: joi.string().required(),
    })
    .required(),
});