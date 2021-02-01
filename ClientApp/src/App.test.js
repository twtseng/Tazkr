import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import App from './App';

it('renders without crashing', async () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MemoryRouter>
      <App />
    </MemoryRouter>, div);
  await new Promise(resolve => setTimeout(resolve, 1000));
});

test("Verify navbar-brand", async () => {
  render(<MemoryRouter><App /></MemoryRouter>);
  screen.getByText("Tazkr");
  await new Promise(resolve => setTimeout(resolve, 1000));
})