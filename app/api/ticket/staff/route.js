import { dbConnect } from "@/lib/dbConnect";
import Ticket from "@/models/Ticket";
import { verifyJWT } from "@/utils/jwt";
import { NextResponse } from "next/server";


export async function GET(req){
    await dbConnect();
    const token = req.headers.get("authorization")?.split(" ")[1];
    const user= verifyJWT(token);

    if(!user){
        return NextResponse.json({error:"unauthorized"},{status:404});
    }

    const tickets = await Ticket.find({assignedTo:user.userId}).sort({createdAt: -1});
    return NextResponse.json(tickets)
}