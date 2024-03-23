import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import vld from './../../Middlewares/validation.middleware.js';
import * as AC from './auth.controller.js'
import * as schema from './auth.validation.js'
import auth from './../../Middlewares/auth.middleware.js';
import { systemRole } from "../../utils/system.js";

const router = Router()

router
.post('/signUp',vld(schema.signUp),expressAsyncHandler(AC.signUp))
.post('/signIn',vld(schema.signIn),expressAsyncHandler(AC.signIn))
.get('/verify',expressAsyncHandler(AC.verifyEmail))
.put('/',auth(Object.values(systemRole)),vld(schema.updateUser),expressAsyncHandler(AC.updateUser))
.delete('/',auth(Object.values(systemRole)),expressAsyncHandler(AC.deleteUser))
// sign with Google account
.post('/signUpWithGoogle',vld(schema.signUpWithGoogle),expressAsyncHandler(AC.signUpWithGoogle))
// Admin - Super Admin
.post('/:userId',auth([systemRole.ADMIN,systemRole.SUPERADMIN]),vld(schema.blockUser),expressAsyncHandler(AC.blockUser))
export default router