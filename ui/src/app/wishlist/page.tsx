"use client";

import { useRouter } from "next/navigation";
import WishListItems from "../components/Wishlist/WishlistItems";
import { useEffect } from "react";

const Wishlist = () => {
    const router = useRouter();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (typeof window !== 'undefined' && token) {
            router.push('/');
        }
    }, [router]);


    return (
        <WishListItems />
    )
}

export default Wishlist