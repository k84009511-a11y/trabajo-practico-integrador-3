import { verifyToken } from "../helpers/jwt.helper.js";
import { UserModel } from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "No autenticado: falta el token" });
    }

    const decoded = verifyToken(token);

    const user = await UserModel.findOne({
      _id: decoded.id,
      deletedAt: null,
    }).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ message: "No autenticado: usuario inexistente" });
    }

    req.user = user;
  } catch (error) {
    return res.status(401).json({ message: "Token inválidoa" });
  }
};
