import { formatCurrency, formatTimestamp, getOrderStatus } from '../index';

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('formats a number as Indian currency without decimals', () => {
      expect(formatCurrency(1000)).toBe('₹1,000');
      expect(formatCurrency(123456)).toBe('₹1,23,456');
    });

    it('rounds and formats currency correctly', () => {
      expect(formatCurrency(999.5)).toBe('₹1,000');
      expect(formatCurrency(123456.78)).toBe('₹1,23,457');
    });
  });

  describe('formatTimestamp', () => {
    it('formats a timestamp in "DD Mon, HH:MM AM/PM" format', () => {
      const timestamp = '2024-11-06T08:30:00Z';
      expect(formatTimestamp(timestamp)).toBe("Nov 6, 02:00 PM");
    });

    it('handles different times correctly', () => {
      const timestamp = '2024-11-06T20:45:00Z';
      expect(formatTimestamp(timestamp)).toBe("Nov 7, 02:15 AM");
    });
  });

  describe('getOrderStatus', () => {
    const now = new Date();

    it('returns "Processing" for orders within 24 hours', () => {
      const recentOrderTimestamp = new Date(now.getTime() - 23 * 60 * 60 * 1000).toISOString();
      expect(getOrderStatus(recentOrderTimestamp)).toBe('Processing');
    });

    it('returns "Shipped" for orders between 24 and 48 hours', () => {
      const shippedOrderTimestamp = new Date(now.getTime() - 30 * 60 * 60 * 1000).toISOString();
      expect(getOrderStatus(shippedOrderTimestamp)).toBe('Shipped');
    });

    it('returns "Delivered" for orders older than 48 hours', () => {
      const deliveredOrderTimestamp = new Date(now.getTime() - 50 * 60 * 60 * 1000).toISOString();
      expect(getOrderStatus(deliveredOrderTimestamp)).toBe('Delivered');
    });
  });
});
