import Joi from "joi";
import validation from './../../utils/validation.js';


export const addProductToCart = {
  body:Joi.object({
    productId:Joi.custom(validation.params).required(),
    quantity:Joi.number().min(1).required().messages({'string.min': `اقل عدد هو 1`,'any.required': `هذا الحقل مطلوب`}),
  }),
  headers:validation.headers
}
export const removeProductFromCart = {
  params:Joi.object({
    productId:Joi.custom(validation.params).required(),
  }),
  headers:validation.headers
}