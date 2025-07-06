//take email and password 
//connect db
//find user with email=user
// !user 
// password math bcrypt.compare(password,user.password)
//sign token 
//return token, user.role

import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"
import { signJWT } from "@/utils/jwt";



export async function POST(req){
    const {email,password}= await req.json();
    await dbConnect();

    const user = await User.findOne({email});
    if(!user){
        return NextResponse.json({error:"user not found"},{status:404});

    }

 const isMatch = await bcrypt.compare(password,user.password);
 if(!isMatch){
    return NextResponse.json({error:"invalid password"},{status:404});

 }

 const token = signJWT({userId:user._id,role:user.role,email:user.email});
 console.log("server token",token)

 return  NextResponse.json({token,role:user.role});




}