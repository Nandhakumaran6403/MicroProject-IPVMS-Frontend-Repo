// src/__tests__/ReceptionistOffice.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ReceptionistOffice from '../components/Receptionists/ReceptionistOffice';

// Mocking react-router-dom Link component
jest.mock('react-router-dom', () => ({
  Link: ({ children }) => children,
}));

describe('ReceptionistOffice', () => {
  test('renders carousel banners with correct texts', () => {
    render(<ReceptionistOffice />);

    // Check if the carousel banners are rendered with the correct texts
    expect(screen.getByText('Welcome to the Receptionist Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Streamline Your Workflow')).toBeInTheDocument();
    expect(screen.getByText('Enhanced Efficiency')).toBeInTheDocument();
  });

  test('renders the buttons with correct texts', () => {
    render(<ReceptionistOffice />);

    // Check if the buttons are rendered with the correct texts
    expect(screen.getByText('View All Today Appointments')).toBeInTheDocument();
    expect(screen.getByText('QR Code Scanner for Office')).toBeInTheDocument();
  });

  test('renders text content with images', () => {
    render(<ReceptionistOffice />);

    // Check if the text content with images is rendered
    expect(screen.getByText('Comprehensive Dashboard Overview')).toBeInTheDocument();
    expect(screen.getByText('Enhanced Security and User Experience')).toBeInTheDocument();
  });

  test('renders the About Us section', () => {
    render(<ReceptionistOffice />);

    // Check if the About Us section is rendered
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Our reception management system is designed to streamline the check-in process and manage visitor requests efficiently.')).toBeInTheDocument();
  });

  test('renders the footer', () => {
    render(<ReceptionistOffice />);

    // Check if the footer is rendered
    expect(screen.getByText('© 2024 Nandha It Park. All rights reserved.')).toBeInTheDocument();
  });
});
