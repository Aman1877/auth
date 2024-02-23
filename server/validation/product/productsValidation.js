// productsValidation.js
import { productValid } from "./productsSchema.js";

// CREATING A NEW PRODUCT 
export const addProductValidation = async (req, res, next) => {
  try {
    // Validate the request data using product schema
    const { error, value } = await productValid.validate(
      {
        ...req.fields,
        photo:
          req.files && req.files.photo
            ? {
                data: req.files.photo.data,
                contentType: req.files.photo.mimetype,
              }
            : undefined,
      },
      { abortEarly: false }
    );
    if (error) {
      console.error("Validation error:", error.message);
      return res.status(400).json({
        success: 0,
        message: "Validation error",
        errors: [error.message],
      });
    }
    // If validation passes, proceed to the next middleware
    next();
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      success: 0,
      message: "Internal server error",
      error: error.message,
    });
  }
};
