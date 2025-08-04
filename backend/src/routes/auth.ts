import { Router } from "express";
import {
  registerController,
  loginController,
  logoutController,
  updateProfileController,
  checkAuth,
} from "../controllers/auth.controller";
import { protectRoute } from "../middleware/auth.middleware";
import {upload} from "../middleware/multer.middleware"; // import multer middleware

const authRoutes = Router();

authRoutes.post('/login', loginController);
authRoutes.post('/logout', logoutController);
authRoutes.post('/register', registerController);
authRoutes.put('/update-profile', protectRoute, upload.single('profilePicture'), updateProfileController);
authRoutes.get('/check', protectRoute, checkAuth);

export default authRoutes;
