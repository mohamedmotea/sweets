import Joi from "joi";
import validation from './../../utils/validation.js';

export const getUser = {
  params:Joi.object({
    userId:Joi.custom(validation.params).required()
  })
}