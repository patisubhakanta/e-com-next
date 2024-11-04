"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WishlistContextType } from '../types/Types';

// Create the context
const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// Helper function to get wishlist from localStorage
const getWishlistFromLocalStorage = (): string[] => {
    if (typeof window !== 'undefined') { // Check if running in the browser
        const storedWishlist = localStorage.getItem('wishlist');
        return storedWishlist ? JSON.parse(storedWishlist) : [];
    }
    return []; // Return an empty array if not in the browser
};

// Helper function to save wishlist to localStorage
const saveWishlistToLocalStorage = (wishlist: string[]) => {
    if (typeof window !== 'undefined') { // Check if running in the browser
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
};

// Create a provider component
export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [wishlist, setWishlistState] = useState<string[]>(getWishlistFromLocalStorage());

    // Update localStorage whenever the wishlist changes
    useEffect(() => {
        saveWishlistToLocalStorage(wishlist);
    }, [wishlist]);

    // Add a product ID to the wishlist
    const addToWishlist = async (productId: string) => {
        setWishlistState((prev) => {
            if (!prev.includes(productId)) {
                return [...prev, productId];
            }
            return prev; // If product is already in wishlist, do nothing
        });
    };

    // Remove a product ID from the wishlist
    const removeFromWishlist = (productId: string) => {
        setWishlistState((prev) => prev.filter(id => id !== productId));
    };

    // Replace the entire wishlist (for example, when fetching from API)
    const setWishlist = (wishlistArray: string[]) => {
        setWishlistState(wishlistArray);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, setWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

// Create a custom hook to use the WishlistContext
export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
