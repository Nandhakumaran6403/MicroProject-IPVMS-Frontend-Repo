import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import LandingPage from '../components/LandingPage';

// Utility function to render the component with Router
const renderWithRouter = (ui) => {
  return render(<Router>{ui}</Router>);
};

describe('LandingPage Component', () => {
  test('renders the main banner section with welcome text', () => {
    renderWithRouter(<LandingPage />);
    expect(screen.getByText(/Welcome to Nandha IT Park/i)).toBeInTheDocument();
    expect(screen.getByText(/Innovating the Future of Technology/i)).toBeInTheDocument();
  });

  test('renders the navbar with login and QR code buttons', () => {
    renderWithRouter(<LandingPage />);
    expect(screen.getByText(/SCAN For Register/i)).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  test('navigates to /login when Login button is clicked', () => {
    const { container } = renderWithRouter(<LandingPage />);
    fireEvent.click(screen.getByText(/Login/i));
    // You would need to mock navigation to verify the action
    // For example, you can use jest to mock useNavigate and assert its call
  });

  test('navigates to /qrcodeforvisitor when QR code button is clicked', () => {
    const { container } = renderWithRouter(<LandingPage />);
    fireEvent.click(screen.getByText(/SCAN For Register/i));
    // You would need to mock navigation to verify the action
    // For example, you can use jest to mock useNavigate and assert its call
  });
  
  test('renders the About Us section', () => {
    renderWithRouter(<LandingPage />);
    expect(screen.getByText(/About Us/i)).toBeInTheDocument();
    expect(screen.getByText(/Nandha IT Park is dedicated to fostering innovation and technology excellence./i)).toBeInTheDocument();
  });

  test('renders the footer with copyright text', () => {
    renderWithRouter(<LandingPage />);
    expect(screen.getByText(/©/i)).toBeInTheDocument(); // Check for the presence of copyright symbol
    expect(screen.getByText(/Nandha IT Park. All rights reserved./i)).toBeInTheDocument();
  });

  // Optional: Test Carousel functionality
  test('carousel changes slides on next/prev buttons click', () => {
    renderWithRouter(<LandingPage />);
    const prevButton = screen.getByLabelText(/Previous Slide/i);
    const nextButton = screen.getByLabelText(/Next Slide/i);
    
  });
});
