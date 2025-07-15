import { Router } from "express"
import { registerController,loginController,logoutController,updateProfileController } from "../controllers/auth.controller"
import { protectRoute } from "../middleware/auth.middleware"

const authRoutes = Router()
authRoutes.post('/login', loginController)
authRoutes.post('/logout', logoutController)
authRoutes.post('/register', registerController)
authRoutes.put('/update-profile',protectRoute,updateProfileController)
export default authRoutes