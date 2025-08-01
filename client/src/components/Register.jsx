import React, { useState } from 'react';
import { register } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import '../Auth.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [successful, setSuccessful] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');
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
        <div className="col-md-12">
            <div className="card card-container">
                <img
                    src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                    alt="profile-img"
                    className="profile-img-card"
                />

                <form onSubmit={handleRegister}>
                    {!successful && (
                        <div>
                            <div className="form-group mb-3">
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                />
                            </div>

                            <div className="form-group mb-3">
                                <button className="btn btn-primary btn-block">
                                    Sign Up
                                </button>
                            </div>
                        </div>
                    )}

                    {message && (
                        <div className="form-group">
                            <div className={successful ? "alert alert-success" : "alert alert-danger"} role="alert">
                                {message}
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Register;
