import React, { useState } from 'react';
import { register } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';


const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [successful, setSuccessful] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');
        setSuccessful(false);
        setPasswordError('');

        if (!validatePassword(password)) {
            return;
        }

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

    const validatePassword = (pwd) => {
        if (pwd.length < 6 || pwd.length > 40) {
            setPasswordError("The password must be between 6 and 40 characters.");
            return false;
        }
        return true;
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

                <form onSubmit={handleRegister}>
                    {!successful && (
                        <div>
                            <div className="form-group mb-3">
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="username"
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
                                    id="email"
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
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        validatePassword(e.target.value);
                                    }}
                                />
                                {passwordError && (
                                    <div className="alert alert-danger mt-2" role="alert">
                                        {passwordError}
                                    </div>
                                )}
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
