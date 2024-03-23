import Joi from "joi";
import { systemRole } from "../../utils/system.js";
import validation from './../../utils/validation.js';

export const signUp = {
  body:Joi.object({
    userName:Joi.string().min(2).required().messages({
      'string.min': `اقل عدد هو 2`,
      'any.required': `هذا الحقل مطلوب`
    }),
    email:Joi.string().email().required().messages({
      'string.email': `هذا البريد غير صالح`,
      'any.required': `هذا الحقل مطلوب`
    }),
    password:Joi.string().min(3).max(99).required().messages({
      'string.min': `اقل عدد هو 3`,
      'string.max': `اكبر عدد هو 99`,
      'any.required': `هذا الحقل مطلوب`
    }),
    role:Joi.string().valid(...Object.values(systemRole)),
    phoneNumber:Joi.string().min(11)
  })
}

export const signIn = {
  body:Joi.object({
    email:Joi.string().email().required()
    .messages({
      'any.required': `هذا الحقل مطلوب`
    }),
    password:Joi.string().min(3).max(99).required().messages({
      'string.min': `اقل عدد هو 3`,
      'string.max': `اكبر عدد هو 99`,
      'any.required': `هذا الحقل مطلوب`
    })
  })
}

export const updateUser = {
  body:Joi.object({
    userName:Joi.string().min(2).messages({
    'string.min': `اقل عدد هو 2`,
      'any.required': `هذا الحقل مطلوب`
    }),
    email:Joi.string().email().messages({
    'string.email': `هذا البريد غير صالح`,
      'any.required': `هذا الحقل مطلوب`
    }),
    newPassword:Joi.string().min(3).max(99).messages({
     'string.min': `اقل عدد هو 3`,
     'string.max': `اكبر عدد هو 99`,
      'any.required': `هذا الحقل مطلوب`
    }),
    phoneNumber:Joi.string().min(11)
  })
}

export const blockUser = {
  params:Joi.object({
    userId:Joi.custom(validation.params).required().messages({
      'any.required': `هذا الحقل مطلوب`
    })
  })
}

export const signGoogle = {
  body:Joi.object({
    idToken: Joi.string().required()
  })
}