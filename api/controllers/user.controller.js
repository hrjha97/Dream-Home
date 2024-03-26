import { User } from "../models/user.models.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req,res)=>{
    res.send("Hello world");

}

export const updateUser = async (req,res,next)=>{
    if(req.user.id !== req.params.id) return next(errorHandler(401,"You can only update your own account"));
    try {
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password,10);

        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set : {
               username : req.body.username,
               email: req.body.email,
               avatar : req.body.avatar,
            }
        },{new : true})

        const {pasword,...rest}  = updatedUser._doc

        res.json(rest);
        
    } catch (error) {
        next(error);
    }

}
export const deleteUser = async(req,res,next)=>{
    if(req.user.id!=req.params.id){
        return next(401,"You can only delete your own account");
    }
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json("User has been deleted")
        
    } catch (error) {
        next(error)
    }

}
