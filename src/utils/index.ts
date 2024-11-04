
export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,  
      maximumFractionDigits: 0,  
    }).format(Math.round(value)); 
  };
  
  export const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleString('en-US', options);
};

export const getOrderStatus = (timestamp: string): string => {
  const now = new Date();
  const orderDate = new Date(timestamp);
  const timeDifference = now.getTime() - orderDate.getTime();
  const hoursDifference = timeDifference / (1000 * 60 * 60);
  if (hoursDifference < 24) {
      return 'Processing';
  } else if (hoursDifference >= 24 && hoursDifference <= 48) {
      return 'Shipped';
  } else {
      return 'Delivered';
  }
};
