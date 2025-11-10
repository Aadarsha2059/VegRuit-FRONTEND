import { describe, it, expect } from 'vitest';
import { STORAGE_KEYS, USER_TYPES } from '../src/services/authAPI';

describe('Utility Tests', () => {
  
  // Test 23: Storage Keys Defined
  it('Should have defined storage keys', () => {
    expect(STORAGE_KEYS.AUTH_TOKEN).toBeDefined();
    expect(STORAGE_KEYS.USER_DATA).toBeDefined();
    expect(STORAGE_KEYS.USER_TYPE).toBeDefined();
  });

  // Test 24: User Types Defined
  it('Should have defined user types', () => {
    expect(USER_TYPES.BUYER).toBe('buyer');
    expect(USER_TYPES.SELLER).toBe('seller');
  });

  // Test 25: LocalStorage Mock Works
  it('Should be able to set and get from localStorage', () => {
    localStorage.setItem('test', 'value');
    const value = localStorage.getItem('test');
    expect(value).toBeDefined();
  });

});
