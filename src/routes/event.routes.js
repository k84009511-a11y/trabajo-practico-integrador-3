import { Router } from "express";
import {
  createEvent,
  getEvents,
  getMyEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ownerOrAdminMiddleware } from "../middlewares/ownerOrAdmin.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createEventValidator,
  updateEventValidator,
  eventIdValidator,
} from "../middlewares/validators/event.validator.js";

const router = Router();

router.use(authMiddleware);

router.post("/", createEventValidator, validate, createEvent);
router.get("/", getEvents);
router.get("/my", getMyEvents); // ¡antes de "/:id"!
router.get("/:id", eventIdValidator, validate, getEventById);
router.put(
  "/:id",
  updateEventValidator,
  validate,
  ownerOrAdminMiddleware,
  updateEvent,
);
router.delete(
  "/:id",
  eventIdValidator,
  validate,
  ownerOrAdminMiddleware,
  deleteEvent,
);

export default router;
