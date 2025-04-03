import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";


export async function GET(req:Request){
    try {
        const {searchParams} = new URL(req.url);
        const email = searchParams.get('email');

        if(!email){
            return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({ email });

        if(!user){
            return NextResponse.json({ success: false, error: "No user found" }, { status: 404 });
        }

        return NextResponse.json({success:true, user});
    }catch(error){
        return NextResponse.json({ success: false, error: error }, { status: 500 });
    }
}

export async function POST(req:Request){
    try {
        console.log('Entrando al POST');
        const userData = await req.json();
        const {email} = userData;
        console.log('Entró esta data:', userData);

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const usersCollection = db.collection("users");

        console.log('Entramos a la búsqueda de usuario por email');

        const existingUser = await usersCollection.findOne({ email });
        console.log('Ya se buscó usuario:', existingUser);
        if (existingUser) {
            return NextResponse.json({ success: false, error: "El usuario ya existe" });
        }

        const result = await usersCollection.insertOne(userData);
        return NextResponse.json({ success: true, id: result.insertedId });

    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 500 });
    }
}