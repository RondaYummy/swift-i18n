import { describe, it, expect } from 'vitest';
import { formatNumber, formatCurrency, formatUnit, formatDate, formatRelativeTime } from './formats';

describe('Formatting Utility Functions', () => {
  describe('formatNumber', () => {
    it('should format a number with the specified locale', () => {
      const result = formatNumber(12345.67, 'de-DE');
      expect(result).toBe('12.345,67');
    });

    it('should apply custom options for formatting', () => {
      const result = formatNumber(9876543, 'en-US', { notation: 'compact' });
      expect(result).toBe('9.9M');
    });

    it('should handle decimal places with options', () => {
      const result = formatNumber(1234.5678, 'en-US', { maximumFractionDigits: 2 });
      expect(result).toBe('1,234.57');
    });
  });

  describe('formatCurrency', () => {
    it('should format a number as currency with the correct locale and currency symbol', () => {
      const result = formatCurrency(1234.5, 'EUR', 'de-DE');
      expect(result).toBe('1.234,50 €');
    });

    it('should apply custom options while formatting currency', () => {
      const result = formatCurrency(50000, 'USD', 'en-US', { currencyDisplay: 'code' });
      expect(result).toBe('USD 50,000.00');
    });

    it('should format currency for different locales', () => {
      const result = formatCurrency(99.99, 'JPY', 'ja-JP');
      expect(result).toBe('￥100');
    });
  });

  describe('formatUnit', () => {
    it('should format a number with the specified unit', () => {
      const result = formatUnit(50, 'meter', 'en-US');
      expect(result).toBe('50 m');
    });

    it('should format a unit for a different locale', () => {
      const result = formatUnit(1000, 'kilometer', 'de-DE');
      expect(result).toBe('1.000 km');
    });
  });

  describe('formatDate', () => {
    it('should format a Date object with the specified locale', () => {
      const date = new Date(2025, 1, 20);
      const result = formatDate(date, 'en-US');
      expect(result).toBe('2/20/2025');
    });

    it('should format a timestamp with the specified locale', () => {
      const timestamp = new Date(2025, 1, 20).getTime();
      const result = formatDate(timestamp, 'en-US');
      expect(result).toBe('2/20/2025');
    });

    it('should apply custom options for date formatting', () => {
      const date = new Date(2025, 1, 20, 15, 30);
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      };
      const result = formatDate(date, 'en-US', options);
      expect(result).toBe('February 20, 2025 at 03:30 PM');
    });
  });

  describe('formatRelativeTime', () => {
    it('should format relative time in the past', () => {
      const result = formatRelativeTime(-1, 'day', 'en-US');
      expect(result).toBe('yesterday');
    });

    it('should format relative time in the future', () => {
      const result = formatRelativeTime(5, 'hour', 'en-US');
      expect(result).toBe('in 5 hours');
    });

    it('should format relative time for different units', () => {
      let result = formatRelativeTime(-2, 'month', 'en-US');
      expect(result).toBe('2 months ago');
      result = formatRelativeTime(3, 'year', 'en-US');
      expect(result).toBe('in 3 years');
    });
  });
});