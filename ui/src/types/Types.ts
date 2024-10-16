export interface IProduct  {
  name: string;
  description?: string;
  price: number;
  inStock: boolean;
  image?: string;
  _id:string;
  qty?:number
}

export interface IUser  {
  username: string;
  email: string;
  password: string; 
}

export interface WishlistContextType {
  wishlist: string[]; // Array of product IDs
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  setWishlist: (wishlistArray: string[]) => void;
}

export interface WishlistItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  inStock: boolean;
  image?: string;
}

export interface UseWishlistResult {
  wishlist: WishlistItem[] | null;
  loading: boolean;
  error: string | null;
}

export interface RemoveWishlistItemResponse {
  success: boolean;
  message: string;
}
