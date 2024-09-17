import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ItParkAdminMain from '../components/ItParkAdmin/ItParkAdminMain';

// Utility to render the component with Router
const renderWithRouter = (ui) => {
  return render(<Router>{ui}</Router>);
};

describe('ItParkAdminMain Component', () => {
  test('renders the welcome message', () => {
    renderWithRouter(<ItParkAdminMain />);
    expect(screen.getByText(/Welcome to IT Park Admin Dashboard/i)).toBeInTheDocument();
  });

  test('renders the Company Management card', () => {
    renderWithRouter(<ItParkAdminMain />);
    expect(screen.getByText(/Company Management/i)).toBeInTheDocument();
    expect(screen.getByText(/Manage company profiles, update details, and track performance/i)).toBeInTheDocument();
  });

  test('renders the Employee Management card', () => {
    renderWithRouter(<ItParkAdminMain />);
    expect(screen.getByText(/Employee Management/i)).toBeInTheDocument();
    expect(screen.getByText(/Track employee details, manage roles, and review performance/i)).toBeInTheDocument();
  });

  test('renders the Visit Management card', () => {
    renderWithRouter(<ItParkAdminMain />);
    expect(screen.getByText(/Visit Management/i)).toBeInTheDocument();
    expect(screen.getByText(/Oversee scheduled visits, manage bookings, and ensure smooth operations/i)).toBeInTheDocument();
  });

  test('renders the Generate Custom Passes card', () => {
    renderWithRouter(<ItParkAdminMain />);
    expect(screen.getByText(/Generate Custom Passes for Frequent Visitors/i)).toBeInTheDocument();
  });

  test('navigates to Add Company on button click', () => {
    renderWithRouter(<ItParkAdminMain />);
    fireEvent.click(screen.getByText(/Add Company/i));
    // Add your navigation test here, e.g., verify URL change or component mount
  });

  test('navigates to View All Companies on button click', () => {
    renderWithRouter(<ItParkAdminMain />);
    fireEvent.click(screen.getByText(/View All Companies/i));
    // Add your navigation test here, e.g., verify URL change or component mount
  });

  // Add similar tests for other buttons and links if needed

  test('renders the About Us section', () => {
    renderWithRouter(<ItParkAdminMain />);
    expect(screen.getByText(/About Us/i)).toBeInTheDocument();
    expect(screen.getByText(/Our reception management system is designed to streamline the check-in process and manage visitor requests efficiently./i)).toBeInTheDocument();
  });

  test('renders the footer section', () => {
    renderWithRouter(<ItParkAdminMain />);
    expect(screen.getByText(/© 2024 IT Park Admin Dashboard. All rights reserved./i)).toBeInTheDocument();
  });
});
