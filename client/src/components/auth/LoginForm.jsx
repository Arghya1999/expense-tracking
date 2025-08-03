import React, { useState } from 'react';
import { login } from '../../services/auth.service';
import { useNavigate, Link } from 'react-router-dom';


const LoginForm = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [passwordShown, setPasswordShown] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);

    const validate = () => {
        const newErrors = {};
        if (!identifier) newErrors.identifier = 'Username or Email is required';
        if (!password) newErrors.password = 'Password is required';
        return newErrors;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setMessage('');
        try {
            await login(identifier, password);
            navigate('/expenses');
            window.location.reload();
        } catch (error) {
            const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            setMessage(resMessage);
        }
    };

    return (
        <div className="card shadow-sm" style={{ width: '100%', maxWidth: '400px' }}>
            <div className="card-header bg-primary text-white text-center py-3">
                <h3 className="mb-0">Sign In</h3>
            </div>
            <div className="card-body">
                <p className="mb-4 text-center">
                    Enter your email and password to sign in
                </p>
                <form onSubmit={handleLogin} className="d-flex flex-column gap-4">
                    <div className="form-group">
                        <label htmlFor="email">Your Email</label>
                        <input
                            id="email"
                            className="form-control"
                            type="text"
                            name="email"
                            placeholder="name@mail.com"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                        />
                        {errors.identifier && <div className="text-danger mt-1">{errors.identifier}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-group">
                            <input
                                id="password"
                                className="form-control"
                                placeholder="********"
                                type={passwordShown ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={togglePasswordVisiblity}
                            >
                                {passwordShown ? (
                                    <i className="bi bi-eye-slash"></i>
                                ) : (
                                    <i className="bi bi-eye"></i>
                                )}
                            </button>
                        </div>
                        {errors.password && <div className="text-danger mt-1">{errors.password}</div>}
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        sign in
                    </button>
                    {message && (
                        <div className="alert alert-danger text-center mt-4" role="alert">
                            {message}
                        </div>
                    )}
                    <div className="d-flex justify-content-end mt-4">
                        <a href="#" className="text-decoration-none">
                            Forgot password
                        </a>
                    </div>
                    <p className="text-center mt-4">
                        Not registered?{" "}
                        <Link to="/register" className="text-primary">
                            Sign Up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
