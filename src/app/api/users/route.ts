import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req:Request){
    try {
        const userData = await req.json();
        const {email} = userData;

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const usersCollection = db.collection("users");
        
        const tokenPayload = {
            email: userData.email,
            isAdmin: userData.isAdmin,
        };

        const token =  jwt.sign(tokenPayload, JWT_SECRET!, { expiresIn: "7d" });

        console.log('Entramos a la búsqueda de usuario por email');

        const existingUser = await usersCollection.findOne({ email });
        console.log('Ya se buscó usuario:', existingUser);
        if (existingUser) {
             const response = NextResponse.json({ success: false, error: "El usuario ya existe" });
            response.cookies.set({name: 'userToken', value: token, httpOnly: true, path: '/', secure: process.env.NODE_ENV === 'production', sameSite: 'lax'});
            return response;
        }

        const result = await usersCollection.insertOne(userData);

       const response = NextResponse.json({ success: true, id: result.insertedId });
        response.cookies.set({name: 'userToken', value: token, httpOnly: true, path: '/', secure: process.env.NODE_ENV === 'production', sameSite: 'lax'});

       return response;
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 500 });
    }
}