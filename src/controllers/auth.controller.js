import { matchedData } from "express-validator";
import { UserModel } from "../models/user.model.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { generateToken } from "../helpers/jwt.helper.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 60 * 60 * 1000,
};

export const register = async (req, res) => {
  try {
    const { username, email, password, profile } = matchedData(req);

    const existingUser = await UserModel.finOne({
      $or: [{ email }, { username }],
    });

    const hashedPassword = await hashPassword(password);

    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      profile,
    });

    const { password: _, ...userData } = user.toObject();

    return res
      .status(201)
      .json({ message: "Usuario registrado con éxito", user: userData });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "El email o el username ya existen" });
    }
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = matchedData(req);

    const user = await UserModel.findOne({ email, deletedAt: null });

    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = generateToken({ id: user._id });

    res.cookie("token", token, cookieOptions);

    const { password: _, ...userData } = user.toObject();

    return res.status(200).json({ message: "Login exitoso", user: userData });
  } catch (error) {
    return res.stauts(500).json({ message: "Error interno del servidor" });
  }
};

export const getProfile = async (req, res) => {
  try {
    return res.status(200).json({ user: req.user });
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const data = matchedData(req);

    const updates = {};
    for (const [key, value] of Object.entries(data)) {
      updates[`profile.${key}`] = value;
    }

    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true },
    ).select("-password");

    return res
      .status(200)
      .json({ message: "Perfil actualizado con éxito", user });
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", { ...cookieOptions, maxAge: undefined });
    return res.status(200).json({ message: "Sessión cerrada con éxito" });
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
