import { body } from "express-validator";
import { profileRules } from "./common.validator.js";

export const registerValidator = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("El username debe tener entre 3 y 20 caracteres")
    .bail()
    .isAlphanumeric()
    .withMessage("El username solo puede contener letras y números"),
  body("email").trim().isEmail().withMessage("Email inválido").toLowerCase(),
  body("password")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
    .withMessage(
      "La contraseña debe tener mínimo 8 caracteres, con una mayúscula, una minúscula y un número",
    ),
  ...profileRules("profile.", true),
];

export const loginValidator = [
  body("email").trim().isEmail().withMessage("Email inválido").toLowerCase(),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];

// PUT /api/auth/profile: campos planos y opcionales
export const updateProfileValidator = [...profileRules("", false)];
