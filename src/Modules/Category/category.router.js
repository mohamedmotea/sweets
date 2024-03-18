import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import vld from './../../Middlewares/validation.middleware.js';
import * as CC from './category.controller.js'
import * as schema from './category.validation.js'
import auth from './../../Middlewares/auth.middleware.js';
import { systemRole } from "../../utils/system.js";

const router = Router()
router.post('/',vld(schema.addCategory),auth([systemRole.SUPERADMIN]),expressAsyncHandler(CC.addCategory))
.patch('/:categoryId',vld(schema.updateCategory),auth([systemRole.SUPERADMIN]),expressAsyncHandler(CC.updateCategory))
.delete('/:categoryId',vld(schema.params),auth([systemRole.SUPERADMIN]),expressAsyncHandler(CC.deleteCategory))

.get('/',expressAsyncHandler(CC.getAllCategory))
.get('/:categoryId',expressAsyncHandler(CC.getCategory))
export default router