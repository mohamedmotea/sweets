import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import vld from './../../Middlewares/validation.middleware.js';
import * as MC from './menu.controller.js'
import * as schema from './menu.validation.js'
import auth from './../../Middlewares/auth.middleware.js';
import { systemRole } from "../../utils/system.js";
import multerMiddleware from './../../Middlewares/multer.middleware.js';

const router = Router();

router.post('/:shopId',multerMiddleware().array('images',10),auth([systemRole.ADMIN,systemRole.SUPERADMIN]),vld(schema.addMenu),expressAsyncHandler(MC.addMenu))
router.patch('/:menuId',multerMiddleware().single('image'),auth([systemRole.ADMIN,systemRole.SUPERADMIN]),vld(schema.menuParams),expressAsyncHandler(MC.updateMenu))
router.delete('/:menuId',auth([systemRole.ADMIN,systemRole.SUPERADMIN]),vld(schema.menuParams),expressAsyncHandler(MC.deleteMenu))

.get('/:shopId',vld(schema.params),expressAsyncHandler(MC.getMenu))
.get('/',expressAsyncHandler(MC.getAllMenus))

export default router;