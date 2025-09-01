import React, { useState } from 'react';
import { login } from '../../services/auth.service';
import { useNavigate, Link } from 'react-router-dom';
import {
    Card,
    CardBody,
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";
import { UserCircleIcon } from "@heroicons/react/24/solid";

const LoginForm = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

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
        <Card className="w-full max-w-md shadow-xl bg-white dark:bg-gray-800 rounded-lg">
            <div className="relative bg-clip-border overflow-hidden bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-blue-500/40 mb-4 grid h-32 w-32 place-items-center rounded-full mx-auto mt-4 shadow-lg">
                <div className="flex flex-col items-center justify-center">
                    <UserCircleIcon className="h-16 w-16 text-white mb-2" />
                    <h5 className="block antialiased tracking-normal font-sans text-xl font-semibold leading-snug text-white">Sign In</h5>
                </div>
            </div>
            <CardBody className="flex flex-col gap-4 p-6">
                <Input
                    label="Username or Email"
                    size="lg"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    error={errors.identifier}
                    className="dark:text-white"
                    labelProps={{ className: "dark:text-gray-300" }}
                />
                <Input
                    label="Password"
                    type="password"
                    size="lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                    className="dark:text-white"
                    labelProps={{ className: "dark:text-gray-300" }}
                />
                <Button type="submit" color="blue" fullWidth onClick={handleLogin}>
                    <span className="dark:text-white">Sign In</span>
                </Button>
                {message && (
                    <Typography color="red" className="text-center mt-4">
                        {message}
                    </Typography>
                )}
                <Typography color="gray" className="mt-4 text-center font-normal dark:text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                        Sign up
                    </Link>
                </Typography>
            </CardBody>
        </Card>
    );
};

export default LoginForm;
