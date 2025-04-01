import { createNewPoductDB, getAllPoductsDB, updateProductDB } from "../models/products/ProductModel.js";

export const createProduct = async (req, res, next) => {
  try {
    const newProduct = req.body;
    const product = await createNewPoductDB(newProduct);

    if (product?._id) {
      return res.json({
        status: "success",
        message: "Product successfully created",
        newProduct: product,
      });
    }
  } catch (error) {
    return res.json({
      status: "error",
      message: "Error while adding the Product",
      errorMessage: error.message,
    });
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await getAllPoductsDB();

    if (products) {
      return res.json({
        status: "success",
        message: "All products fetched",
        products
      });
    }
  } catch (error) {
    return res.json({
      status: "error",
      message: "Error while getting the products",
      errorMessage: error.message,
    });
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    
    const updatedProduct = await updateProductDB(req.params.id,req.body);

    if (updatedProduct?._id) {
      return res.json({
        status: "success",
        message: "Product updated successfully",
        updatedProduct,
      });
    }
  } catch (error) {
    return res.json({
      status: "error",
      message: "Error while updating the product",
      errorMessage: error.message,
    });
  }
};

