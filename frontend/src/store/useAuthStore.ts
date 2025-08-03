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
type loginData={
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
    login:(data:loginData) => Promise<void>
    logout:() => Promise<void>
    
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
    },
    login: async (data:loginData) => {
        set({ isLoggingIn: true })
        try {
            const response = await axiosInstance.post('/api/auth/login', data)
            if (!response.data || !response.data.user) {
                throw new Error("Invalid login response")
            }
            console.log('Login response:', response.data)   
            set({ authUser: response.data.user, isLoggingIn: false })
            toast.success("Logged in successfully!")
            redirect('/')   
        } catch (error:any) {
            console.error("Login error:", error)
            toast.error("Failed to log in", error.message)
            set({ isLoggingIn: false })
        }
    },
    logout: async () => {
        
      try{ 
        await axiosInstance.post('/api/auth/logout')
        set({ authUser: null })
        redirect('/login') 
        toast.success("Logged out successfully!")
        }
        catch (error) {
                console.error("Logout error:", error)
                toast.error("Failed to log out")
            }
    }
}))