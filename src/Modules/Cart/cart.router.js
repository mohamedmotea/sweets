import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import vld from '../../Middlewares/validation.middleware.js';
import * as CC from './cart.controller.js'
import * as schema from './cart.validation.js'
import auth from '../../Middlewares/auth.middleware.js';
import { systemRole } from "../../utils/system.js";

const router = Router();


router.post('/',vld(schema.addProductToCart),auth(Object.values(systemRole)),expressAsyncHandler(CC.addProductToCart))
.patch('/:productId',vld(schema.removeProductFromCart),auth(Object.values(systemRole)),expressAsyncHandler(CC.removeProductFromCart))
.delete('/',auth(Object.values(systemRole)),expressAsyncHandler(CC.deleteCart))
.get('/',auth(Object.values(systemRole)),expressAsyncHandler(CC.getCart))

export default router