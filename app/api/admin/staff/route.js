import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyJWT } from "@/utils/jwt";
import { NextResponse } from "next/server";


export async function GET(req){
    await dbConnect();

    const token = req.headers.get("authorization")?.split(" ")[1];
  const user =await verifyJWT(token);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  
  const staff = await User.find({ role: "staff" }, "name email phoneNo").lean();
  console.log("staff:",staff)
  return NextResponse.json(staff);

}