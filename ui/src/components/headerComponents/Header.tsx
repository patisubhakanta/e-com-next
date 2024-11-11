"use client";
import { useEffect, useState } from "react";

import { PowerIcon, ShoppingCartIcon, UserCircleIcon } from "@heroicons/react/16/solid";

import Logo from "../../assets/icon.png"
import { useCart } from "../../context/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Header = () => {
  const router = useRouter();
  const { cart } = useCart();
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      const token = sessionStorage.getItem('token');
      setShowLogout(Boolean(token));
    };

    checkToken();
    window.addEventListener('storage', checkToken);

    const originalSetItem = sessionStorage.setItem.bind(sessionStorage);
    sessionStorage.setItem = (key, value) => {
      originalSetItem(key, value);
      if (key === 'token') {
        checkToken();
      }
    };
    return () => {
      window.removeEventListener('storage', checkToken);
      sessionStorage.setItem = originalSetItem;
    };
  }, []);

  return (
    <div id="header">
      <div className="max-w-[1600px] mx-0 my-auto px-0 py-0 w-[100%] fixed top-[0] z-50 bg-white ">
        <div className="w-full flex items-center justify-between py-3 pr-6">
          <Image src={Logo} alt="Logo" width={48} height={96} onClick={() => router.push("/")} className="cursor-pointer	" />
          <div className="flex items-center">
            <button name="shopping cart" aria-label="shopping cart" onClick={() => {
              router.push("/cart")

            }} className="relative ml-2">
              <ShoppingCartIcon className="w-6 h-6 text-primary-color" />
              {cart.length > 0 && (
                <span className="absolute top-[-15px] right-[-10px] bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            <button name="user" aria-label="user" className="mx-6" onClick={() => {
              router.push(showLogout ? "/profile" : "/auth/signin")
            }}  >
              <UserCircleIcon className="w-6 h-6 text-primary-color" />
            </button>
            {showLogout ? <div>
              <button name="power" aria-label="power" className="mt-0.5" onClick={() => {
                sessionStorage.clear()
                localStorage.clear()
                router.push("/")
                setShowLogout(false)
                window.location.reload();
              }}  >
                <PowerIcon className="w-6 h-6 text-primary-color" />
              </button>

            </div> : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
