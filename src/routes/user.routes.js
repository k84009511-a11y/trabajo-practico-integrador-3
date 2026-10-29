import { Router } from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  userIdValidator,
  updateUserValidator,
} from "../middlewares/validators/user.validator.js";

const router = Router();

router.use(authMiddleware, adminMiddleware); // todo /api/users es solo admin

router.get("/", getUsers);
router.get("/:id", userIdValidator, validate, getUserById);
router.put("/:id", updateUserValidator, validate, updateUser);
router.delete("/:id", userIdValidator, validate, deleteUser);

export default router;
