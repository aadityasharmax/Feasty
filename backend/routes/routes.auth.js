import express from 'express';
import { signUp, signIn, signOut, sendOtp, verifyOtp, resetPassword, googleAuth } from '../controllers/auth.controllers.js';

const authRouter = express.Router();

authRouter.post('/signup',signUp)
authRouter.post('/signIn',signIn)
authRouter.get('/signOut',signOut)
authRouter.post('/sendotp',sendOtp)
authRouter.post('/verifyotp',verifyOtp)
authRouter.post('/resetpassword',resetPassword)
authRouter.post('/googleauth',googleAuth)


export default authRouter;