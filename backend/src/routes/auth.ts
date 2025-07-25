import { Router } from "express"
import { registerController,loginController,logoutController,updateProfileController, checkAuth } from "../controllers/auth.controller"
import { protectRoute } from "../middleware/auth.middleware"

const authRoutes = Router()
authRoutes.post('/login', loginController)
authRoutes.post('/logout', logoutController)
authRoutes.post('/register', registerController)
authRoutes.put('/update-profile',protectRoute,updateProfileController)
authRoutes.get('/check',protectRoute,checkAuth)
export default authRoutes