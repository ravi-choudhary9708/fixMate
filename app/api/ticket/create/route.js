import { dbConnect } from "@/lib/dbConnect";
import { verifyJWT } from "@/utils/jwt";
import Ticket from "@/models/Ticket";
import TraceLog from "@/models/Trace"
import { NextResponse } from "next/server";





export async function POST(req){
    await dbConnect();

    const token = req.headers.get("authorization")?.split(" ")[1];
    const user = verifyJWT(token);

    if(!user){
        return NextResponse.json({error:"unauthorized"},{status:404});

    }

    const {title,description, category , priority}= await req.json();
     
  const ticket =  await Ticket.create({
        title,
        description,
        category,
        priority,
        userId:user.userId,
        status:'Open',

    })

    await TraceLog.create({
        ticketId:ticket._id,
        action:"ticket created",
        by:user.userId,
        byRole:user.role,
        ip:req.headers.get("x-forwarded-for") || "unknown",
        userAgent:req.headers.get("user-agent")|| "unknown",

    })

    return NextResponse.json({success:true,ticketId:ticket._id});


}