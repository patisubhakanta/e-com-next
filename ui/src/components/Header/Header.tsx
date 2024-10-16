
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {  PowerIcon, ShoppingCartIcon, UserCircleIcon } from "@heroicons/react/16/solid";

import Logo from "../../assets/icon.png"
import { useCart } from "../../context/CartContext";

const Header = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
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
        <img src={Logo} alt="Logo" width={48} height={96} onClick={() => navigate("/")} className="cursor-pointer	" />
        <div className="flex items-center">
          <button onClick={() => {
            navigate("/cart")

          }} className="relative ml-2">
            <ShoppingCartIcon className="w-6 h-6 text-primary-color" />
            {cart.length > 0 && (
              <span className="absolute top-[-15px] right-[-10px] bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
          <button className="mx-6" onClick={() => {
            navigate(showLogout ? "/profile" : "/login")
          }}  >
            <UserCircleIcon className="w-6 h-6 text-primary-color" />
          </button>
          {showLogout ? <div>
            <button className="ml-2" onClick={() => {
              localStorage.clear()
              navigate("/")
              setShowLogout(false)
              window.location.reload();
            }}  >
              <PowerIcon className="w-6 h-6 text-primary-color" />
            </button>
           
          </div> : null}
        </div>
      </div>
    </div>
  );
};

export default Header;
