import Joi from "joi"
import validation from './../../utils/validation.js';

export const addProduct = {
  body:Joi.object({
    name:Joi.string().min(2).required().messages({'string.min': `اقل عدد هو 2`,'any.required': `هذا الحقل مطلوب`}),
    description:Joi.string().min(2),
    discount:Joi.number().min(0),
    price:Joi.number().min(1).required().messages({'string.min': `اقل عدد هو 0`,'any.required': `هذا الحقل مطلوب`}),
    stock:Joi.number().min(1).required().messages({'string.min': `اقل عدد هو 0`,'any.required': `هذا الحقل مطلوب`}),
    categoryId:Joi.custom(validation.params).required().messages({ 'any.required': `هذا الحقل مطلوب`}),
    subCategoryId:Joi.custom(validation.params).required().messages({'string.min': `اقل عدد هو 0`,'any.required': `هذا الحقل مطلوب`}),
  }),
  headers:validation.headers
}

export const updateProduct = {
  body:Joi.object({
    name:Joi.string().min(2).messages({'string.min': `اقل عدد هو 2`}),
    description:Joi.string().min(2),
    price:Joi.number().min(1).messages({'string.min': `اقل عدد هو 0`}),
    stock:Joi.number().min(1).messages({'string.min': `اقل عدد هو 0`}),
    newCategoryId:Joi.custom(validation.params),
    newSubCategoryId:Joi.custom(validation.params),
    oldPublicId:Joi.string(),
    discount:Joi.number().min(0)
  }),
  params:Joi.object({
    productId:Joi.custom(validation.params).required().messages({ 'any.required': `هذا الحقل مطلوب`})
  })
  ,
  headers:validation.headers
}

export const params = {
  params:Joi.object({
    productId:Joi.custom(validation.params).required().messages({ 'any.required': `هذا الحقل مطلوب`})
  })
}