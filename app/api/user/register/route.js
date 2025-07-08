//take info from frontend 
//db connect
//check if user already exist
//if role===admin error
//hash password
//create new user
//return userId:newUser._id

import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";



export async function POST(req){
    const {name,email,password,role,phoneNo}= await req.json();
   await dbConnect();
    const existingUser= await User.findOne({email});

    if(existingUser){
        return NextResponse.json({error:"user already exists"},{status:400});
    }

    const roleToUse= role || "user";

    if(roleToUse==="admin"){
        return NextResponse.json({error:"admin creation not allowed"},{status:400});
    }
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

const newUser= await User.create({
    name,
    phoneNo,
    email,
    password:hashedPassword,
    role:roleToUse,
})

return NextResponse.json({ success: true, userId: newUser._id })


}