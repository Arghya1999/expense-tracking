import React, { useState } from 'react';
import { register } from '../../services/auth.service';
import { useNavigate, Link } from 'react-router-dom';
import {
    Card,
    CardBody,
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";
import { UserPlusIcon } from "@heroicons/react/24/solid";

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [successful, setSuccessful] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

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
        <Card className="w-full max-w-md shadow-xl bg-white dark:bg-gray-800 rounded-lg">
            <div className="relative bg-clip-border overflow-hidden bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-blue-500/40 mb-4 grid h-32 w-32 place-items-center rounded-full mx-auto mt-4 shadow-lg">
                <div className="flex flex-col items-center justify-center">
                    <UserPlusIcon className="h-16 w-16 text-white mb-2" />
                    <h5 className="block antialiased tracking-normal font-sans text-xl font-semibold leading-snug text-white">Sign Up</h5>
                </div>
            </div>
            <CardBody className="flex flex-col gap-4 p-6">
                <Input
                    label="Username"
                    size="lg"
                    data-testid="register-username-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    error={!!errors.username}
                    className="dark:text-white"
                    labelProps={{ className: "dark:text-gray-300" }}
                />
                {errors.username && <span className="text-red-500">{errors.username}</span>}
                <Input
                    label="Email"
                    type="email"
                    size="lg"
                    data-testid="register-email-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!errors.email}
                    className="dark:text-white"
                    labelProps={{ className: "dark:text-gray-300" }}
                />
                {errors.email && <span className="text-red-500">{errors.email}</span>}
                <Input
                    label="Password"
                    type="password"
                    size="lg"
                    data-testid="register-password-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!errors.password}
                    className="dark:text-white"
                    labelProps={{ className: "dark:text-gray-300" }}
                />
                {errors.password && <span className="text-red-500">{errors.password}</span>}
                <Button type="submit" color="blue" fullWidth onClick={handleRegister}>
                    <span className="dark:text-white">Sign Up</span>
                </Button>
                {message && (
                    <Typography color={successful ? "green" : "red"} className="text-center mt-4">
                        {message}
                    </Typography>
                )}
                <Typography color="gray" className="mt-4 text-center font-normal dark:text-gray-400">
                    Already registered?{' '}
                    <Link to="/login" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                        Log In
                    </Link>
                </Typography>
            </CardBody>
        </Card>
    );
};

export default RegisterForm;
