import { matchedData } from "express-validator";
import { CategoryModel } from "../models/category.model.js";
import { EventModel } from "../models/event.model.js";

export const createCategory = async (req, res) => {
  try {
    const { name, description } = matchedData(req);

    const existing = await categoryModel.findOne({ name });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Ya existe una categoria con ese nombre" });
    }

    const category = await CategoryModel.create({ name, description });

    return res
      .status(201)
      .json({ message: "Categoría creada con éxito", category });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};
export const getCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    return res.status(200).json({ categories });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = matchedData(req);

    const category = await CategoryModel.findById(id).populate("events");
    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    return res.status(200).json({ category });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id, ...data } = matchedData(req);

    const category = await CategoryModel.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    if (data.name) {
      const duplicated = await CategoryModel.findOne({
        name: data.name,
        _id: { $ne: id },
      });
      if (duplicated) {
        return res
          .status(400)
          .json({ message: "Ya existe otra categoría con ese nombre" });
      }
    }

    const updated = await CategoryModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    return res
      .status(200)
      .json({ message: "Categoría actualizada con éxito", category: updated });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = matchedData(req);

    const category = await CategoryModel.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    await EventModel.updateMany(
      { categories: id },
      { $pull: { categories: id } },
    );

    await CategoryModel.findByIdAndDelete(id);

    return res.status(200).json({ message: "Categoría eliminada con éxito" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};
