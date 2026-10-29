import { body, param } from "express-validator";

export const idParamValidator = param("id")
  .isMongoId()
  .withMessage("ID inválido");

export const field = (name, required) =>
  required ? body(name) : body(name).optional();

export const profileRules = (prefix, required) => [
  field(`${prefix}firstName`, required)
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .bail()
    .matches(/^[\p{L} ]+$/u)
    .withMessage("El nombre solo puede contener letras"),
  field(`${prefix}lastName`, required)
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("El apellido debe tener entre 2 y 50 caracteres")
    .bail()
    .matches(/^[\p{L} ]+$/u)
    .withMessage("El apellido solo puede contener letras"),
  body(`${prefix}birthDate`)
    .optional()
    .isISO8601()
    .withMessage("Fecha de nacimiento inválida")
    .bail()
    .toDate()
    .custom((value) => {
      if (value > new Date())
        throw new Error("La fecha de nacimiento no puede ser futura");
      return true;
    }),
  body(`${prefix}phone`)
    .optional()
    .matches(/^\d{8,15}$/)
    .withMessage("El teléfono debe tener solo números (entre 8 y 15 dígitos)"),
];
