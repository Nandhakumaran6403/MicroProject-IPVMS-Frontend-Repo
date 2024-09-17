// src/__tests__/ReceptionistRoam.test.js
import React from 'react';
import ReceptionistRoam from '../components/Receptionists/ReceptionistRoam';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

// Mocking react-router-dom Link component
jest.mock('react-router-dom', () => ({
  Link: ({ children }) => children,
}));

describe('ReceptionistRoam', () => {
  test('renders carousel banners with correct texts', () => {
    render(<ReceptionistRoam />);

    // Check if the carousel banners are rendered with the correct texts
    expect(screen.getByText('Welcome to the Receptionist Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Streamline Your Workflow')).toBeInTheDocument();
    expect(screen.getByText('Enhanced Efficiency')).toBeInTheDocument();
  });

  test('renders QR Code Scanner button with correct text and icon', () => {
    render(<ReceptionistRoam />);

    // Check if the QR Code Scanner button is rendered with the correct text
    const buttonText = screen.getByText('QR Code Scanner for Roam');
    expect(buttonText).toBeInTheDocument();

    // Check if the icon is rendered
    const icon = screen.getByRole('img', { name: /qrcode/i });
    expect(icon).toBeInTheDocument();
  });

  test('renders text content with images', () => {
    render(<ReceptionistRoam />);

    // Check if the text content with images is rendered
    expect(screen.getByText('Comprehensive Dashboard Overview')).toBeInTheDocument();
    expect(screen.getByText('Enhanced Security and User Experience')).toBeInTheDocument();
  });

  test('renders the About Us section', () => {
    render(<ReceptionistRoam />);

    // Check if the About Us section is rendered with the correct content
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Our reception management system is designed to streamline the check-in process and manage visitor requests efficiently.')).toBeInTheDocument();
  });

  test('renders the footer', () => {
    render(<ReceptionistRoam />);

    // Check if the footer is rendered
    expect(screen.getByText('© 2024 Nandha It Park. All rights reserved.')).toBeInTheDocument();
  });
});
