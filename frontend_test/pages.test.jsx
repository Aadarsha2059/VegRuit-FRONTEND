import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AboutPage from '../src/pages/AboutPage';
import ContactPage from '../src/pages/ContactPage';
import ExplorePage from '../src/pages/ExplorePage';

const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Page Tests', () => {
  
  // Test 16: About Page Renders
  it('Should render About page', () => {
    render(
      <RouterWrapper>
        <AboutPage />
      </RouterWrapper>
    );
    
    expect(screen.getByText(/About/i)).toBeInTheDocument();
  });

  // Test 17: Contact Page Renders
  it('Should render Contact page', () => {
    render(
      <RouterWrapper>
        <ContactPage />
      </RouterWrapper>
    );
    
    expect(screen.getByText(/Contact/i)).toBeInTheDocument();
  });

  // Test 18: Explore Page Renders
  it('Should render Explore page', () => {
    render(
      <RouterWrapper>
        <ExplorePage />
      </RouterWrapper>
    );
    
    expect(screen.getByText(/Browse/i)).toBeInTheDocument();
  });

  // Test 19: About Page Contains Content
  it('Should contain story content in About page', () => {
    render(
      <RouterWrapper>
        <AboutPage />
      </RouterWrapper>
    );
    
    const content = screen.getByText(/Our Story/i);
    expect(content).toBeInTheDocument();
  });

  // Test 20: Contact Page Has Form
  it('Should have contact form in Contact page', () => {
    render(
      <RouterWrapper>
        <ContactPage />
      </RouterWrapper>
    );
    
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  });

  // Test 21: Explore Page Has Categories
  it('Should display product categories in Explore page', () => {
    render(
      <RouterWrapper>
        <ExplorePage />
      </RouterWrapper>
    );
    
    expect(screen.getByText(/All Products/i)).toBeInTheDocument();
  });

  // Test 22: Pages Have Back Button
  it('Should have back button in About page', () => {
    render(
      <RouterWrapper>
        <AboutPage />
      </RouterWrapper>
    );
    
    const backButton = screen.getByRole('link', { name: /Back/i });
    expect(backButton).toBeInTheDocument();
  });

});
