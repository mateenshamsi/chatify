import {Router} from "express";
import { protectRoute } from "../middleware/auth.middleware";
import {getUsersForSidebar,getMessages,sendMessage} from "../controllers/message.controller";
export const messageRoutes = Router();

messageRoutes.get('/get/users',protectRoute,getUsersForSidebar)
messageRoutes.get('/:userId',protectRoute,getMessages);
messageRoutes.post('/:userId',protectRoute,sendMessage);

