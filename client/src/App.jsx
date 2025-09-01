import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import ExpensesPage from './pages/ExpensesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { getCurrentUser, logout } from './services/auth.service';
import {
    Navbar,
    Collapse,
    Typography,
    Button,
    IconButton,
    Switch,
} from "@material-tailwind/react";
import { Bars2Icon } from "@heroicons/react/24/outline";

function App() {
    const [currentUser, setCurrentUser] = useState(undefined);
    const [openNav, setOpenNav] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const navigate = useNavigate();

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    useEffect(() => {
        const user = getCurrentUser();
        if (user) {
            setCurrentUser(user);
        } else {
            // Only navigate to login if not already on login or register page
            if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
                navigate('/login');
            }
        }
    }, [navigate]);

    useEffect(() => {
        window.addEventListener(
            "resize",
            () => window.innerWidth >= 960 && setOpenNav(false),
        );
    }, []);

    const logOut = () => {
        logout();
        setCurrentUser(undefined);
        navigate('/login');
    };

    const navList = (
        <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
            {currentUser && (
                <Typography
                    as="li"
                    variant="small"
                    color="blue-gray"
                    className="p-1 font-normal dark:text-white"
                >
                    <Link to="/expenses" className="flex items-center">
                        Expenses
                    </Link>
                </Typography>
            )}
            <Typography
                as="li"
                variant="small"
                color="blue-gray"
                className="p-1 font-normal dark:text-white"
            >
                <Switch
                    id="dark-mode-switch"
                    label="Dark Mode"
                    checked={theme === 'dark'}
                    onChange={toggleTheme}
                    color="blue"
                />
            </Typography>
        </ul>
    );

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
            <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4 bg-white dark:bg-gray-800 shadow-md">
                <div className="flex items-center justify-between text-blue-gray-900 dark:text-white">
                    <Typography
                        as="a"
                        href="#"
                        className="mr-4 cursor-pointer py-1.5 font-bold text-xl dark:text-white"
                    >
                        Expense Tracker
                    </Typography>
                    <div className="flex items-center gap-4">
                        <div className="mr-4 hidden lg:block">{navList}</div>
                        {currentUser ? (
                            <Button
                                variant="gradient"
                                size="sm"
                                className="hidden lg:inline-block"
                                onClick={logOut}
                            >
                                <span>Log Out</span>
                            </Button>
                        ) : (
                            <div className="flex gap-x-1">
                                <Button
                                    variant="text"
                                    size="sm"
                                    className="hidden lg:inline-block dark:text-white"
                                    onClick={() => navigate('/login')}
                                >
                                    <span>Log In</span>
                                </Button>
                                <Button
                                    variant="gradient"
                                    size="sm"
                                    className="hidden lg:inline-block"
                                    onClick={() => navigate('/register')}
                                >
                                    <span>Sign Up</span>
                                </Button>
                            </div>
                        )}
                        <IconButton
                            variant="text"
                            className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden dark:text-white"
                            ripple={false}
                            onClick={() => setOpenNav(!openNav)}
                        >
                            {openNav ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    className="h-6 w-6"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            ) : (
                                <Bars2Icon className="h-6 w-6" />
                            )}
                        </IconButton>
                    </div>
                </div>
                <Collapse open={openNav}>
                    {navList}
                    {currentUser ? (
                        <Button fullWidth variant="gradient" size="sm" className="mb-2" onClick={logOut}>
                            <span>Log Out</span>
                        </Button>
                    ) : (
                        <div className="flex flex-col gap-x-1">
                            <Button fullWidth variant="text" size="sm" className="mb-2 dark:text-white" onClick={() => navigate('/login')}>
                                <span>Log In</span>
                            </Button>
                            <Button fullWidth variant="gradient" size="sm" className="mb-2" onClick={() => navigate('/register')}>
                                <span>Sign Up</span>
                            </Button>
                        </div>
                    )}
                </Collapse>
            </Navbar>
            <main className="container mx-auto mt-4 flex-grow">
                <Routes>
                    <Route path="/" element={currentUser ? <ExpensesPage /> : <LoginPage />} />
                    <Route path="/expenses" element={currentUser ? <ExpensesPage /> : <LoginPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Routes>
            </main>

            <footer className="bg-blue-gray-800 text-white py-4 mt-5 dark:bg-gray-900">
                <div className="container mx-auto text-center">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Typography variant="h6" color="white" className="mb-2">Contact Us</Typography>
                            <Typography color="white" className="text-sm">Mobile: 9734187531</Typography>
                            <Typography color="white" className="text-sm">Email: panarghya2015@gmail.com</Typography>
                        </div>
                        <div>
                            <Typography variant="h6" color="white" className="mb-2">Pan Company</Typography>
                            <Typography color="white" className="text-sm">&copy; {new Date().getFullYear()} Pan. All rights reserved.</Typography>
                        </div>
                        <div>
                            <Typography variant="h6" color="white" className="mb-2">About Us</Typography>
                            <Typography color="white" className="text-sm">Your go-to solution for tracking and managing personal expenses efficiently.</Typography>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
