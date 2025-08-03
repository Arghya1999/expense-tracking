import React, { useState } from 'react';
import { login } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';


const Login = ({ reload = () => window.location.reload() }) => {
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
            reload();
        } catch (error) {
            const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            setMessage(resMessage);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="card p-4 shadow-sm" style={{ width: '100%', maxWidth: '400px' }}>
                <img
                        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                        alt="profile-img"
                        className="img-fluid rounded-circle mx-auto d-block mb-4"
                        style={{ width: '96px', height: '96px' }}
                    />

                <form onSubmit={handleLogin}>
                    <div className="form-group mb-3">
                        <label htmlFor="identifier">Username or Email</label>
                        <input
                            type="text"
                            className="form-control"
                            id="identifier"
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
                            id="password"
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
                <p className="mt-3 text-center">
                    Not registered? <a href="/register">Create an account</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
