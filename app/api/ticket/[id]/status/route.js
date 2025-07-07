import { NextResponse } from "next/server";

import { verifyJWT } from "@/utils/jwt";
import Ticket from "@/models/Ticket";
import { dbConnect } from "@/lib/dbConnect";

export async function PATCH(req, context) {
 await dbConnect

  const { id } = await  context.params;
  const { status } = await req.json();

  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = await verifyJWT(token);
  if (!user || (user.role !== "admin" && user.role !== "staff")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ticket = await Ticket.findById(id);
  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  ticket.status = status;
  await ticket.save();

  await TraceLog.create({
    ticketId: id,
    action: `Status changed to ${status}`,
    by: user.userId,
    byRole: user.role,
    ip: req.headers.get("x-forwarded-for") || "unknown",
    userAgent: req.headers.get("user-agent") || "unknown",
  });

  return NextResponse.json({ success: true });
}
