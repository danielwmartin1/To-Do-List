// Frontend/src/components/List.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import List from './List';
import '@testing-library/jest-dom';

jest.mock('axios');

describe('List Component', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: [] });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<List />);
    expect(screen.getByText('Add Task')).toBeInTheDocument();
  });

  test('initial state values', () => {
    render(<List />);
    expect(screen.getByPlaceholderText('Add a new task').value).toBe('');
    expect(screen.getByText('Add Task')).toBeInTheDocument();
  });

  test('fetches and displays tasks', async () => {
    const tasks = [
      { _id: '1', title: 'Test Task', dueDate: '2023-12-31', priority: 'Low', completed: false, createdAt: '2023-01-01', updatedAt: '2023-01-01' }
    ];
    axios.get.mockResolvedValueOnce({ data: tasks });

    render(<List />);
    expect(await screen.findByText('Test Task')).toBeInTheDocument();
  });

  test('adds a new task', async () => {
    axios.post.mockResolvedValueOnce({
      data: { _id: '2', title: 'New Task', dueDate: '2023-12-31', priority: 'Low', completed: false, createdAt: '2023-01-01', updatedAt: '2023-01-01' }
    });
    render(<List />);
    fireEvent.change(screen.getByPlaceholderText('Add a new task'), { target: { value: 'New Task' } });
    fireEvent.change(screen.getByLabelText('Due Date'), { target: { value: '2023-12-31' } });
    fireEvent.click(screen.getByText('Add Task'));

    expect(await screen.findByText('New Task')).toBeInTheDocument();
  });

  test('edits an existing task', async () => {
    const tasks = [
      { _id: '1', title: 'Test Task', dueDate: '2023-12-31', priority: 'Low', completed: false, createdAt: '2023-01-01', updatedAt: '2023-01-01' }
    ];
    axios.get.mockResolvedValueOnce({ data: tasks });
    axios.put.mockResolvedValueOnce({
      data: { _id: '1', title: 'Updated Task', dueDate: '2023-12-31', priority: 'Low', completed: false, createdAt: '2023-01-01', updatedAt: '2023-01-01' }
    });
    render(<List />);
    fireEvent.change(screen.getByDisplayValue('Test Task'), { target: { value: 'Updated Task' } });
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    expect(await screen.findByText('Updated Task')).toBeInTheDocument();
  });

  test('toggles task completion status', async () => {
    const tasks = [
      { _id: '1', title: 'Test Task', dueDate: '2023-12-31', priority: 'Low', completed: false, createdAt: '2023-01-01', updatedAt: '2023-01-01' }
    ];
    axios.get.mockResolvedValueOnce({ data: tasks });
    axios.patch.mockResolvedValueOnce({
      data: { _id: '1', title: 'Test Task', dueDate: '2023-12-31', priority: 'Low', completed: true, createdAt: '2023-01-01', updatedAt: '2023-01-01' }
    });
    render(<List />);
    fireEvent.click(screen.getByRole('checkbox', { name: /Test Task/i }));
    await waitFor(() => expect(screen.getByRole('checkbox', { name: /Test Task/i })).toBeChecked());
    fireEvent.click(screen.getByRole('checkbox', { name: /Test Task/i }));
    await waitFor(() => expect(screen.getByRole('checkbox', { name: /Test Task/i })).not.toBeChecked());
  });

  test('removes a task', async () => {
    const tasks = [
      { _id: '1', title: 'Test Task', dueDate: '2023-12-31', priority: 'Low', completed: false, createdAt: '2023-01-01', updatedAt: '2023-01-01' }
    ];
    axios.get.mockResolvedValueOnce({ data: tasks });
    axios.delete.mockResolvedValueOnce({});
    
    render(<List />);
    
    expect(await screen.findByText('Test Task')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));
    await waitFor(() => expect(screen.queryByText('Test Task')).not.toBeInTheDocument());
  });

  test('sorts and filters tasks', async () => {
    const tasks = [
      { _id: '1', title: 'Test Task 1', dueDate: '2023-12-31', priority: 'Low', completed: false, createdAt: '2023-01-01', updatedAt: '2023-01-01' },
      { _id: '2', title: 'Test Task 2', dueDate: '2023-12-31', priority: 'High', completed: true, createdAt: '2023-01-01', updatedAt: '2023-01-01' }
    ];
    axios.get.mockResolvedValueOnce({ data: tasks });

    render(<List />);
    expect(await screen.findByText('Test Task 1')).toBeInTheDocument();
    expect(await screen.findByText('Test Task 2')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Sort by:'), { target: { value: 'priority-desc' } });
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Filter by:'), { target: { value: 'completed' } });
    expect(screen.queryByText('Test Task 1')).not.toBeInTheDocument();
  });

  test('sorts tasks by created date ascending', async () => {
    const tasks = [
      { _id: '1', title: 'Task 1', dueDate: '2023-12-31', priority: 'Low', completed: false, createdAt: '2023-01-01', updatedAt: '2023-01-01' },
      { _id: '2', title: 'Task 2', dueDate: '2023-12-31', priority: 'High', completed: true, createdAt: '2023-01-02', updatedAt: '2023-01-02' }
    ];
    axios.get.mockResolvedValueOnce({ data: tasks });

    render(<List />);
    expect(await screen.findByText('Task 1')).toBeInTheDocument();
    expect(await screen.findByText('Task 2')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Sort by:'), { target: { value: 'createdAt-asc' } });
    const sortedTasks = screen.getAllByText(/Task/);
    expect(sortedTasks[0]).toHaveTextContent('Task 1');
    expect(sortedTasks[1]).toHaveTextContent('Task 2');
  });

  test('filters tasks by incomplete status', async () => {
    const tasks = [
      { _id: '1', title: 'Task 1', dueDate: '2023-12-31', priority: 'Low', completed: false, createdAt: '2023-01-01', updatedAt: '2023-01-01' },
      { _id: '2', title: 'Task 2', dueDate: '2023-12-31', priority: 'High', completed: true, createdAt: '2023-01-02', updatedAt: '2023-01-02' }
    ];
    axios.get.mockResolvedValueOnce({ data: tasks });

    render(<List />);
    expect(await screen.findByText('Task 1')).toBeInTheDocument();
    expect(await screen.findByText('Task 2')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Filter by:'), { target: { value: 'incomplete' } });
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
  });
});
