"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IProduct } from '../types/Types';
import { addItemsToCart, removeItemFromCart } from '@/service/cartService';


interface CartItem {
    product: IProduct;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: IProduct, quantity: number, isSignIn?: boolean) => void;
    removeFromCart: (productId: string,isOrder?:boolean) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const isBrowser = typeof window !== 'undefined';

const getCartFromLocalStorage = (): CartItem[] => {
    if (!isBrowser) return []; 
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
};

const saveCartToLocalStorage = (cart: CartItem[]) => {
    if (isBrowser) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>(getCartFromLocalStorage);

    useEffect(() => {
        // Initialize cart from localStorage on component mount
        if (isBrowser) {
            setCart(getCartFromLocalStorage());
        }
    }, []);

    useEffect(() => {
        // Save cart to localStorage whenever cart changes
        saveCartToLocalStorage(cart);
    }, [cart]);

    const addToCart = async (product: IProduct, quantity: number, isSignIn?: boolean) => {
        const token = sessionStorage.getItem('token');
        const existingItem = cart.find(item => item.product._id === product._id);

        if (token && !isSignIn) {
            try {
                await addItemsToCart([{
                    productId: product._id,
                    quantity: Number(existingItem?.quantity) ?Number(existingItem?.quantity)   + 1 : 1
                }]);
            } catch (error) {
                console.error('Error adding item to server cart:', error);
            }
        }

        setCart((prev) => {
            const existingItem = prev.find(item => item.product._id === product._id);
            if (existingItem) {
                return prev.map(item =>
                    item.product._id === product._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { product, quantity }];
        });
    };

    const removeFromCart = async (productId: string,isOrder?:boolean) => {
        const token = sessionStorage.getItem('token');
        if (token && !isOrder) {
            try {
                await removeItemFromCart(productId);
            } catch (error) {
                console.error('Error removing item from server cart:', error);
            }
        }

        setCart((prev) => {
            const existingItem = prev.find(item => item.product._id === productId);
            if (existingItem) {
                if (existingItem.quantity > 1) {
                    return prev.map(item =>
                        item.product._id === productId
                            ? { ...item, quantity: item.quantity - 1 }
                            : item
                    );
                } else {
                    return prev.filter(item => item.product._id !== productId);
                }
            }
            return prev;
        });
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
