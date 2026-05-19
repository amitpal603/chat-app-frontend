import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { handleLogin, isLoading } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleLogin({ email, password });
            toast.success('Login Successful!');
            navigate('/');
        } catch (error) {
            toast.error(error || 'Login Failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-950 px-4">
            <div className="w-full max-w-md p-8 space-y-8 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                        Welcome Back
                    </h1>
                    <p className="mt-2 text-slate-400">Please enter your details to login</p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 mt-1 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white transition-all"
                                placeholder="name@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 mt-1 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
                                isLoading 
                                ? 'bg-blue-600/50 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
                            } shadow-lg shadow-blue-900/20`}
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </div>
                </form>

                <div className="text-center text-sm">
                    <span className="text-slate-400">Don't have an account? </span>
                    <Link to="/register" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
