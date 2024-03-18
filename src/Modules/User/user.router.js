import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import vld from './../../Middlewares/validation.middleware.js';
import * as UC from './user.controller.js'
import * as schema from './user.validation.js'
import auth from './../../Middlewares/auth.middleware.js';
import { systemRole } from "../../utils/system.js";

const router = Router()

router
.get('/',auth([systemRole.SUPERADMIN]),expressAsyncHandler(UC.getAllUsers))
.get('/:userId',vld(schema.getUser),auth([systemRole.SUPERADMIN,systemRole.ADMIN]),expressAsyncHandler(UC.getUser))
export default router