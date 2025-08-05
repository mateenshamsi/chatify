import { Router } from "express";
import authRoutes from "./auth";
import {messageRoutes} from "./message.route";
const router = Router();
router.use("/auth", authRoutes);
router.use('/messages', messageRoutes)
export default router;