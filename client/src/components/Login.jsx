import React, { useState } from 'react';
import { login } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import '../Auth.css';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
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
        <div className="col-md-12">
            <div className="card card-container">
                <img
                    src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                    alt="profile-img"
                    className="profile-img-card"
                />

                <form onSubmit={handleLogin}>
                    <div className="form-group mb-3">
                        <label htmlFor="identifier">Username or Email</label>
                        <input
                            type="text"
                            className="form-control"
                            name="identifier"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            autoComplete="username"
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </div>

                    <div className="form-group mb-3">
                        <button className="btn btn-primary btn-block" disabled={!identifier || !password}>
                            <span>Login</span>
                        </button>
                    </div>

                    {message && (
                        <div className="form-group">
                            <div className="alert alert-danger" role="alert">
                                {message}
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Login;
