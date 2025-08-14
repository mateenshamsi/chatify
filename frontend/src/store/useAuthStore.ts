import { create } from 'zustand'
import { axiosInstance } from '@/lib/axios'
import { toast } from 'react-hot-toast'
import { io, Socket } from 'socket.io-client'

const BASE_URL = 'http://localhost:3000'

type SignUpData = { 
  username: string
  email: string
  password: string
}

type LoginData = {
  email: string
  password: string
}

type UpdateProfileData = {
  username?: string
  email?: string
  password?: string
  profilePicture?: string | File | null
}

interface AuthUser {
  _id: string
  username: string
  email: string
  profilePicture: string | null
}

interface AuthStoreState {
  authUser: AuthUser | null
  isCheckingAuth: boolean
  isSigningUp: boolean
  isLoggingIn: boolean
  isUpdatingProfile: boolean
  socket: Socket | null
  onlineUsers: string[]
  checkAuth: () => Promise<void>
  signup: (data: SignUpData) => Promise<void>
  login: (data: LoginData) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: UpdateProfileData) => Promise<void>
  connectSocket: () => void
  disconnectSocket: () => void
}

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  socket: null,
  onlineUsers:[],
  checkAuth: async () => {
    try {
      const auth = await axiosInstance.get('/api/auth/check')
      set({ authUser: auth.data, isCheckingAuth: false })
      get().connectSocket()
    } catch (err) {
      console.log(err)
      set({ authUser: null, isCheckingAuth: false })
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true })
    try {
      const res = await axiosInstance.post('/api/auth/register', data)
      toast.success('Account created successfully!')
      set({ authUser: res.data, isSigningUp: false })
      get().connectSocket()
    } catch (error: any) {
      console.error('Signup error:', error)
      toast.error(`Failed to create account: ${error.message}`)
      set({ isSigningUp: false })
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true })
    try {
      const res = await axiosInstance.post('/api/auth/login', data)
      if (!res.data?.user) throw new Error('Invalid login response')
      set({ authUser: res.data.user, isLoggingIn: false })
      toast.success('Logged in successfully!')
      get().connectSocket()
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error(`Failed to log in: ${error.message}`)
      set({ isLoggingIn: false })
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/api/auth/logout')
      set({ authUser: null })
      toast.success('Logged out successfully!')
      get().disconnectSocket()
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to log out')
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true })
    try {
      const formData = new FormData()
      if (data.username) formData.append('username', data.username)
      if (data.email) formData.append('email', data.email)
      if (data.profilePicture) formData.append('profilePicture', data.profilePicture)

      const res = await axiosInstance.put('/api/auth/update-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      toast.success('Profile updated!')
      set({ authUser: res.data.user, isUpdatingProfile: false })
    } catch (error: any) {
      console.error('Update failed:', error)
      toast.error('Failed to update profile')
      set({ isUpdatingProfile: false })
    }
  },

  connectSocket: () => {
    const {authUser} = get()
    if(!authUser || get().socket?.connected) {
        console.log('Cannot connect socket: authUser is', authUser, 'socket connected:', get().socket?.connected)
        return
    }

    console.log('Connecting socket with userId:', authUser._id)
    
   const socket = io(BASE_URL, {
  auth: {
    userId: authUser._id
  },
  withCredentials: true
});

    
    socket.on('connect', () => {
      console.log('Socket connected successfully')
    })
    
    socket.on('getOnlineUsers', (onlineUsers: string[]) => {
      console.log('Received online users:', onlineUsers)
      set({ onlineUsers })
    })
    
    socket.connect()
    set({ socket })
  },
// Inside your useAuthStore create() function

disconnectSocket: () => {
  const socket = get().socket;
  if (socket) {
    // 1. Emit the 'logout' event to the server BEFORE disconnecting.
    // This is the crucial new line.
    socket.emit('logout');

    // 2. Now, disconnect the socket.
    socket.disconnect();

    // 3. Clean up state.
    set({ socket: null, onlineUsers: [] }); // Also clear online users list
    console.log('Emitted logout event and disconnected socket');
  } else {
    console.log('No socket to disconnect');
  }
}


}))
