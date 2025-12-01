import { hash } from "bcrypt";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/token.js"
import { sendOtpMail } from "../utils/mail.js";


export const signUp = async (req,res) => {
    try{
        const{fullName, email, password, mobile, role} = req.body;
        let user = await User.findOne({email})

        if(user){
            return res.status(400).json({message:"User already exists"});
        }

        if(password.length < 6){
            return res.status(400).json({message:"Password must be at least 6 characters"});
        }

        if(mobile.length < 10){
            return res.status(400).json({message:"Invalid mobile number"});
        }

        const hashedPassword = await bcrypt.hash(password,10)

        user = new User({
            fullName,
            email,
            password:hashedPassword,
            mobile,
            role
        })

        await user.save();

        const token = await generateToken(user._id)
        res.cookie("token",token,{
            secure:true,
            sameSite:"none",
            maxAge:7 * 24 * 60 * 60 * 1000,
            httpOnly:true

        })

        return res.status(201).json({message:"User created successfully", user, token});
    }

    catch(error){
        return res.status(500).json({message:`SignUp error ${error}`});
    }
}

export const signIn = async (req,res) => {
    try{
        const{email, password} = req.body;
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({message:"User does not exists"});
        }  

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({message:"Incorrect password"})
        }

        const token = await generateToken(user._id)
        res.cookie("token",token,{
            secure:true,
            sameSite:"none",
            maxAge:7 * 24 * 60 * 60 * 1000,
            httpOnly:true

        })

        return res.status(200).json({message:"User signIn successfully", user, token});
    }

    catch(error){
        return res.status(500).json({message:`SignUp error ${error}`});
    }
}


export const signOut = async (req,res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({message:"SignOut successfully"});

    } catch (error) {
        console.log("SignOut error",error);
        return res.status(500).json({message:`SignOut error ${error}`});
    }
}


export const sendOtp = async (req,res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({message:"User does not exists"});
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        user.resetOtp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
        user.isOtpVerified = false;

        await user.save();

        sendOtpMail(email,otp)
        return res.status(200).json({message:"OTP sent to your email"});

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:`Send OTP error ${error}`});
    }
}

export const verifyOtp = async (req,res) => {
    try {
        const {email, otp} = req.body;
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({message:"User does not exists"});
        }

        if(user.resetOtp !== otp){
            return res.status(400).json({message:"Invalid OTP"});
        }

        if(user.otpExpires < Date.now()){
            return res.status(400).json({message:"OTP expired"});
        }

        user.resetOtp = null;
        user.otpExpires = null;
        user.isOtpVerified = true;
        await user.save();

        return res.status(200).json({message:"OTP verified successfully"});

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:`Verify OTP error ${error}`});
    }
}

export const resetPassword = async (req,res) => {
    try {
        const {email, newPassword} = req.body;
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({message:"User does not exists"});
        }

        if(!user.isOtpVerified){
            return res.status(400).json({message:"OTP not verified"});
        }

        if(newPassword.length < 6){
            return res.status(400).json({message:"Password must be at least 6 characters"});
        }   
        const hashedPassword = await bcrypt.hash(newPassword,10)
        user.password = hashedPassword;
        user.isOtpVerified = false;
        await user.save(); 
        return res.status(200).json({message:"Password reset successfully"});

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:`Reset Password error ${error}`});
    }   
}


export const googleAuth = async (req,res) => {
    try {
        const {email, fullName, mobile} = req.body;
        let user = await User.findOne({email})
        if(!user){
            user = new User({
                fullName,
                email,
                mobile,
                password:null,
                role:"user"
            })
            await user.save();
        }
        const token = await generateToken(user._id)
        res.cookie("token",token,{
            secure:true,
            sameSite:"none",
            maxAge:7 * 24 * 60 * 60 * 1000,
            httpOnly:true
        })

        return res.status(200).json({message:"User signIn successfully", user, token});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:`Google Auth error ${error}`});
    }   
}
