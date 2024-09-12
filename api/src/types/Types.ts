export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  inStock: boolean;
  image?: string;
}
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  comparePassword: (candidatePassword: string) => Promise<boolean>; // Method to compare password
}