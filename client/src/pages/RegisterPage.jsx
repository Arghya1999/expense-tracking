import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <RegisterForm />
        </div>
    );
};

export default RegisterPage;
