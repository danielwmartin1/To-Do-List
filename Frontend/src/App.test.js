import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import user from '@testing-library/user-event';
import axios from 'axios';
import List from './components/List.jsx';

jest.mock('axios');

test('renders learn react link', () => {
  render(<List />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders header', () => {
  render(<List />);
  const headerElement = screen.getByText(/header/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders footer', () => {
  render(<List />);
  const footerElement = screen.getByText(/footer/i);
  expect(footerElement).toBeInTheDocument();
});

test('renders list', () => {
  render(<List />);
  const listElement = screen.getByText(/list/i);
  expect(listElement).toBeInTheDocument();
});

test('renders list items', async () => {
  render(<List />);
  const listElement = screen.getByText(/list/i);
  expect(listElement).toBeInTheDocument();

  await waitFor(() => {
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
  });
});

test('adds a new task', async () => {
  render(<List />);
  const listElement = screen.getByText(/list/i);
  expect(listElement).toBeInTheDocument();

  const newTaskTitle = 'New Task';
  const newTaskDueDate = '2022-12-31';
  user.click(screen.getByRole('button', { name: /add task/i }));
  user.type(screen.getByLabelText(/title/i), newTaskTitle);
  user.type(screen.getByLabelText(/due date/i), newTaskDueDate);
  user.click(screen.getByRole('button', { name: /submit/i }));

  await waitFor(() => {
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(4);
  });
});

// Continue fixing the rest of the tests similarly...
