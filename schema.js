const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string()
      .required()
      .max(50)
      .messages({
        "string.empty": "Title is required.",
        "string.max": "Title must not exceed 50 characters.",
      }),
    description: Joi.string()
      .required()
      .max(200)
      .messages({
        "string.empty": "Description is required.",
        "string.max": "Description must not exceed 200 characters.",
      }),
    image: Joi.string()
      .uri()
      .allow("", null)
      .messages({
        "string.uri": "Image must be a valid URL.",
      }), // Allows valid URLs, empty strings, or null
    price: Joi.number()
      .required()
      .min(0)
      .messages({
        "number.base": "Price must be a number.",
        "number.min": "Price must be a positive value.",
        "any.required": "Price is required.",
      }),
    country: Joi.string()
      .required()
      .max(50)
      .messages({
        "string.empty": "Country is required.",
        "string.max": "Country must not exceed 50 characters.",
      }),
    location: Joi.string()
      .required()
      .max(50)
      .messages({
        "string.empty": "Location is required.",
        "string.max": "Location must not exceed 50 characters.",
      }),
  }).required(),
});
