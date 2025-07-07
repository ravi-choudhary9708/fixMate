import { dbConnect } from "@/lib/dbConnect";
import Ticket from "@/models/Ticket";
import { verifyJWT } from "@/utils/jwt";
import { NextResponse } from "next/server";
import TraceLog from "@/models/Trace"



export async function PATCH(req,{params}){
    await dbConnect();
    const token = req.headers.get("authorization")?.split(" ")[1];

    const user= verifyJWT(token);
    if(!user) return NextResponse.json({error:"unauthorized"},{status:404});

    const {status}= await req.json();


    const ticket= await Ticket.findById(params.id);
   if(!ticket) return NextResponse.json({error:"ticket not found"},{status:404});

   //staff can update only their assigned ticket
   if(user.role==="staff" && ticket.assignedTo.toString()!==user.userId){
    return NextResponse.json({error:"Access Denied"},{status:403});
   }

   ticket.status= status;
   await ticket.save();

   await TraceLog.create({
     ticketId: ticket._id,
    action: `Ticket marked as ${status}`,
    by: user.userId,
    byRole: user.role,
    ip: req.headers.get("x-forwarded-for") || "unknown",
    userAgent: req.headers.get("user-agent") || "unknown"
   })

    return NextResponse.json({ success: true, message: "Status updated" });
}