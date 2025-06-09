import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const ordersCollection = db.collection("orders");

        const result = await ordersCollection.insertOne(body);

        return NextResponse.json({ success: true, id: result.insertedId });
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 500 });
    }
}