import React from 'react';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <LoginForm />
        </div>
    );
};

export default LoginPage;
