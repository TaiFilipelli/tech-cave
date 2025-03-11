"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button, Avatar, Dropdown, DropdownTrigger, DropdownItem, DropdownMenu } from "@heroui/react";
import { Poppins } from "next/font/google";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

const pop = Poppins({ subsets: ["latin"], weight: "600" });

export default function AuthButton() {
    const { data: session } = useSession();
    const [isHovered, setIsHovered] = useState(false);

    
    if (session) {
        console.log(session.user.image!);
        return (
            <Dropdown>
                <DropdownTrigger>
                <article className="hover:cursor-pointer relative flex items-center gap-2 transition-all duration-300" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                    <Avatar src={session.user.image!} size="lg" className="transition-all duration-300" />
                    <p className={`absolute left-0 transition-all duration-300 ease-in-out ${isHovered ? 'opacity-100 translate-x-6' : 'opacity-0 translate-x-0'}`} style={{ marginLeft: '40px' }}>
                        {session.user?.name}
                    </p>
                </article>
                </DropdownTrigger>
                <DropdownMenu className={`${pop.className} text-center`}>
                    <DropdownItem key='logout' className="bg-red-600 text-white px-4 py-2 rounded" onPress={() => signOut({redirect: false})}>
                        Cerrar sesión
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        );
    }

    return (
        <Button onPress={() => signIn("google")} className={`${pop.className} bg-blue-500 text-white px-4 py-2 rounded`} startContent={<FontAwesomeIcon icon={faGoogle} size="xl"/>}>
            Iniciar sesión
        </Button>
    );
}
