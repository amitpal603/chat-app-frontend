import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import toast from 'react-hot-toast';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await authService.register(formData);
            toast.success('Account Created Successfully! Please login.');
            navigate('/login');
        } catch (error) {
            toast.error(error || 'Registration Failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-950 px-4 py-12">
            <div className="w-full max-w-md p-8 space-y-8 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                        Join ChatApp
                    </h1>
                    <p className="mt-2 text-slate-400">Experience the future of real-time chat</p>
                </div>
                
                <form className="mt-8 space-y-5" onSubmit={onSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300">Username</label>
                            <input
                                name="username"
                                type="text"
                                required
                                value={formData.username}
                                onChange={onChange}
                                className="w-full px-4 py-3 mt-1 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-white transition-all"
                                placeholder="johndoe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300">Full Name</label>
                            <input
                                name="fullName"
                                type="text"
                                required
                                value={formData.fullName}
                                onChange={onChange}
                                className="w-full px-4 py-3 mt-1 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-white transition-all"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={onChange}
                                className="w-full px-4 py-3 mt-1 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-white transition-all"
                                placeholder="name@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300">Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={onChange}
                                className="w-full px-4 py-3 mt-1 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-white transition-all"
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
                                ? 'bg-indigo-600/50 cursor-not-allowed' 
                                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]'
                            } shadow-lg shadow-indigo-900/20`}
                        >
                            {isLoading ? 'Creating Account...' : 'Get Started'}
                        </button>
                    </div>
                </form>

                <div className="text-center text-sm">
                    <span className="text-slate-400">Already have an account? </span>
                    <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
