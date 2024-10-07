import { useEffect, useState } from 'react';
import axios from 'axios';
import { IProduct } from '../types/Types';
import { API } from '../route/Route';

// Custom hook to handle fetching and sorting products
const useProducts = (sortOrder: string = '') => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all products using Axios, with optional sorting
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API.PRODUCTS.ALL_PRODUCTS, {
        params: { sort: sortOrder },
      });
      setProducts(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [sortOrder]); // Fetch products again whenever sortOrder changes

  return {
    products,
    loading,
    error,
  };
};

export default useProducts;
