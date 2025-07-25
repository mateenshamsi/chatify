import { create } from 'zustand'
import { axiosInstance } from '@/lib/axios'
import SignupPage from '../pages/SingupPage';
import { toast } from 'react-hot-toast'
import { redirect } from 'react-router-dom';
type signUpData = { 
    username: string
    email: string
    password: string
}
interface AuthUser {
    // Define properties based on your API response, e.g.:
    id: string
    username: string
    email: string
    // Add more fields as needed
}

interface AuthStoreState {
    authUser: AuthUser | null
    isCheckingAuth: boolean
    isSigningUp: boolean
    isLoggingIn: boolean
    isUpdatingProfile: boolean
    checkAuth: () => Promise<void>
    signup:(data:signUpData) => Promise<void>
}

export const useAuthStore = create<AuthStoreState>((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    checkAuth: async () => {
        try {
            const auth = await axiosInstance.get('/api/auth/check')
            set({ authUser: auth.data })
        } catch (err) {
            console.log(err)
            set({ authUser: null })
        }
    },
    signup: async (data:signUpData) => {
        set({ isSigningUp: true })
        try {
            const response = await axiosInstance.post('/api/auth/register', data)
            console.log('Signup response:', response.data)
            toast.success("Account created successfully!")
            redirect('/')
            set({ authUser: response.data, isSigningUp: false })
            
        } catch (error:any) {
            console.error("Signup error:", error)
            toast.error("Failed to create account",error.message)
            set({ isSigningUp: false })
        }
    }
}))