import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req:Request){

    console.log('Entrando al POST');
    try {
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