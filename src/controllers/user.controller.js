import { matchedData } from "express-validator";
import { UserModel } from "../models/user.model.js";
import { EventModel } from "../models/event.model.js";

export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find({ deletedAt: null })
      .select("-password")
      .populate("events");

    return res.status(200).json({ users });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = matchedData(req);

    const user = await UserModel.findOne({ _id: id, deletedAt: null })
      .select("-password")
      .populate("events");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id, profile, ...rest } = matchedData(req);

    const user = await UserModel.findOne({ _id: id, deletedAt: null });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Unicidad: solo si se envían email o username
    const conditions = [];
    if (rest.email) conditions.push({ email: rest.email });
    if (rest.username) conditions.push({ username: rest.username });

    if (conditions.length > 0) {
      const duplicated = await UserModel.findOne({
        $or: conditions,
        _id: { $ne: id },
      });
      if (duplicated) {
        return res
          .status(400)
          .json({ message: "El email o el username ya están en uso" });
      }
    }

    // Notación de punto para no pisar el perfil completo
    const updates = { ...rest };
    if (profile) {
      for (const [key, value] of Object.entries(profile)) {
        updates[`profile.${key}`] = value;
      }
    }

    const updated = await UserModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    ).select("-password");

    return res
      .status(200)
      .json({ message: "Usuario actualizado con éxito", user: updated });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = matchedData(req);

    const user = await UserModel.findOne({ _id: id, deletedAt: null });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await EventModel.deleteMany({ organizer: id });

    await UserModel.findByIdAndUpdate(id, { deletedAt: new Date() });

    return res
      .status(200)
      .json({ message: "Usuario eliminado con éxito, junto con sus eventos" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};
