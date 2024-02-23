import joi from "joi";

// SCHEMA FOR CREATING NEW PRODUCT
export const productValid = joi
  .object({
    name: joi.string().required().error(new Error("Please enter a Name")),
    slug: joi.string().lowercase().error(new Error("Invalid slug")),
    description: joi
      .string()
      .required()
      .error(new Error("Please enter a Description")),
    price: joi
      .number()
      .min(0)
      .required()
      .error(new Error("Please enter a Price")),
    quantity: joi
      .number()
      .integer()
      .min(0)
      .required()
      .error(new Error("Please enter a Quantity")),
    photo: joi
      .object({
        data: joi.binary(),
        contentType: joi.string(),
      })
      .error(new Error("Invalid photo format"))
      .required(),
    shipping: joi.boolean(),
    rating: joi.number().default(4), // Default rating is set to 4 if not provided
  })
  .options({ abortEarly: false });
