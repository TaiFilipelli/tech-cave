'use client';
import { faDragon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthButton from "@/components/LoginButton";
import { useRouter } from "next/navigation";

const Navbar = () => {

  const router = useRouter();

  return (
    <nav className="w-full flex flex-row justify-around items-center p-5 bg-gray-200 shadow-lg">
      <section className="flex flex-row gap-5 hover:cursor-pointer" onClick={() => router.push('/')}>
        <FontAwesomeIcon icon={faDragon} size="2xl"/>
        <h1 className="text-2xl font-bold"><span className="bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">Tech`s</span> Cave</h1>
      </section>
      <section className="flex flex-row gap-5">
        <AuthButton/>
      </section>
    </nav>
  )
}

export default Navbar
