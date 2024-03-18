
import Joi from 'joi';
import validation from '../../utils/validation.js';
export const addSubCategory = {
  body:Joi.object({
    name:Joi.string().min(2).messages({
    'string.min': `اقل عدد هو 2`,
      'any.required': `هذا الحقل مطلوب`
    })
  }),
  params:Joi.object({
    categoryId:Joi.custom(validation.params).required().messages({
      'any.required': `هذا الحقل مطلوب`
    })
  }),
  headers:validation.headers
}

export const updateSubCategory = {
  params:Joi.object({
    subCategoryId:Joi.custom(validation.params).required().messages({
      'any.required': `هذا الحقل مطلوب`
    })
  }),
  body:Joi.object({
    name:Joi.string().min(2),
    categoryId:Joi.custom(validation.params)
  }),
  headers:validation.headers
}

export const params = {
  params:Joi.object({
    subCategoryId:Joi.custom(validation.params).required().messages({
      'any.required': `هذا الحقل مطلوب`
    })
  })
}