import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import Message from "@/models/Message";
import { verifyJWT } from "@/utils/jwt";

export async function POST(req, { params }) {
 await dbConnect()
  const id = await params.id;
  console.log("params id:",id)
  const body = await req.json();

  const token = req.headers.get("authorization")?.split(" ")[1];
  const user =await verifyJWT(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const newMsg = await Message.create({
    ticketId: id,
    senderId: user.userId,
    senderRole: user.role,
    message: body.message,
  });

  return NextResponse.json(newMsg);
}

export async function GET(req, { params }) {
  await dbConnect();
  const id = params.id;

  const messages = await Message.find({ ticketId: id })
    .sort({ timestamp: 1 }) // ascending
    .populate("senderId", "name email")
    .lean();

  return NextResponse.json(messages);
}
