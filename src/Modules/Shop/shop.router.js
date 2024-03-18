import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import vld from './../../Middlewares/validation.middleware.js';
import * as SC from './shop.controller.js'
import * as schema from './shop.validation.js'
import auth from './../../Middlewares/auth.middleware.js';
import { systemRole } from "../../utils/system.js";

const router = Router()

.post('/',vld(schema.addShop),auth([systemRole.ADMIN,systemRole.SUPERADMIN]),expressAsyncHandler(SC.addShop))
.put('/:shopId',vld(schema.updateShop),auth([systemRole.ADMIN,systemRole.SUPERADMIN]),expressAsyncHandler(SC.updateShop))
.delete('/:shopId',vld(schema.deleteShop),auth([systemRole.ADMIN,systemRole.SUPERADMIN]),expressAsyncHandler(SC.deleteShop))
// get info
.get('/',expressAsyncHandler(SC.getAllShop))
.get('/:shopId',expressAsyncHandler(SC.getShop))
export default router