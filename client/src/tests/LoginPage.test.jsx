import React from 'react';
import { render, screen } from '@testing-library/react';
import LoginPage from '../pages/LoginPage';

jest.mock('../components/auth/LoginForm', () => () => <div data-testid="login-form">LoginForm</div>);

describe('LoginPage', () => {
  it('should render the LoginForm component', () => {
    render(<LoginPage />);
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });
});
