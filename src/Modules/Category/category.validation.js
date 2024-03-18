
import Joi from 'joi';
import validation from './../../utils/validation.js';
export const addCategory = {
  body:Joi.object({
    name:Joi.string().min(2).messages({
    'string.min': `اقل عدد هو 2`,
      'any.required': `هذا الحقل مطلوب`
    })
  }),
  headers:validation.headers
}

export const updateCategory = {
  params:Joi.object({
    categoryId:Joi.custom(validation.params).required().messages({
      'any.required': `هذا الحقل مطلوب`
    })
  }),
  body:Joi.object({
    name:Joi.string().min(2).required().messages({
   'string.min': `اقل عدد هو 2`
    })
  }),
  headers:validation.headers
}

export const params = {
  params:Joi.object({
    categoryId:Joi.custom(validation.params).required().messages({
      'any.required': `هذا الحقل مطلوب`
    })
  })
}