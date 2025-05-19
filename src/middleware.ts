import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req:NextRequest){

    const { pathname } = req.nextUrl;
    
    
    if(pathname.startsWith('/dashboard')){
        const token = req.cookies.get('userToken')?.value;
        const secret = process.env.JWT_SECRET;

        if(!token||!secret){
            return NextResponse.redirect(new URL('/404', req.url));
        }

        try {
            const encoder = new TextEncoder();
            const secretKey = encoder.encode(secret);

           const { payload } = await jwtVerify(token, secretKey);

            if (!payload.isAdmin) {
                return NextResponse.redirect(new URL("/404", req.url));
            }
            
            return NextResponse.next();
    } catch (err) {
      return NextResponse.redirect  (new URL(`/404?error=`+err, req.url));
    }
}
}