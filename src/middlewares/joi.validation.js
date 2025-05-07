import Joi from "joi";

const joiValidator = async (schema, req, res, next) => {
  // validating the given schema
  const { error } = schema.validate(req.body);
  error
    ? next({
      statusCode: 400,
      message: error.message,
    })
    : next();
};

// creating user validator
export const createUserValidator = async (req, res, next) => {
  const registerSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    fName: Joi.string().required(),
    lName: Joi.string().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().required(),
    phone: Joi.number().required(),
  });
  joiValidator(registerSchema, req, res, next);
};

// signing user validator

export const singinUserValidator = async (req, res, next) => {
  const signinSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().required(),
  });
  joiValidator(signinSchema, req, res, next);
};

// updating user validator
export const updateUserValidator = async (req, res, next) => {
  const updateUserSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    fName: Joi.string().required(),
    lName: Joi.string().required(),
    password: Joi.string().required(),
    phone: Joi.number().required(),
  });
  joiValidator(updateUserSchema, req, res, next);
};

// creating product validator
export const createProductValidator = async (req, res, next) => {

  console.log(5555555555555,req.body)
  const addProductSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    stock: Joi.number().required(),
    category: Joi.string().required(),
    images: Joi.array().max(4),
    status:Joi.string().valid("active", "inactive")
    // ratings: Joi.number().required(),
  });
  joiValidator(addProductSchema, req, res, next);
};

// updating product validator
export const updateProductValidator = async (req, res, next) => {
  const updateProductSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    stock: Joi.number().required(),
    category: Joi.string().required(),
    images: Joi.string().required(),
  });
  joiValidator(updateProductSchema, req, res, next);
};

// creating review validator
export const createReviewValidator = async (req, res, next) => {
  const createReviewSchema = Joi.object({
    productId: Joi.string().required(),
    userId: Joi.string().required(),
    rating: Joi.number().required(),
    comment: Joi.string().required(),
  });

  joiValidator(createReviewSchema, req, res, next);
};

// create order validatior
export const createOrderValidator = async (req, res, next) => {
  const createOrderSchema = Joi.object({
    products: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string().hex().length(24).required(),
          quantity: Joi.number().min(1).required(),
        })
      )
      .min(1)
      .required(),
    totalAmount: Joi.number().min(1).required(),
  });

  joiValidator(createOrderSchema, req, res, next);
};

//update order by admin

export const updateOrderValidator = async (req, res, next) => {
  const updateOrderSchema = Joi.object({
    status: Joi.string().valid("pending", "shipped", "delivered").required(),
  });

  joiValidator(updateOrderSchema, req, res, next);
};
