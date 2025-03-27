import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req:Request){
    try {
        const userData = await req.json();
        const {email} = userData;

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const usersCollection = db.collection("users");

        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ success: false, error: "El usuario ya existe" });
        }

        const result = await usersCollection.insertOne(userData);
        return NextResponse.json({ success: true, id: result.insertedId });
        
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 500 });
    }
}