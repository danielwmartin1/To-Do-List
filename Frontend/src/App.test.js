import { render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import App from './components/App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders header', () => {
  render(<App />);
  const headerElement = screen.getByText(/header/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders footer', () => {
  render(<App />);
  const footerElement = screen.getByText(/footer/i);
  expect(footerElement).toBeInTheDocument();
});

test('renders list', () => {
  render(<App />);
  const listElement = screen.getByText(/list/i);
  expect(listElement).toBeInTheDocument();
});

test('renders list items', async () => {
  render(<App />);
  const listElement = screen.getByText(/list/i);
  expect(listElement).toBeInTheDocument();

  await waitFor(() => {
    const listItems = screen.getAllByRole('listItem');
    expect(listItems).toHaveLength(3);
  });
});

test('adds a new task', async () => {
  render(<App />);
  const listElement = screen.getByText(/list/i);
  expect(listElement).toBeInTheDocument();

  const newTaskTitle = 'New Task';
  const newTaskDueDate = '2022-12-31';
  user.click(screen.getByRole('button', { name: /add task/i }));
  user.type(screen.getByLabelText(/title/i), newTaskTitle);
  user.type(screen.getByLabelText(/due date/i), newTaskDueDate);
  user.click(screen.getByRole('button', { name: /submit/i }));

  await waitFor(() => {
    const listItems = screen.getAllByRole('listItem');
    expect(listItems).toHaveLength(4);
  });
});

test('updates a task', async () => {
  render(<App />);
  const listElement = screen.getByText(/list/i);
  expect(listElement).toBeInTheDocument();

  await waitFor(() => {
    const listItems = screen.getAllByRole('listItem');
    expect(listItems).toHaveLength(3);
  });

  const updatedTaskTitle = 'Updated Task';
  const updatedTaskDueDate = '2022-12-31';
  user.click(screen.getByRole('button', { name: /edit/i }));
  user.type(screen.getByLabelText(/title/i), updatedTaskTitle);
  user.type(screen.getByLabelText(/due date/i), updatedTaskDueDate);
  user.click(screen.getByRole('button', { name: /submit/i }));

  await waitFor(() => {
    const listItems = screen.getAllByRole('listItem');
    expect(listItems).toHaveLength(3);
  });

  const updatedTask = screen.getByText(updatedTaskTitle);
  expect(updatedTask).toBeInTheDocument();
});

test('toggles task completion', async () => {
  render(<App />);
  const listElement = screen.getByText(/list/i);
  expect(listElement).toBeInTheDocument();

  await waitFor(() => {
    const listItems = screen.getAllByRole('listItem');
    expect(listItems).toHaveLength(3);
  });

  user.click(screen.getByRole('button', { name: /toggle completion/i }));

  await waitFor(() => {
    const completedTasks = screen.getAllByRole('listitem', { name: /completed/i });
    expect(completedTasks).toHaveLength(1);
  });
});

test('deletes a task', async () => {
  render(<App />);
  const listElement = screen.getByText(/list/i);
  expect(listElement).toBeInTheDocument();

  await waitFor(() => {
    const listItems = screen.getAllByRole('listItem');
    expect(listItems).toHaveLength(3);
  });

  user.click(screen.getByRole('button', { name: /delete/i }));

  await waitFor(() => {
    const listItems = screen.getAllByRole('listItem');
    expect(listItems).toHaveLength(2);
  });
});

test('filters tasks by priority', async () => {
  render(<App />);
  const listElement = screen.getByText(/list/i);
  expect(listElement).toBeInTheDocument();

  await waitFor(() => {
    const listItems = screen.getAllByRole('listItem');
    expect(listItems).toHaveLength(3);
  });

  user.click(screen.getByRole('button', { name: /high/i }));

  await waitFor(() => {
    const listItems = screen.getAllByRole('listItem');
    expect(listItems).toHaveLength(1);
  });
});

test('filters tasks by completion', async () => {
  render(<App />);
  const listElement = screen.getByText(/list/i);
  expect(listElement).toBeInTheDocument();

  await waitFor(() => {
    const listItems = screen.getAllByRole('listItem');
    expect(listItems).toHaveLength(3);
  });

  user.click(screen.getByRole('button', { name: /completed/i }));

  await waitFor(() => {
    const listItems = screen.getAllByRole('listItem');
    expect(listItems).toHaveLength(1);
  });
});

test('filters tasks by due date', async () => {
  render(<App />);
  const listElement = screen.getByText(/list/i);
  expect(listElement).toBeInTheDocument();

  await waitFor(() => {
    const listItems = screen.getAllByRole('listItem');
    expect(listItems).toHaveLength(3);
  });

  user.click(screen.getByRole('button', { name: /due date/i }));

  await waitFor(() => {
    const listItems = screen.getAllByRole('listItem');
    expect(listItems).toHaveLength(1);
  });
});

test('filters tasks by search term', async () => {
  render(<App />);
  const listElement = screen.getByText(/list/i);
  expect(listElement).toBeInTheDocument();

  await waitFor(() => {
    const listItems = screen.getAllByRole('listItem');
    expect(listItems).toHaveLength(3);
  });

  user.type(screen.getByRole('textBox'), 'Task 1');

  await waitFor(() => {
    const listItems = screen.getAllByRole('listItem');
    expect(listItems).toHaveLength(1);
  });
});

test('fetches tasks from the server', async () => {
  render(<App />);
  const listElement = screen.getByText(/list/i);
  expect(listElement).toBeInTheDocument();

  await waitFor(() => {
    const listItems = screen.getAllByRole('listItem');
    expect(listItems).toHaveLength(3);
  });
});

test('handles server errors', async () => {
  render(<App />);
  const listElement = screen.getByText(/list/i);
  expect(listElement).toBeInTheDocument();

  await waitFor(() => {
    const listItems = screen.getAllByRole('listItem');
    expect(listItems).toHaveLength(3);
  });

  user.click(screen.getByRole('button', { name: /error/i }));

  await waitFor(() => {
    const errorElement = screen.getByText(/server error/i);
    expect(errorElement).toBeInTheDocument();
  });
});

test('handles network errors', async () => {
  render(<App />);
  const listElement = screen.getByText(/list/i);
  expect(listElement).toBeInTheDocument();

  await waitFor(() => {
    const listItems = screen.getAllByRole('listItem');
    expect(listItems).toHaveLength(3);
  });

  user.click(screen.getByRole('button', { name: /network error/i }));

  await waitFor(() => {
    const errorElement = screen.getByText(/network error/i);
    expect(errorElement).toBeInTheDocument();
  });
}); 
