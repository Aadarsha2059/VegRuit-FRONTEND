import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import Hero from '../src/components/Hero';

// Wrapper for components that need Router
const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Component Tests', () => {
  
  // Test 1: Header Component Renders
  it('Should render Header component', () => {
    render(
      <RouterWrapper>
        <Header user={null} onLogout={() => {}} onAuthClick={() => {}} />
      </RouterWrapper>
    );
    expect(screen.getByText(/VegRuit/i)).toBeInTheDocument();
  });

  // Test 2: Header Shows User Name When Logged In
  it('Should display user name when logged in', () => {
    const user = { firstName: 'John', lastName: 'Doe' };
    render(
      <RouterWrapper>
        <Header user={user} onLogout={() => {}} onAuthClick={() => {}} />
      </RouterWrapper>
    );
    expect(screen.getByText(/John/i)).toBeInTheDocument();
  });

  // Test 3: Footer Component Renders
  it('Should render Footer component', () => {
    render(
      <RouterWrapper>
        <Footer />
      </RouterWrapper>
    );
    expect(screen.getByText(/VegRuit/i)).toBeInTheDocument();
  });

  // Test 4: Footer Contains Social Links
  it('Should contain social media links in footer', () => {
    render(
      <RouterWrapper>
        <Footer />
      </RouterWrapper>
    );
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  // Test 5: Hero Component Renders
  it('Should render Hero component', () => {
    render(
      <RouterWrapper>
        <Hero />
      </RouterWrapper>
    );
    expect(screen.getByText(/Farm-Fresh/i)).toBeInTheDocument();
  });

  // Test 6: Hero Contains CTA Buttons
  it('Should contain call-to-action buttons in Hero', () => {
    render(
      <RouterWrapper>
        <Hero />
      </RouterWrapper>
    );
    const buttons = screen.getAllByRole('link');
    expect(buttons.length).toBeGreaterThan(0);
  });

  // Test 7: Header Logout Button Click
  it('Should call onLogout when logout button is clicked', () => {
    const mockLogout = vi.fn();
    const user = { firstName: 'John', userType: 'buyer' };
    
    render(
      <RouterWrapper>
        <Header user={user} onLogout={mockLogout} onAuthClick={() => {}} />
      </RouterWrapper>
    );
    
    const logoutButton = screen.getByText(/Logout/i);
    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalled();
  });

  // Test 8: Navigation Links Present
  it('Should have navigation links in header', () => {
    render(
      <RouterWrapper>
        <Header user={null} onLogout={() => {}} onAuthClick={() => {}} />
      </RouterWrapper>
    );
    
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Explore/i)).toBeInTheDocument();
    expect(screen.getByText(/About/i)).toBeInTheDocument();
  });

});
