

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
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  
}
