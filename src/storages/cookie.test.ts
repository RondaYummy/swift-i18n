import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setCookie, getCookie } from './cookie';

describe('Cookie Utility Functions', () => {
  beforeEach(() => {
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: '',
    });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('setCookie', () => {
    it('should set a simple cookie with a name, value, and expiration date', () => {
      const now = new Date('2025-08-20T12:00:00Z');
      vi.setSystemTime(now);
      setCookie('testName', 'testValue', 7);
      const expectedExpires = new Date(now.setDate(now.getDate() + 7)).toUTCString();
      expect(document.cookie).toBe(`testName=testValue; expires=${expectedExpires}; path=/; SameSite=Strict`);
    });

    it('should handle special characters in the cookie value', () => {
      const now = new Date('2025-08-20T12:00:00Z');
      vi.setSystemTime(now);
      setCookie('specialCharCookie', 'value with spaces, commas, and; semicolons=', 1);
      const expectedExpires = new Date(now.setDate(now.getDate() + 1)).toUTCString();
      const expectedValue = encodeURIComponent('value with spaces, commas, and; semicolons=');
      expect(document.cookie).toBe(`specialCharCookie=${expectedValue}; expires=${expectedExpires}; path=/; SameSite=Strict`);
    });

    it('should add the Secure attribute for HTTPS protocol', () => {
      const mockLocation = { protocol: 'https:' };
      Object.defineProperty(global, 'location', { value: mockLocation, writable: true });
      setCookie('secureCookie', 'secureValue', 30);
      expect(document.cookie).toContain('; Secure');
    });

    it('should not add the Secure attribute for HTTP protocol', () => {
      const mockLocation = { protocol: 'http:' };
      Object.defineProperty(global, 'location', { value: mockLocation, writable: true });
      setCookie('insecureCookie', 'insecureValue', 30);
      expect(document.cookie).not.toContain('; Secure');
    });
  });

  describe('getCookie', () => {
    it('should return the value of an existing cookie', () => {
      document.cookie = 'testName=testValue; otherName=otherValue';
      const value = getCookie('testName');
      expect(value).toBe('testValue');
    });

    it('should return the correct value when there are multiple cookies', () => {
      document.cookie = 'first=123; second=456; third=789';
      const value = getCookie('second');
      expect(value).toBe('456');
    });

    it('should return null if the cookie does not exist', () => {
      document.cookie = 'name=value';
      const value = getCookie('nonexistent');
      expect(value).toBeNull();
    });

    it('should decode the cookie value correctly', () => {
      document.cookie = 'specialValue=' + encodeURIComponent('value with spaces, commas, and; semicolons=');
      const value = getCookie('specialValue');
      expect(value).toBe('value with spaces, commas, and; semicolons=');
    });

    it('should handle an empty document.cookie string', () => {
      document.cookie = '';
      const value = getCookie('emptyCookie');
      expect(value).toBeNull();
    });
  });
});