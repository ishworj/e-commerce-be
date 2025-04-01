import Joi from "joi";

const joiValidator = async (schema, req, res, next) => {
    // validating the given schema
    const { error } = schema.validate(req.body)
    error ? next({
        statusCode: 400,
        message: error.message
    }) : next()
}


// creating user validator
export const createUserValidator = async (req, res, next) => {
    const registerSchema = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2 }).required(),
        fName: Joi.string().required(),
        lName: Joi.string().required(),
        password: Joi.string().required(),
        phone: Joi.number().required()
    })
    joiValidator(registerSchema, req, res, next)
}

// signing user validator

export const singinUserValidator = async (req, res, next) => {
    const signinSchema = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2 }).required(),
        password: Joi.string().required(),
    })
    joiValidator(signinSchema, req, res, next)
}

// updating user validator
export const updateUserValidator = async (req, res, next) => {
    const updateUserSchema = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2 }).required(),
        fName: Joi.string().required(),
        lName: Joi.string().required(),
        password: Joi.string().required(),
        phone: Joi.number().required()
    })
    joiValidator(updateUserSchema, req, res, next)
}

// creating product validator
export const createProductValidator = async (req, res, next) => {
    const addProductSchema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        stock: Joi.number().required(),
        category: Joi.string().required(),
        images: Joi.string().required(),
        ratings: Joi.number().required(),
        reviews: Joi.string().required(),
    })
    joiValidator(addProductSchema, req, res, next)
}

// updating product validator
export const updateProductValidator = async (req, res, next) => {
    const updateProductSchema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        stock: Joi.number().required(),
        category: Joi.string().required(),
        images: Joi.string().required(),
    })
    joiValidator(updateProductSchema, req, res, next)
}


