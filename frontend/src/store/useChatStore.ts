import {create} from 'zustand';
import toast from 'react-hot-toast';
import  {axiosInstance}  from '../lib/axios';

export interface User {
    _id: string;
    username: string;
    email: string;
    profilePicture?: string;
}

export interface Message {
    _id: string;
    senderId: string;
    receiverId: string;
    text: string;
    image?: string;
    createdAt: string;
    updatedAt: string;
}

interface ChatStoreState {
    messages: Message[];
    users: User[];
    selectedUser: User | null;
    isUserLoading: boolean;
    isMessagesLoading: boolean;
    getUsers: () => Promise<void>;
    getMessages: (userId: string) => Promise<void>;
    sendMessage: (messageData: { text?: string; image?: string }) => Promise<void>;
    setSelectedUser: (user: User | null) => void;
}

export const useChatStore = create<ChatStoreState>((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,
    getUsers: async () => {
        set({ isUserLoading: true });
        try {
            const response = await axiosInstance.get('/api/messages/get/users');
            set({ users: response.data, isUserLoading: false });
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users');
            set({ isUserLoading: false });
        }
    },
    getMessages: async (userId: string) => {
        set({ isMessagesLoading: true });
        try {
            const response = await axiosInstance.get(`/api/messages/${userId}`);
            set({ messages: response.data, isMessagesLoading: false });
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error('Failed to fetch messages');
            set({ isMessagesLoading: false });
        }
    },
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        if (!selectedUser) return;
        
        try {
            const res = await axiosInstance.post(`/api/messages/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to send message');
        }
    },
    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));