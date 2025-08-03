import React, { useState } from 'react';
import { register } from '../../services/auth.service';
import { useNavigate, Link } from 'react-router-dom';


const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [successful, setSuccessful] = useState(false);
    const [errors, setErrors] = useState({});
    const [passwordShown, setPasswordShown] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);

    const validate = () => {
        const newErrors = {};
        if (!username) newErrors.username = 'Username is required';
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        return newErrors;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setSuccessful(false);
            return;
        }
        setErrors({});
        setSuccessful(false);

        try {
            await register(username, email, password);
            setMessage("Registration successful!");
            setSuccessful(true);
            navigate('/login');
        } catch (error) {
            const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            setMessage(resMessage);
            setSuccessful(false);
        }
    };

    return (
        <div className="card shadow-sm" style={{ width: '100%', maxWidth: '400px' }}>
            <div className="card-header bg-primary text-white text-center py-3">
                <h3 className="mb-0">Sign Up</h3>
            </div>
            <div className="card-body">
                <p className="mb-4 text-center">
                    Create your account
                </p>
                <form onSubmit={handleRegister} className="d-flex flex-column gap-4">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            className="form-control"
                            type="text"
                            name="username"
                            placeholder="Your Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        {errors.username && <div className="text-danger mt-1">{errors.username}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Your Email</label>
                        <input
                            id="email"
                            className="form-control"
                            type="email"
                            name="email"
                            placeholder="name@mail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <div className="text-danger mt-1">{errors.email}</div>}
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
                        sign up
                    </button>
                    {message && (
                        <div className={successful ? "alert alert-success text-center mt-4" : "alert alert-danger text-center mt-4"} role="alert">
                            {message}
                        </div>
                    )}
                    <p className="text-center mt-4">
                        Already registered?{" "}
                        <Link to="/login" className="text-primary">
                            Log In
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;
