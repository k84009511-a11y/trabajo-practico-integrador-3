import { body } from "express-validator";
import { idParamValidator } from "./common.validator.js";

export const categoryIdValidator = [idParamValidator];

export const createCategoryValidator = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage("El nombre debe tener entre 2 y 30 caracteres"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("La descripción no puede superar los 200 caracteres"),
];

export const updateCategoryValidator = [
  idParamValidator,
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage("El nombre debe tener entre 2 y 30 caracteres"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("La descripción no puede superar los 200 caracteres"),
];
