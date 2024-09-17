// src/__tests__/NotFound.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import NotFound from '../components/NotFound';

describe('NotFound Component', () => {
  test('renders the 404 error code', () => {
    render(<NotFound />);

    expect(screen.getByText(/404/i)).toBeInTheDocument();
  });

  test('renders the "Page not found" heading', () => {
    render(<NotFound />);

    expect(screen.getByText(/Page not found/i)).toBeInTheDocument();
  });

  test('renders the error message text', () => {
    render(<NotFound />);

    expect(screen.getByText(/Sorry, we couldn’t find the page you’re looking for./i)).toBeInTheDocument();
  });

  test('renders the "Go back home" button', () => {
    render(<NotFound />);

    expect(screen.getByText(/Go back home/i)).toBeInTheDocument();
  });

  test('renders the "Contact support" link', () => {
    render(<NotFound />);

    expect(screen.getByText(/Contact support/i)).toBeInTheDocument();
  });
});
