import { dbConnect } from "@/lib/dbConnect";
import Ticket from "@/models/Ticket";
import TraceLog from "@/models/Trace"
import User from '@/models/User';
import { verifyJWT } from "@/utils/jwt";
import { NextResponse } from "next/server";




export async function POST(req){
    await dbConnect();


     const token = req.headers.get("authorization")?.split(" ")[1];
  const admin = verifyJWT(token);
  if (!admin || admin.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
   

    const { ticketId, staffId } = await req.json();
 const ticket = await Ticket.findById(ticketId);
   const staffUser = await User.findById(staffId);
   
   if (!ticket || !staffUser) {
    return NextResponse.json({ error: "Ticket or Staff not found" }, { status: 404 });
  }

  
  ticket.assignedTo = staffId;
  ticket.status = "Assigned";
  await ticket.save();

  await TraceLog.create({
    ticketId,
    action: `Assigned to ${staffUser.name}`,
    by: admin.userId,
    byRole: "admin",
    ip: req.headers.get("x-forwarded-for") || "unknown",
    userAgent: req.headers.get("user-agent") || "unknown",
  });

   return NextResponse.json({ success: true, message: "Ticket assigned successfully" });

}