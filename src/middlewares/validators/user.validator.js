import { body } from "express-validator";
import { idParamValidator, profileRules } from "./common.validator.js";

export const userIdValidator = [idParamValidator];

export const updateUserValidator = [
  idParamValidator,
  body("username")
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("El username debe tener entre 3 y 20 caracteres")
    .bail()
    .isAlphanumeric()
    .withMessage("El username solo puede contener letras y números"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Email inválido")
    .toLowerCase(),
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Rol no permitido"),
  ...profileRules("profile.", false),
];
