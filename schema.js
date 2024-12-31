const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().allow("", null), // Allows empty or null values for images
    price: Joi.number().required().min(0),
    country: Joi.string().required(),
    location: Joi.string().required(),
  }).required(),
});
