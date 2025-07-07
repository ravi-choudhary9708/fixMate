import { dbConnect } from "@/lib/dbConnect";

import TraceLog from "@/models/Trace";
import { verifyJWT } from "@/utils/jwt";
import { NextResponse } from "next/server";

export async function GET(req, context) {

    await dbConnect();

      const { params } = await context; // ✅ this works now in latest Next.js
  const { id } = await params;
      
     const token = req.headers.get("authorization")?.split(" ")[1];
  const user =await verifyJWT(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  


   const traces = await TraceLog.find({ ticketId: id }).sort({ timestamp: -1 }).lean();
   console.log("api traces",traces)
  return NextResponse.json(traces);
}