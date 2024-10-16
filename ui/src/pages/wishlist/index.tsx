import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import WishListItems from "../../components/Wishlist/WishlistItems";

const Wishlist = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log("Token on Wishlist Page:", token); // Debug log
        if (typeof window !== 'undefined' && !token) {
            navigate('/');
        }
    }, [navigate]);

    return (
        <WishListItems />
    )
}

export default Wishlist