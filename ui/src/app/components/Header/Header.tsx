"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import Link from "next/link";
import Logo from "../../../../assets/icon.png"
import { PowerIcon, ShoppingCartIcon, UserCircleIcon } from "@heroicons/react/16/solid";
const Header = () => {
  const router = useRouter()
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      setShowLogout(Boolean(token));
    };

    checkToken();
    window.addEventListener('storage', checkToken);

    const originalSetItem = localStorage.setItem.bind(localStorage);
    localStorage.setItem = (key, value) => {
      originalSetItem(key, value);
      if (key === 'token') {
        checkToken();
      }
    };
    return () => {
      window.removeEventListener('storage', checkToken);
      localStorage.setItem = originalSetItem;
    };
  }, []);

  return (
    <div className="max-w-[1600px] mx-0 my-auto px-0 py-0 w-[100%] fixed top-[0] z-50 border-b bg-white">
      <div className="w-full flex items-center justify-between px-4 sm:px-32 py-3">
        <Image src={Logo} alt="Logo" width={48} height={96} onClick={() => router.push("/")} className="cursor-pointer	" />
        <div className="flex items-center">
          <Link href={`/cart`} passHref className="ml-2"><ShoppingCartIcon className="w-6 h-6 text-primary-color" /></Link>
          <button className="mx-6" onClick={() => {
            router.push(showLogout ? "/profile" : "/login")
          }}  ><UserCircleIcon className="w-6 h-6 text-primary-color" /> </button>
          {showLogout ? <button className="ml-2" onClick={() => {
            localStorage.clear()
            router.push("/")
            setShowLogout(false)
          }}  ><PowerIcon className="w-6 h-6 text-primary-color" /> </button> : null}
        </div>
      </div>
    </div>
  );
};

export default Header;
