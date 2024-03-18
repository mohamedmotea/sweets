import Joi from "joi";
import validation from './../../utils/validation.js';


export const addShop = {
  body:Joi.object({
    shop_name:Joi.string().min(2).messages({
   'string.min': `اقل عدد هو 2`,
      'any.required': `هذا الحقل مطلوب`
    }),
    delivery_Number:Joi.array().required().messages({
         'any.required': `هذا الحقل مطلوب`
    }),
    location:Joi.string().required().messages({
         'any.required': `هذا الحقل مطلوب`
       })
  }),
 headers:validation.headers
}

export const updateShop = {
  body:Joi.object({
    shop_name:Joi.string().min(2).messages({
 'string.min': `اقل عدد هو 2`
    }),
    newDelivery_Number:Joi.string(),
    oldDelivery_Number:Joi.string(),
     location:Joi.string()
  }),
     headers:validation.headers,
     params:Joi.object({
       shopId:Joi.custom(validation.params).required().messages({
         'any.required': `هذا الحقل مطلوب`
       })
     })
}

export const deleteShop = {
  headers:validation.headers,
  params:Joi.object({
    shopId:Joi.custom(validation.params).required().messages({
      'any.required': `هذا الحقل مطلوب`
    })
  })
}
