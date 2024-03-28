import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import vld from './../../Middlewares/validation.middleware.js';
import * as RC from './rate.controller.js'
import * as schema from './rate.validation.js'
import auth from './../../Middlewares/auth.middleware.js';
import { systemRole } from "../../utils/system.js";

const router = Router();

router
.post('/:productId',vld(schema.addRate),auth(Object.values(systemRole)),expressAsyncHandler(RC.addRate))
export default router