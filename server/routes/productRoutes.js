import express from "express";
import {
  createProduct,
  getProducts,
  getSingleProduct,
  productPhoto,
  updateProduct,
} from "../controllers/productController.js";
import formidable from "express-formidable";
import { addProductValidation } from "../validation/product/productsValidation.js";
const router = express.Router();

// CREATE PRODUCT ROUTE
router.post(
  "/create-product",
  formidable(),
  addProductValidation,
  createProduct
);

// GET PRODUCT ROUTE
router.get("/get-product", getProducts);
export default router;

// GET PRODUCT BY SLUG ROUTE
router.get("/get-product/:slug", getSingleProduct);

// GET PRODUCT PHOTO
router.get("/product-photo/:pid", productPhoto);

// UPDATE PRODUCT
router.put("/update-product/:pid", formidable(), updateProduct);
