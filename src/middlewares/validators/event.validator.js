import mongoose from "mongoose";
import { body } from "express-validator";
import { CategoryModel } from "../../models/category.model.js";
import { idParamValidator, field } from "./common.validator.js";

const categoriesExist = async (ids) => {
  // Si el formato es inválido, ya lo reporta la regla de isMongoId
  if (!Array.isArray(ids) || !ids.every((id) => mongoose.isValidObjectId(id)))
    return true;

  const unique = [...new Set(ids.map(String))];
  const count = await CategoryModel.countDocuments({ _id: { $in: unique } });

  if (count !== unique.length)
    throw new Error("Una o más categorías no existen");
  return true;
};

const eventRules = (required) => [
  field("title", required)
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage("El título debe tener entre 3 y 150 caracteres"),
  field("description", required)
    .trim()
    .isLength({ min: 20 })
    .withMessage("La descripción debe tener al menos 20 caracteres"),
  field("startDate", required)
    .isISO8601()
    .withMessage("Fecha de inicio inválida")
    .bail()
    .toDate(),
  field("endDate", required)
    .isISO8601()
    .withMessage("Fecha de fin inválida")
    .bail()
    .toDate()
    .custom((value, { req }) => {
      const start = req.body.startDate;
      if (start && value <= new Date(start)) {
        throw new Error("endDate debe ser posterior a startDate");
      }
      return true;
    }),
  field("capacity", required)
    .isInt({ min: 1 })
    .withMessage("La capacidad debe ser un entero mayor o igual a 1")
    .toInt(),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser un número mayor o igual a 0")
    .toFloat(),
  body("status")
    .optional()
    .isIn(["scheduled", "cancelled", "finished"])
    .withMessage("Estado no permitido"),
  field("location.venue", required)
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("El lugar debe tener entre 3 y 100 caracteres"),
  field("location.address", required)
    .trim()
    .isLength({ min: 5, max: 150 })
    .withMessage("La dirección debe tener entre 5 y 150 caracteres"),
  field("location.city", required)
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("La ciudad debe tener entre 2 y 50 caracteres"),
  body("categories")
    .optional()
    .isArray()
    .withMessage("categories debe ser un array"),
  body("categories.*").isMongoId().withMessage("ID de categoría inválido"),
  body("categories").optional().custom(categoriesExist),
];

export const eventIdValidator = [idParamValidator];
export const createEventValidator = eventRules(true);
export const updateEventValidator = [idParamValidator, ...eventRules(false)];
