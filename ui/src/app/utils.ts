// utils/formatCurrency.ts
export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,  
      maximumFractionDigits: 0,  
    }).format(Math.round(value)); 
  };
  