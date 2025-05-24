'use client';
import { faDragon, faMoon, faSun, faXmark, faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthButton from "@/components/LoginButton";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import clsx from "clsx";
import Image from "next/image";

const Navbar = ({isAdmin}:{isAdmin:boolean}) => {

  const router = useRouter();

  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mode = localStorage.getItem("theme");
      if (mode === "dark") {
        document.documentElement.classList.add("dark");
        setDarkMode(true);
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDark);
  };

  return (
    <nav className="fixed top-0 left-0 w-full flex flex-row justify-around items-center p-5 bg-gray-200/80 dark:bg-gray-900/80 bg-opacity-10 z-50">
      <section className="flex flex-row gap-5 hover:cursor-pointer" onClick={() => router.push('/')}>
        <FontAwesomeIcon icon={faDragon} size="2xl"/>
        <h1 className="text-2xl font-bold"><span className="bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">{`Tech's`}</span> Cave</h1>
      </section>
       <section className="hidden sm:flex flex-row gap-5 items-center">
        <button onClick={toggleDarkMode} className="text-black dark:text-white">
          <FontAwesomeIcon icon={darkMode ? faSun : faMoon} size="lg" />
        </button>
        <Button as={Link} href="/products" className="bg-transparent text-black dark:text-white font-semibold text-lg">Productos</Button>
        <AuthButton isAdmin={isAdmin} />
      </section>

      <button className="sm:hidden text-black dark:text-white z-50" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        <FontAwesomeIcon icon={mobileMenuOpen ? faXmark : faBars} size="xl" />
      </button>

      <section className={clsx("absolute top-0 right-0 h-screen w-2/3 bg-white dark:bg-gray-900 p-5 transition-transform duration-300 sm:hidden flex flex-col items-center text-center gap-6 z-40",mobileMenuOpen ? "translate-x-0" : "translate-x-full")}>
        <Image src={'/logo_completo.png'} alt="Logo" width={200} height={200}/>
        <button onClick={toggleDarkMode} className="text-black dark:text-white">
          <FontAwesomeIcon icon={darkMode ? faSun : faMoon} size="xl" />
        </button>
        <Button as={Link} href="/products" className="bg-transparent text-black dark:text-white font-semibold text-lg" onPress={() => setMobileMenuOpen(false)}>Productos</Button>
        <AuthButton isAdmin={isAdmin} />
      </section>
    </nav>
  );
};

export default Navbar;

