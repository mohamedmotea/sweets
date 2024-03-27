import Joi from "joi";
import validation from './../../utils/validation.js';

export const params = {
  params:Joi.object({
    productId:Joi.custom(validation.params).required()
  }),
  headers:validation.headers
}