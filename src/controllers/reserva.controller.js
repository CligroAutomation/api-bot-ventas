import dayjs from "dayjs";
import Item from "../models/Item.js";
import Reserva from "../models/Reserva.js";
import User from "../models/User.js";
import { ESTADOS } from "../models/Reserva.js";
import Bloque from "../models/Bloque.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const createReserva = async (req, res) => {
  try {
    const { bloque, items, observacion } = req.body;
    const { userId } = req;

    // Recupera la información completa de cada item a través de sus IDs
    const itemsDetails = await Promise.all(
      items.map(async (item) => {
        const itemDetail = await Item.findById(item);
        return {
          item: item,
          data: itemDetail.toObject(),
        };
      })
    );

    //verifica que los item existan
    const itemsExist = itemsDetails.every(
      (detail) => detail.data !== null && detail.data.isDeleted !== true
    );

    if (!itemsExist) {
      return res.status(400).json(errorResponse("Algunos items no existen"));
    }

    // Validar que todos los items sean de tipo servicio
    const itemsTipoProducto = itemsDetails.every(
      (detail) => detail.data.tipo === "servicio"
    );

    if (!itemsTipoProducto) {
      return res
        .status(400)
        .json(errorResponse("Todos los items deben ser de tipo servicio"));
    }

    const detailBloque = await Bloque.findById(bloque);

    if (
      !detailBloque ||
      detailBloque.isDeleted === true ||
      detailBloque.estado !== "libre"
    ) {
      return res
        .status(400)
        .json(errorResponse("Este bloque no esta disponible"));
    }

    const user = await User.findById(userId, { isDeleted: false });

    if (!user) {
      return res.status(404).json(errorResponse("El usuario no es valido"));
    }

    const total = itemsDetails.reduce(
      (acc, detail) => acc + detail.data.precio,
      0
    );

    const newReserva = new Reserva({
      user: userId,
      items: items,
      bloque,
      total,
      observacion,
    });

    detailBloque.estado = "ocupado";
    detailBloque.reserva = newReserva._id;

    await Promise.all([newReserva.save(), detailBloque.save()]);

    return res
      .status(201)
      .json(successResponse("Reserva creada con éxito", newReserva));
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
};

