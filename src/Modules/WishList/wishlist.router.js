import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import vld from '../../Middlewares/validation.middleware.js';
import * as WC from './wishlist.controller.js'
import * as schema from './wishlist.validation.js'
import auth from '../../Middlewares/auth.middleware.js';
import { systemRole } from "../../utils/system.js";


const router = Router()

router
.post('/:productId',vld(schema.params),auth(Object.values(systemRole)),expressAsyncHandler(WC.addWishlist))
.patch('/:productId',vld(schema.params),auth(Object.values(systemRole)),expressAsyncHandler(WC.removeProductWishlist))
.delete('/',auth(Object.values(systemRole)),expressAsyncHandler(WC.deleteWishlist))
.get('/',auth(Object.values(systemRole)),expressAsyncHandler(WC.getWishlist))

export default router