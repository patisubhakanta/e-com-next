import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IProduct } from '../types/Types';

// Define the shape of a product in the cart
interface CartItem {
    product: IProduct; // Storing the full product object
    quantity: number;
}

// Define the context type
interface CartContextType {
    cart: CartItem[];
    addToCart: (product: IProduct, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper function to get cart from localStorage
const getCartFromLocalStorage = (): CartItem[] => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
};

// Helper function to save cart to localStorage
const saveCartToLocalStorage = (cart: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

// Create a provider component
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>(getCartFromLocalStorage());

    // Update localStorage whenever the cart changes
    useEffect(() => {
        saveCartToLocalStorage(cart);
    }, [cart]);

    // Add to cart
    const addToCart = (product: IProduct, quantity: number) => {
        setCart((prev) => {
            const existingItem = prev.find(item => item.product._id === product._id);
            if (existingItem) {
                // Update the quantity if the product already exists in the cart
                return prev.map(item =>
                    item.product._id === product._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            // Add new product to the cart
            return [...prev, { product, quantity }];
        });
    };

    // Remove from cart
    const removeFromCart = (productId: string) => {
        setCart((prev) => {
            const existingItem = prev.find(item => item.product._id === productId);
            if (existingItem) {
                if (existingItem.quantity > 1) {
                    // Decrease quantity if more than one
                    return prev.map(item =>
                        item.product._id === productId
                            ? { ...item, quantity: item.quantity - 1 }
                            : item
                    );
                } else {
                    // Remove item if only one left
                    return prev.filter(item => item.product._id !== productId);
                }
            }
            return prev;
        });
    };

    // Clear the entire cart
    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

// Create a custom hook to use the CartContext
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
