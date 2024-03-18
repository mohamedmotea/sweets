import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import vld from '../../Middlewares/validation.middleware.js';
import * as SC from './subCategory.controller.js'
import * as schema from './subCategory.validation.js'
import auth from '../../Middlewares/auth.middleware.js';
import { systemRole } from "../../utils/system.js";

const router = Router()
router.post('/:categoryId',vld(schema.addSubCategory),auth([systemRole.SUPERADMIN]),expressAsyncHandler(SC.addSubCategory))
.patch('/:subCategoryId',vld(schema.updateSubCategory),auth([systemRole.SUPERADMIN]),expressAsyncHandler(SC.updateSubCategory))
.delete('/:subCategoryId',vld(schema.params),auth([systemRole.SUPERADMIN]),expressAsyncHandler(SC.deleteSubCategory))

.get('/',expressAsyncHandler(SC.getAllSubCategories))
.get('/:subCategoryId',expressAsyncHandler(SC.getSubCategory))
export default router