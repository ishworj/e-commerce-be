import {
  createNewPoductDB,
  deleteProductDB,
  getActivePoductsDB,
  getSingleProduct,
  updateProductDB,
} from "../models/products/product.model.js";
import Product from "../models/products/product.schema.js";
import { getPaginatedData, getPaginatedDataFilter } from "../utils/Pagination.js";

export const createProduct = async (req, res, next) => {
  try {
    const imageUrls = req.files.map((file) => file.path); // Cloudinary URLs
    req.body.images = imageUrls;
    console.log(imageUrls, "image urls")
    console.log(req.body, "object sending to create product")

    const product = await createNewPoductDB(req.body);

    if (product?._id) {
      return res.status(201).json({
        status: "success",
        message: "Product successfully created",
        newProduct: product,
      });
    }
  } catch (error) {
    console.log(error.message)
    next({
      statusCode: 500,
      message: "Error while adding the Product",
      errorMessage: error.message,
    });
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    // const products = await getAllPoductsDB();
    const products = await getPaginatedData(Product, req)

    if (products) {
      return res.status(200).json({
        status: "success",
        message: "All products fetched",
        products,
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "No Products Listed!",
      });
    }
  } catch (error) {
    next({
      statusCode: 500,
      message: "Error while getting the Products",
      errorMessage: error.message,
    });
  }
};

export const getPublicProducts = async (req, res, next) => {
  try {
    // const products = await getActivePoductsDB();
    const products = await getPaginatedDataFilter(Product, req, { status: "active" })

    if (products) {
      return res.status(200).json({
        status: "success",
        message: "All products fetched",
        products,
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "No Products Listed!",
      });
    }
  } catch (error) {
    next({
      statusCode: 500,
      message: "Error while getting the Products",
      errorMessage: error.message,
    });
  }
};
// getting the product using id
export const getProductById = async (req, res, next) => {
  try {
    const product = await getSingleProduct(req.params.id);
    console.log(product, 909);
    return res.status(200).json({
      status: "success",
      message: "Fetched Product",
      product,
    });
  } catch (error) {
    next({
      statusCode: 500,
      message: "Error while getting the Products",
      errorMessage: error.message,
    });
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    let { oldImages, ...rest } = req.body;

    oldImages = JSON.parse(oldImages || "[]");
    const newImages = req.files.map((file) => file.path);
    const allImages = [...oldImages, ...newImages];

    const updateObj = { ...rest, images: allImages };

    const updatedProduct = await updateProductDB(req.params.id, updateObj);

    if (updatedProduct?._id) {
      return res.json({
        status: "success",
        message: "Product updated successfully",
        updatedProduct,
      });
    } else {
      next({
        statusCode: 404,
        message: "Product not found",
      });
    }
  } catch (error) {
    next({
      statusCode: 500,
      message: "Error while updating the Product",
      errorMessage: error.message,
    });
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const deletedProduct = await deleteProductDB(req.params.id);

    if (deletedProduct?._id) {
      return res.json({
        status: "success",
        message: "Product deleted successfully",
        deletedProduct,
      });
    } else {
      next({
        statusCode: 404,
        message: "Product not found",
      });
    }
  } catch (error) {
    next({
      statusCode: 500,
      message: "Error while deleting the Product",
      errorMessage: error.message,
    });
  }
};
