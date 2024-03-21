import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import vld from './../../Middlewares/validation.middleware.js';
import * as PC from './product.controller.js'
import * as schema from './product.validation.js'
import auth from './../../Middlewares/auth.middleware.js';
import { systemRole } from "../../utils/system.js";
import multerMiddleware from './../../Middlewares/multer.middleware.js';

const router = Router({mergeParams:true})
router
.post('/',multerMiddleware().fields([{name:'image',maxCount:1},{name:'images',maxCount:5}]),vld(schema.addProduct),auth([systemRole.ADMIN,systemRole.SUPERADMIN]),expressAsyncHandler(PC.addProduct))
.put('/:productId',multerMiddleware().fields([{name:'image',maxCount:1},{name:'images',maxCount:5}]),vld(schema.updateProduct),auth([systemRole.ADMIN,systemRole.SUPERADMIN]),expressAsyncHandler(PC.updateProduct))
.delete('/:productId',vld(schema.params),auth([systemRole.ADMIN,systemRole.SUPERADMIN]),expressAsyncHandler(PC.deleteProduct))
.get('/',expressAsyncHandler(PC.allProducts))
.get('/:productId',vld(schema.params),expressAsyncHandler(PC.getProduct))
export default router