import ProductSchema from "./ProductSchema.js";
export const createNewPoductDB = (newProductObj) => {
  return ProductSchema(newProductObj).save();
};

export const getAllPoductsDB = () => {
  return ProductSchema.find({});
};

export const getActivePoductsDB = () => {
  return ProductSchema.find({ status: "active" })
}
export const updateProductDB = (id, updateObj) => {
  return ProductSchema.findByIdAndUpdate(id, updateObj, { new: true });
};

export const deleteProductDB = (id) => {
  return ProductSchema.findByIdAndDelete(id);
};