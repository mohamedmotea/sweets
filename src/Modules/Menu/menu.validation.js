import Joi from "joi";
import validation from './../../utils/validation.js';

export const addMenu = {
  params:Joi.object({
    shopId:Joi.custom(validation.params).required()
  }),
  headers:validation.headers
}

export const params = {
  params:Joi.object({
    shopId:Joi.custom(validation.params).required().messages({ 'any.required': `هذا الحقل مطلوب`})
  })
}
export const menuParams = {
  params:Joi.object({
    menuId:Joi.custom(validation.params).required().messages({ 'any.required': `هذا الحقل مطلوب`})
  })
}