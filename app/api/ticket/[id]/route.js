import { dbConnect } from "@/lib/dbConnect";
import Ticket from "@/models/Ticket";
import { NextResponse } from "next/server";
import { verifyJWT } from "@/utils/jwt";



export async function GET(req, context) {

    await dbConnect();

      const { params } = await context; // ✅ this works now in latest Next.js
  const { id } =await params;
        
     const token = req.headers.get("authorization")?.split(" ")[1];
  const user = verifyJWT(token);

  console.log("user at infp",user)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
 

  const ticket =  await Ticket.findById(id).populate("userId","name email").populate("assignedTo","name email").lean();
  
  if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });

  return NextResponse.json(ticket);
}