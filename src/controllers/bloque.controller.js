import Bloque from "../models/Bloque.js";
import { errorResponse, successResponse } from "../utils/response.js";

import dayjs from "dayjs";

/*
fecha: yyyy-mm-dd
start: hh:mm:ss
end: hh:mm:ss
*/
export const createBloque = async (req, res) => {
  try {
    const { fecha, start, end } = req.body;

    const newStartTime = dayjs(`${fecha}T${start}`).toDate().getTime();
    const newEndTime = dayjs(`${fecha}T${end}`).toDate().getTime();

    // Obtener bloques existentes de la base de datos y convertir las fechas de string a objetos Date
    const existingBloques = await Bloque.find({
      fecha,
      isDeleted: false,
    });

    // Verificar si hay solapamiento con el nuevo bloque
    const isOverlapping = existingBloques.some((existingBloque) => {
      const existingStartTime = dayjs(
        `${existingBloque.fecha}T${existingBloque.start}`
      )
        .toDate()
        .getTime();
      const existingEndTime = dayjs(
        `${existingBloque.fecha}T${existingBloque.end}`
      )
        .toDate()
        .getTime();

      return (
        (newStartTime < existingEndTime && newEndTime > existingStartTime) ||
        (newStartTime >= existingStartTime && newStartTime < existingEndTime) ||
        (newEndTime > existingStartTime && newEndTime <= existingEndTime)
      );
    });

    if (isOverlapping) {
      return res
        .status(400)
        .json(errorResponse("El nuevo bloque se cruza con bloques existentes"));
    }

    const bloque = new Bloque({
      fecha,
      start,
      end,
    });

    await bloque.save();

    return res
      .status(201)
      .json(successResponse("Bloque creado correctamente", bloque));
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const getBloques = async (req, res) => {
  try {
    const bloques = await Bloque.find({ isDeleted: false });

    return res
      .status(200)
      .json(successResponse("Bloques obtenidos correctamente", bloques));
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const getBloque = async (req, res) => {
  try {
    const bloque = await Bloque.findById(req.params.bloqueId);

    if (!bloque || bloque.isDeleted) {
      return res.status(404).json(errorResponse("Bloque no encontrado"));
    }

    return res
      .status(200)
      .json(successResponse("Bloque obtenido correctamente", bloque));
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const updateBloque = async (req, res) => {
  try {
    const bloque = await Bloque.findById(req.params.bloqueId);

    if (!bloque || bloque.isDeleted) {
      return res.status(404).json(errorResponse("Bloque no encontrado"));
    }

    const updBloque = await Bloque.findByIdAndUpdate(
      req.params.bloqueId,
      req.body,
      { new: true }
    );

    return res
      .status(200)
      .json(successResponse("Bloque actualizado correctamente", updBloque));
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const deleteBloque = async (req, res) => {
  try {
    const bloque = await Bloque.findById(req.params.bloqueId);

    if (!bloque) {
      return res.status(404).json(errorResponse("Bloque no encontrado"));
    }

    bloque.isDeleted = true;

    await bloque.save();

    return res
      .status(200)
      .json(successResponse("Bloque eliminado correctamente", bloque));
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const getBloquesByEstado = async (req, res) => {
  try {
    const bloques = await Bloque.find({
      estado: req.params.estado,
      isDeleted: false,
    });

    if (!bloques || bloques.length === 0) {
      return res.status(404).json(errorResponse("No hay bloques disponibles"));
    }

    return res
      .status(200)
      .json(successResponse("Bloques obtenidos correctamente", bloques));
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const getBloquesLibresByFecha = async (req, res) => {
  try {
    const bloques = await Bloque.find({
      fecha: req.params.fecha,
      estado: "libre",
      isDeleted: false,
    });

    if (!bloques || bloques.length === 0) {
      return res.status(404).json(errorResponse("No hay bloques disponibles"));
    }

    return res
      .status(200)
      .json(successResponse("Bloques obtenidos correctamente", bloques));
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const ver_disponibilidad = async (req, res) => {
  try {
    //verificar si la fecha es valida
    const fecha = dayjs(req.body.fecha);
    if (!fecha.isValid()) {
      return res.status(400).json(errorResponse("Fecha inválida"));
    }

    // Obtener la fecha actual
    const today = dayjs().startOf("day");

    // Verificar si la fecha es menor a la actual
    if (fecha.isBefore(today)) {
      return res
        .status(400)
        .json(errorResponse("La fecha no puede ser menor a la actual"));
    }

    const bloques = await Bloque.find({
      fecha: req.body.fecha,
      estado: "libre",
      isDeleted: false,
    }).select("start end");

    if (!bloques || bloques.length === 0) {
      return res
        .status(404)
        .json(errorResponse("Para esta fecha no hay bloques disponibles"));
    }

    return res
      .status(200)
      .json(successResponse("Bloques obtenidos correctamente", bloques));
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};
