import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../Login';
import '@testing-library/jest-dom';

describe('Login Page', () => {
  it('ログインが表示される', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    const loginButton = screen.getByRole('button', { name: /ログイン/i });
    expect(loginButton).toBeInTheDocument();
  });
});
