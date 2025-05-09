import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req:NextRequest){

    const { pathname } = req.nextUrl;
    
    
    if(pathname.startsWith('/dashboard')){
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        const email = token?.email;

        if(!email){
            return NextResponse.redirect(new URL('/404', req.url));
        }

        try{
            const pageUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

            const response = await fetch(`${pageUrl}/api/users?email=${encodeURIComponent(email!)}`,{
                method:'GET',
            });
            
            const data = await response.json();

            if(!data.success || !data.user){
                return NextResponse.redirect(new URL('/404', req.url));
            }

            if(!data.user.isAdmin){
                return NextResponse.redirect(new URL('/404', req.url));
            }

            return NextResponse.next();

        }catch(error){
            return NextResponse.json({success: false, error: `No se pudo conectar con la API:${error}`}, {status: 500});
        }

    }
}