export const reservar = async (req, res) => {
  try {
    const { idBloque, idItems, observacion, idUsuario } = req.body;

    // Recupera la información completa de cada item a través de sus IDs
    const itemsDetails = await Promise.all(
      idItems.map(async (item) => {
        const itemDetail = await Item.findById(item);
        return {
          item: item,
          data: itemDetail.toObject(),
        };
      })
    );

    //verifica que los item existan
    const itemsExist = itemsDetails.every(
      (detail) => detail.data !== null && detail.data.isDeleted !== true
    );

    if (!itemsExist) {
      return res.status(400).json(errorResponse("Algunos items no existen"));
    }

    // Validar que todos los items sean de tipo servicio
    const itemsTipoProducto = itemsDetails.every(
      (detail) => detail.data.tipo === "servicio"
    );

    if (!itemsTipoProducto) {
      return res
        .status(400)
        .json(errorResponse("Todos los items deben ser de tipo servicio"));
    }

    const detailBloque = await Bloque.findById(idBloque);

    //vefirificar que la hora de finalizacion del bloque sea menor a la hora actual con dayjs
    const now = dayjs();
    const end = dayjs(`${detailBloque.fecha}T${detailBloque.end}`);

    if (end.isBefore(now)) {
      return res
        .status(400)
        .json(errorResponse("No se pueden reservar bloques pasados"));
    }

    if (
      !detailBloque ||
      detailBloque.isDeleted === true ||
      detailBloque.estado !== "libre"
    ) {
      return res
        .status(400)
        .json(errorResponse("Este bloque no esta disponible"));
    }

    //verifica que el usuario exista
    const user = await User.findById(idUsuario, { isDeleted: false });

    if (!user) {
      return res.status(404).json(errorResponse("El usuario no es valido"));
    }

    const total = itemsDetails.reduce(
      (acc, detail) => acc + detail.data.precio,
      0
    );

    const newReserva = new Reserva({
      user: idUsuario,
      items: idItems,
      bloque: idBloque,
      total,
      observacion,
    });

    detailBloque.estado = "ocupado";
    detailBloque.reserva = newReserva._id;

    await Promise.all([newReserva.save(), detailBloque.save()]);

    const reservaResult = await Reserva.findById(newReserva._id)
      .populate({
        path: "bloque",
        select: "fecha start end",
      })
      .populate({
        path: "items",
        select: "nombre descripcion precio categoria",
        populate: {
          path: "categoria",
          select: "nombre",
        },
      })
      .exec();

    return res
      .status(201)
      .json(successResponse("Reserva creada con éxito", reservaResult));
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
};

export const getMyReservas = async (req, res) => {
  try {
    const { userId } = req;
    const reservas = await Reserva.find({ user: userId, isDeleted: false })
      .populate("items")
      .populate("bloque");

    return res
      .status(200)
      .json(successResponse("Reservas recuperadas con éxito", reservas));
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
};

export const getMyReserva = async (req, res) => {
  try {
    const { userId } = req;
    const { reservaId } = req.params;

    const reserva = await Reserva.findOne({
      _id: reservaId,
      user: userId,
      isDeleted: false,
    })
      .populate("items")
      .populate("bloque");

    if (!reserva) {
      return res.status(404).json(errorResponse("Reserva no encontrada"));
    }

    return res
      .status(200)
      .json(successResponse("Reserva recuperada con éxito", reserva));
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
};

export const getReservas = async (req, res) => {
  try {
    const reservas = await Reserva.find({ isDeleted: false })
      .populate("items")
      .populate("bloque");

    return res
      .status(200)
      .json(successResponse("Reservas recuperadas con éxito", reservas));
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
};

export const getReservaById = async (req, res) => {
  try {
    const { reservaId } = req.params;
    const reserva = await Reserva.findById(reservaId)
      .populate("items")
      .populate("bloque");

    if (!reserva || reserva.isDeleted === true) {
      return res.status(404).json(errorResponse("Reserva no encontrada"));
    }

    return res
      .status(200)
      .json(successResponse("Reserva recuperada con éxito", reserva));
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
};

export const updateReserva = async (req, res) => {
  try {
    const { reservaId } = req.params;
    const { estado } = req.body;

    if (!ESTADOS.includes(estado)) {
      return res.status(400).json(errorResponse("Estado inválido"));
    }

    const reserva = await Reserva.findById(reservaId);

    if (!reserva || reserva.isDeleted === true) {
      return res.status(404).json(errorResponse("Reserva no encontrada"));
    }

    reserva.estado = estado;

    await reserva.save();

    return res
      .status(200)
      .json(successResponse("Reserva actualizada con éxito", reserva));
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
};

export const deleteReserva = async (req, res) => {
  try {
    const { reservaId } = req.params;

    const reserva = await Reserva.findById(reservaId);

    if (!reserva || reserva.isDeleted === true) {
      return res.status(404).json(errorResponse("Reserva no encontrada"));
    }

    reserva.isDeleted = true;

    await reserva.save();

    return res
      .status(200)
      .json(successResponse("Reserva eliminada con éxito", reserva));
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
};

export const getReservasByEstado = async (req, res) => {
  try {
    const { estado } = req.params;

    if (!ESTADOS.includes(estado)) {
      return res.status(400).json(errorResponse("Estado inválido"));
    }

    const reservas = await Reserva.find({ estado, isDeleted: false })
      .populate("items")
      .populate("bloque");

    return res
      .status(200)
      .json(successResponse("Reservas recuperadas con éxito", reservas));
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
};

export const getReservasByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const reservas = await Reserva.find({ user: userId, isDeleted: false })
      .populate("items")
      .populate("bloque");

    return res
      .status(200)
      .json(successResponse("Reservas recuperadas con éxito", reservas));
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
};

export const getReserva = async (req, res) => {
  try {
    const { reservaId } = req.params;

    const reserva = await Reserva.findById(reservaId)
      .populate("items")
      .populate("bloque");

    if (!reserva || reserva.isDeleted === true) {
      return res.status(404).json(errorResponse("Reserva no encontrada"));
    }

    return res
      .status(200)
      .json(successResponse("Reserva recuperada con éxito", reserva));
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
};
