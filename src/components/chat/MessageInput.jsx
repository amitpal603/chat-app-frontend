import React, { useState, useRef } from 'react';
import { useChat } from '../../hooks/useChat';
import { toast } from 'react-hot-toast';

const MessageInput = () => {
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const fileInputRef = useRef(null);
    const { sendMsg } = useChat();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview) return;

        setIsSending(true);
        try {
            // Check if we have an image to send
            if (imagePreview) {
                const formData = new FormData();
                formData.append("text", text);
                if (fileInputRef.current?.files[0]) {
                    formData.append("image", fileInputRef.current.files[0]);
                }
                await sendMsg(formData);
            } else {
                await sendMsg({ text: text.trim() });
            }

            setText("");
            setImagePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            toast.error("Failed to send message");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
            {imagePreview && (
                <div className="mb-3 flex items-center gap-2 group animate-in slide-in-from-bottom-2 duration-300">
                    <div className="relative">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg border border-slate-700"
                        />
                        <button
                            onClick={removeImage}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-500 transition-colors"
                            type="button"
                        >
                             <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
                    <button
                        type="button"
                        className="p-2 text-slate-400 hover:text-blue-400 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                    >
                         <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />
                    <input
                        type="text"
                        className="flex-1 bg-transparent border-none text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
                        placeholder="Type a message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={isSending}
                    />
                </div>
                <button
                    type="submit"
                    className={`p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all transform active:scale-95 ${
                        (!text.trim() && !imagePreview) || isSending ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={(!text.trim() && !imagePreview) || isSending}
                >
                    {isSending ? (
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    )}
                </button>
            </form>
        </div>
    );
};

export default MessageInput;
