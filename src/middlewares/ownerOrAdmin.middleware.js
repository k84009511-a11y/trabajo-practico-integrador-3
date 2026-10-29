import { EventModel } from "../models/event.model.js";

export const ownerOrAdminMiddleware = async (req, res, next) => {
  try {
    const event = await EventModel.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    const isOwner = event.organizer.equals(req.user._id);
    const isAdmin = (req.user.role = "admin");

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message:
          "Solo el organizador o un administrador puede realizar esta acción",
      });
    }

    req.event = event;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
