import ProductSchema from "./ProductSchema.js";
export const createNewPoductDB = (newProductObj) => {
  return ProductSchema(newProductObj).save();
};

export const getAllPoductsDB = () => {
  return ProductSchema.find({});
};
export const updateProductDB = (id, updateObj) => {
  return ProductSchema.findByIdAndUpdate(id, updateObj);
};
