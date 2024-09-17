// src/__tests__/ReceptionistMain.test.js
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ReceptionistMain from '../components/Receptionists/ReceptionistMain';

// Mocking react-router-dom Link component
jest.mock('react-router-dom', () => ({
  Link: ({ children }) => children,
}));

describe('ReceptionistMain', () => {
  test('renders carousel banners', () => {
    render(<ReceptionistMain />);

    // Check if the carousel banners are rendered
    expect(screen.getByText('Welcome to the Receptionist Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Streamline Your Workflow')).toBeInTheDocument();
    expect(screen.getByText('Enhanced Efficiency')).toBeInTheDocument();
  });

  test('renders the appointment and visitor request buttons', () => {
    render(<ReceptionistMain />);

    // Check if the buttons are rendered with the correct texts
    const appointmentButton = screen.getByText('View All Today Appointments');
    const visitorRequestButton = screen.getByText('View All Visitor Requests Today');
    const addVisitorButton = screen.getByText('Add Visitor Request');
    const qrCodeScannerButton = screen.getByText('QR Code Scanner for Checkin and Checkout');

    expect(appointmentButton).toBeInTheDocument();
    expect(visitorRequestButton).toBeInTheDocument();
    expect(addVisitorButton).toBeInTheDocument();
    expect(qrCodeScannerButton).toBeInTheDocument();
  });

  test('renders the text content with images', () => {
    render(<ReceptionistMain />);

    // Check if the text content with images is rendered
    expect(screen.getByText('Comprehensive Dashboard Overview')).toBeInTheDocument();
    expect(screen.getByText('Enhanced Security and User Experience')).toBeInTheDocument();
  });

  test('renders the About Us section', () => {
    render(<ReceptionistMain />);

    // Check if the About Us section is rendered
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Our reception management system is designed to streamline the check-in process and manage visitor requests efficiently.')).toBeInTheDocument();
  });

  test('renders the footer', () => {
    render(<ReceptionistMain />);

    // Check if the footer is rendered
    expect(screen.getByText('© 2024 Nandha It Park. All rights reserved.')).toBeInTheDocument();
  });
});
