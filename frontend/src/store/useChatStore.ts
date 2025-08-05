import {create} from 'zustand';
import toast from 'react-hot-toast';
import  axiosInstance  from 'axios';

export const useChatStore = create((set) => ({
    messages:[] , 
    users:[] , 
    selectedUsers:null,
    isUserLoading:false,
    isMessagesLoading:false,
    getUsers:async()=>{ 
        set({isUserLoading:true})
        try {
            const response = await axiosInstance.get('/users');
            set({users:response.data, isUserLoading:false});
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users');
            set({isUserLoading:false});
        }
        finally{
            set({isUserLoading:false});
        }
    },
    getMessages:async (userId:string) => {
        set({isMessagesLoading:true})
        try {
            const response = await axiosInstance.get(`/messages/${userId}`);
            set({messages:response.data, isMessagesLoading:false});
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error('Failed to fetch messages');
            set({isMessagesLoading:false});
        }
        finally{
            set({isMessagesLoading:false});
        }
    },
    setSelectedUser: (selectedUser) => set({selectedUser}),

}))