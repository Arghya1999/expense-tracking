import React from 'react';
import { render, screen } from '@testing-library/react';
import RegisterPage from '../pages/RegisterPage';

jest.mock('../components/auth/RegisterForm', () => () => <div data-testid="register-form">RegisterForm</div>);

describe('RegisterPage', () => {
  it('should render the RegisterForm component', () => {
    render(<RegisterPage />);
    expect(screen.getByTestId('register-form')).toBeInTheDocument();
  });
});
