import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { IProduct } from '../types/Types';
import { API } from '../route/Route';

interface UseProductsReturn {
  products: IProduct[];
  recommend: IProduct[];
  loading: boolean;
  error: string | null;
}

const useProducts = (sortOrder: string = '', searchQuery: string = ''): UseProductsReturn => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [recommend, setRecommend] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API.PRODUCTS.ALL_PRODUCTS, {
        params: { sort: sortOrder, search: searchQuery },
      });
      setProducts(response.data.products);
      setRecommend(response.data.recommend || []);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || 'An error occurred while fetching products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [sortOrder, searchQuery]);

  return {
    products,
    recommend,
    loading,
    error,
  };
};

export default useProducts;
