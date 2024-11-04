

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  inStock: boolean;
  image?: string;
  _id:string
}
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  createdAt:any;
}

export interface IOrderItem {
  productId: string;
  qty: number;
  price: number;
}

export interface IOrder extends Document {
  userId: string; 
  items: {
    timestamp: Date; 
    orders: IOrderItem[];
  }[];
}
export interface IWishlist {
  userId: string;
  orders: {productId:string}[];
}