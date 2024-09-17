// AdminMain.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom'; // Wrap component in Router for navigation
import AdminMain from '../components/Admin/AdminMain';

describe('AdminMain Component', () => {
  test('renders the header with the correct text', () => {
    render(
      <Router>
        <AdminMain />
      </Router>
    );
    expect(screen.getByText(/Administrative Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Manage and oversee all administrative activities/i)).toBeInTheDocument();
  });

  test('renders the image placeholders', () => {
    render(
      <Router>
        <AdminMain />
      </Router>
    );
    const images = screen.getAllByAltText(/Company Overview/i);
    expect(images.length).toBe(4); // Ensure there are 4 images
  });

  test('renders the "Add Administrative User" button', () => {
    render(
      <Router>
        <AdminMain />
      </Router>
    );
    const addButton = screen.getByRole('button', { name: /Add Administrative User/i });
    expect(addButton).toBeInTheDocument();
  });

  test('renders the "View All Administrative Users" button', () => {
    render(
      <Router>
        <AdminMain />
      </Router>
    );
    const viewAllButton = screen.getByRole('button', { name: /View All Administrative Users/i });
    expect(viewAllButton).toBeInTheDocument();
  });

  test('navigates to /adminuseradd on "Add Administrative User" button click', () => {
    render(
      <Router>
        <AdminMain />
      </Router>
    );
    const addButton = screen.getByRole('button', { name: /Add Administrative User/i });
    fireEvent.click(addButton);
    expect(window.location.pathname).toBe('/adminuseradd'); // Assuming this is how navigation is tested
  });

  test('navigates to /adminuserviewall on "View All Administrative Users" button click', () => {
    render(
      <Router>
        <AdminMain />
      </Router>
    );
    const viewAllButton = screen.getByRole('button', { name: /View All Administrative Users/i });
    fireEvent.click(viewAllButton);
    expect(window.location.pathname).toBe('/adminuserviewall'); // Assuming this is how navigation is tested
  });
});
