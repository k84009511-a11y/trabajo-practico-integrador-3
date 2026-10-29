import { matchedData } from "express-validator";
import { EventModel } from "../models/event.model.js";

const populateOptions = [
  { path: "organizer", select: "username email profile" },
  { path: "categories" },
];

export const createEvent = async (req, res) => {
  try {
    const data = matchedData(req);

    const existing = await EventModel.findOne({ title: data.title });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Ya existe un evento con ese título" });
    }

    const event = await EventModel.create({ ...data, organizer: req.user._id });
    const populated = await event.populate(populateOptions);

    return res
      .status(201)
      .json({ message: "Evento creado con éxito", event: populated });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await EventModel.find().populate(populateOptions);
    return res.status(200).json({ events });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};

export const getMyEvents = async (req, res) => {
  try {
    const events = await EventModel.find({ organizer: req.user._id }).populate(
      "categories",
    );
    return res.status(200).json({ events });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = matchedData(req);

    const event = await EventModel.findById(id).populate(populateOptions);
    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    return res.status(200).json({ event });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id, location, ...rest } = matchedData(req);
    const event = req.event;

    if (rest.title) {
      const duplicated = await EventModel.findOne({
        title: rest.title,
        _id: { $ne: id },
      });
      if (duplicated) {
        return res
          .status(400)
          .json({ message: "Ya existe otro evento con ese título" });
      }
    }

    const start = rest.startDate ?? event.startDate;
    const end = rest.endDate ?? event.endDate;
    if (end <= start) {
      return res
        .status(400)
        .json({ message: "endDate debe ser posterior a startDate" });
    }

    const updates = { ...rest };
    if (location) {
      for (const [key, value] of Object.entries(location)) {
        updates[`location.${key}`] = value;
      }
    }

    const updated = await EventModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    ).populate(populateOptions);

    return res
      .status(200)
      .json({ message: "Evento actualizado con éxito", event: updated });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    await EventModel.findByIdAndDelete(req.event._id);
    return res.status(200).json({ message: "Evento eliminado con éxito" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};
