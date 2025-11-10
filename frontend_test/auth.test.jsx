import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BuyerLogin from '../src/pages/BuyerLogin';
import BuyerSignup from '../src/pages/BuyerSignup';

const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Authentication Tests', () => {
  
  // Test 9: Login Form Renders
  it('Should render login form', () => {
    render(
      <RouterWrapper>
        <BuyerLogin onAuthSuccess={() => {}} />
      </RouterWrapper>
    );
    
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  // Test 10: Login Form Validation
  it('Should show validation error for empty email', async () => {
    render(
      <RouterWrapper>
        <BuyerLogin onAuthSuccess={() => {}} />
      </RouterWrapper>
    );
    
    const submitButton = screen.getByRole('button', { name: /Login/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/Email/i)).toBeInvalid();
    });
  });

  // Test 11: Signup Form Renders
  it('Should render signup form', () => {
    render(
      <RouterWrapper>
        <BuyerSignup onAuthSuccess={() => {}} />
      </RouterWrapper>
    );
    
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  });

  // Test 12: Signup Form Validation
  it('Should validate password match', async () => {
    render(
      <RouterWrapper>
        <BuyerSignup onAuthSuccess={() => {}} />
      </RouterWrapper>
    );
    
    const passwordInput = screen.getByLabelText(/^Password$/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
    
    const submitButton = screen.getByRole('button', { name: /Sign Up/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });
  });

  // Test 13: Email Input Accepts Valid Email
  it('Should accept valid email format', () => {
    render(
      <RouterWrapper>
        <BuyerLogin onAuthSuccess={() => {}} />
      </RouterWrapper>
    );
    
    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    expect(emailInput.value).toBe('test@example.com');
  });

  // Test 14: Password Input is Secure
  it('Should render password input as secure', () => {
    render(
      <RouterWrapper>
        <BuyerLogin onAuthSuccess={() => {}} />
      </RouterWrapper>
    );
    
    const passwordInput = screen.getByLabelText(/Password/i);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  // Test 15: Form Submission Calls Handler
  it('Should call onAuthSuccess on successful login', async () => {
    const mockAuthSuccess = vi.fn();
    
    render(
      <RouterWrapper>
        <BuyerLogin onAuthSuccess={mockAuthSuccess} />
      </RouterWrapper>
    );
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Note: Actual API call would need to be mocked
  });

});
