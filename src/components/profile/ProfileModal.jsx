import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAccount, updateAvatar } from '../../redux/slices/userSlice';
import { setUser } from '../../redux/slices/authSlice';

const ProfileModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { status } = useSelector((state) => state.user);
    const { user: authUser } = useSelector((state) => state.auth);
    
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (isOpen && authUser) {
            setFullName(authUser.fullName || "");
            setEmail(authUser.email || "");
            setPreviewUrl(null);
            setAvatarFile(null);
        }
    }, [isOpen, authUser]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        if (!fullName.trim() || !email.trim()) {
            console.error("All fields are required");
            return;
        }

        try {
            let finalUser = authUser;
            
            // Only update account if the fields actually changed
            if (fullName !== authUser?.fullName || email !== authUser?.email) {
                finalUser = await dispatch(updateAccount({ fullName, email })).unwrap();
            }
            
            if (avatarFile) {
                const formData = new FormData();
                formData.append("avatar", avatarFile);
                finalUser = await dispatch(updateAvatar(formData)).unwrap();
            }
            
            // Sync with auth state so the HomePage updates immediately
            if (finalUser) {
                dispatch(setUser(finalUser));
            }
            onClose();
        } catch (error) {
            console.error("Failed to update profile", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-slate-900/40 border border-slate-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-600/10 to-transparent">
                    <h2 className="text-xl font-bold uppercase tracking-widest text-blue-400">Settings</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleUpdate} className="p-6 space-y-6">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative group">
                            <img 
                                src={previewUrl || authUser?.profilePic || "/default-avatar.png"} 
                                alt="profile" 
                                className="h-28 w-28 rounded-full border-4 border-blue-500/30 object-cover shadow-xl group-hover:border-blue-500 transition-all duration-300" 
                            />
                            <label className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full cursor-pointer shadow-lg hover:scale-110 active:scale-95 transition-all">
                                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                            </label>
                        </div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Update Avatar</p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 font-bold uppercase ml-1">Full Name</label>
                            <input 
                                type="text" 
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-slate-700"
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 font-bold uppercase ml-1">Email Address</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-slate-700"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit" 
                            disabled={status === 'loading'}
                            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-500 active:scale-[0.98] transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed uppercase text-xs tracking-widest"
                        >
                            {status === 'loading' ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileModal;
