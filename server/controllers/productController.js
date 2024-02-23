import productModel from "../models/productModel.js";
import slugify from "slugify";
import fs from "fs";

// CREATE PRODUCT CONTROLLER
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, quantity, shipping, rating } = req.fields;
    const { photo } = req.files;
    const product = new productModel({
      ...req.fields,
      slug: slugify(name),
    });
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating product",
      error,
    });
  }
};

// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const product = await productModel.find({}).select("-photo").limit(12);
    res.status(200).send({
      success: true,
      message: "All products get successfully",
      product,
    });
    console.log(product);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting products",
      error,
    });
  }
};

// GET PRODUCT BY SLUG   .findOne(<query>||{ slug: 'dsfdgfdg' })
export const getSingleProduct = async (req, res) => {
  try {
    // console.log(req.params.slug);
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting single products",
      error,
    });
  }
};

// GET PRODUCT PHOTO
export const productPhoto = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting product photo",
      error,
    });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    console.log(req.params.pid);
    const { name, description, price, quantity, shipping, rating } = req.fields;
    const { photo } = req.files;
    const product = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating product",
      error,
    });
  }
};
