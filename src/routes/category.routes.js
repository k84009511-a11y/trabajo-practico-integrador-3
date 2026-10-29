import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdValidator,
} from "../middlewares/validators/category.validator.js";

const router = Router();

router.use(authMiddleware);

router.post(
  "/",
  adminMiddleware,
  createCategoryValidator,
  validate,
  createCategory,
);
router.get("/", getCategories);
router.get("/:id", categoryIdValidator, validate, getCategoryById);
router.put(
  "/:id",
  adminMiddleware,
  updateCategoryValidator,
  validate,
  updateCategory,
);
router.delete(
  "/:id",
  adminMiddleware,
  categoryIdValidator,
  validate,
  deleteCategory,
);

export default router;
