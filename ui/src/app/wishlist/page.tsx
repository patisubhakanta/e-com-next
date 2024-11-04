"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import withAuth from "../auth/withAuth";
import WishListItems from "@/components/wishlistComponents/WishlistItems";


const Wishlist = () => {
    const router = useRouter();
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (typeof window !== 'undefined' && !token) {
            router.push('/');
        }
    }, [router]);

    return (
        <WishListItems />
    )
}

export default withAuth(Wishlist)