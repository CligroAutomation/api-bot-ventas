import Categoria from "../models/Categoria.js";
import { errorResponse, successResponse } from "../utils/response.js";

export const createCategoria = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    const newCategoria = new Categoria({
      nombre,
      descripcion,
    });

    const categoriaSaved = await newCategoria.save();

    return res
      .status(200)
      .json(successResponse("Categoria creada correctamente", categoriaSaved));
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find({ isDeleted: false });

    return res
      .status(200)
      .json(successResponse("Categorias obtenidas correctamente", categorias));
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const getCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.categoriaId);

    if (!categoria) {
      return res.status(404).json(errorResponse("Categoria no encontrada"));
    }

    if (categoria.isDeleted) {
      return res.status(404).json(errorResponse("Categoria no encontrada"));
    }

    return res
      .status(200)
      .json(successResponse("Categoria obtenida correctamente", categoria));
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const updateCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.categoriaId);

    if (!categoria) {
      return res.status(404).json(errorResponse("Categoria no encontrada"));
    }

    if (categoria.isDeleted) {
      return res.status(404).json(errorResponse("Categoria no encontrada"));
    }

    const { nombre, descripcion } = req.body;

    categoria.nombre = nombre;
    categoria.descripcion = descripcion;

    await categoria.save();

    return res
      .status(200)
      .json(successResponse("Categoria actualizada correctamente", categoria));
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const deletedCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndUpdate(
      req.params.categoriaId,
      { isDeleted: true },
      { new: true }
    );

    if (!categoria) {
      return res.status(404).json(errorResponse("Categoria no encontrada"));
    }

    return res
      .status(200)
      .json(successResponse("Categoria eliminada correctamente", categoria));
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};
