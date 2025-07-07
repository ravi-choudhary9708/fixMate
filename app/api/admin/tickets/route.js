import { dbConnect } from "@/lib/dbConnect";
import Ticket from "@/models/Ticket";
import { NextResponse } from "next/server";
import { verifyJWT } from "@/utils/jwt";




export async function GET(req){
    await dbConnect();

    const token = req.headers.get("authorization")?.split(" ")[1];
  const user = verifyJWT(token);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }


   const tickets= await Ticket.find().sort({createdAt: -1}).populate("assignedTo","name email").lean();

    return NextResponse.json(tickets)
}