import {
  createNewPoductDB,
  deleteProductDB,
  getAllPoductsDB,
  updateProductDB,
} from "../models/products/ProductModel.js";

export const createProduct = async (req, res, next) => {
  try {
    const product = await createNewPoductDB(req.body);

    if (product?._id) {
      return res.status(201).json({
        status: "success",
        message: "Product successfully created",
        newProduct: product,
      });
    }
  } catch (error) {
    next({
      statusCode: 500,
      message: "Error while adding the Product",
      errorMessage: error.message,
    });
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await getAllPoductsDB();

    if (products) {
      return res.status(200).json({
        status: "success",
        message: "All products fetched",
        products,
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

export const updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await updateProductDB(req.params.id, req.body);

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
    const deletedProduct = await deleteProductDB(req.params.id, req.body);

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
