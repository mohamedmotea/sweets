
import Joi from 'joi';
import validation from './../../utils/validation.js';


export const addRate = {
  body:Joi.object({
    rate:Joi.number().min(1).max(5).required().messages({
      'number.min': `اقل عدد هو 1`,
      'number.max': `اكبر عدد هو 5`,
      'any.required': `هذا الحقل مطلوب`
    })
  }),
  params:Joi.object({
    productId:Joi.custom(validation.params).required().messages({ 'any.required': `هذا الحقل مطلوب`})
  }),
  headers:validation.headers
}