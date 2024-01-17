import Item from "../models/Item.js";
import Orden from "../models/Orden.js";
import { ESTADOS } from "../models/Orden.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const createOrden = async (req, res) => {
  try {
    const { items, tipo, observacion } = req.body;
    const { userId } = req;

    // Recupera la información completa de cada item a través de sus IDs
    const itemsDetails = await Promise.all(
      items.map(async (item) => {
        const itemDetail = await Item.findById(item.item);
        return {
          item: item.item,
          data: itemDetail.toObject(),
          cantidad: item.cantidad,
        };
      })
    );

    // Validar que todos los items sean de tipo producto
    const itemsTipoProducto = itemsDetails.every(
      (item) => item.data.tipo === "producto"
    );

    if (!itemsTipoProducto) {
      return res
        .status(400)
        .json(errorResponse("Todos los items deben ser de tipo producto"));
    }

    const total = itemsDetails.reduce(
      (acc, item) => acc + item.data.precio * item.cantidad,
      0
    );

    const newOrden = new Orden({
      user: userId,
      items: items,
      tipo,
      total,
      observacion,
    });

    if (tipo === "Envio") {
      const { direccion } = req.body;

      if (!direccion || direccion === "") {
        return res
          .status(400)
          .json(
            errorResponse(
              "La direccion es requerida para el tipo de orden Envio"
            )
          );
      }

      newOrden.direccion = direccion;
    }

    const ordenSaved = await newOrden.save();

    return res
      .status(200)
      .json(successResponse("Orden creada correctamente", ordenSaved));
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const createOrdenAdmin = async (req, res) => {
  try {
    const { items, tipo, observacion, userId } = req.body;

    // Recupera la información completa de cada item a través de sus IDs
    const itemsDetails = await Promise.all(
      items.map(async (item) => {
        const itemDetail = await Item.findById(item.item);
        return {
          item: item.item,
          data: itemDetail.toObject(),
          cantidad: item.cantidad,
        };
      })
    );

    // Validar que todos los items sean de tipo producto
    const itemsTipoProducto = itemsDetails.every(
      (item) => item.data.tipo === "producto"
    );

    if (!itemsTipoProducto) {
      return res
        .status(400)
        .json(errorResponse("Todos los items deben ser de tipo producto"));
    }

    const total = itemsDetails.reduce(
      (acc, item) => acc + item.data.precio * item.cantidad,
      0
    );

    const newOrden = new Orden({
      user: userId,
      items: items,
      tipo,
      total,
      observacion,
    });

    if (tipo === "Envio") {
      const { direccion } = req.body;

      if (!direccion || direccion === "") {
        return res
          .status(400)
          .json(
            errorResponse(
              "La direccion es requerida para el tipo de orden Envio"
            )
          );
      }

      newOrden.direccion = direccion;
    }

    const ordenSaved = await newOrden.save();

    return res
      .status(200)
      .json(successResponse("Orden creada correctamente", ordenSaved));
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const getOrdenes = async (req, res) => {
  try {
    const ordenes = await Orden.find({ isDeleted: false })
      .populate({
        path: "user",
        model: "User",
      })
      .populate({
        path: "items.item",
        model: "Item",
      });

    return res
      .status(200)
      .json(successResponse("Ordenes obtenidas correctamente", ordenes));
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const getOrden = async (req, res) => {
  try {
    const orden = await Orden.findById(req.params.ordenId)
      .populate({
        path: "user",
        model: "User",
      })
      .populate({
        path: "items.item",
        model: "Item",
      });

    if (!orden || orden.isDeleted) {
      return res.status(404).json(errorResponse("Orden no encontrada"));
    }

    return res
      .status(200)
      .json(successResponse("Orden obtenida correctamente", orden));
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const updateOrden = async (req, res) => {
  try {
    const ordenId = req.params.ordenId;
    const { estado } = req.body;

    let orden = await Orden.findById(ordenId);

    if (!orden || orden.isDeleted) {
      return res.status(404).json(errorResponse("Orden no encontrada"));
    }

    //verifica que el estado sea valido
    if (!ESTADOS.includes(estado)) {
      return res.status(400).json(errorResponse("Estado no valido"));
    }

    orden.estado = estado;

    const updatedOrden = await orden.save();

    return res
      .status(200)
      .json(successResponse("Orden actualizada correctamente", updatedOrden));
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const deleteOrden = async (req, res) => {
  try {
    const orden = await Orden.findById(req.params.ordenId);

    if (!orden || orden.isDeleted) {
      return res.status(404).json(errorResponse("Orden no encontrada"));
    }

    orden.isDeleted = true;

    await orden.save();

    return res
      .status(200)
      .json(successResponse("Orden eliminada correctamente", orden));
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const getOrdenesByUser = async (req, res) => {
  try {
    const ordenes = await Orden.find({
      user: req.params.userId,
      isDeleted: false,
    })
      .populate({
        path: "user",
        model: "User",
      })
      .populate({
        path: "items.item",
        model: "Item",
      });

    return res
      .status(200)
      .json(successResponse("Ordenes obtenidas correctamente", ordenes));
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const getMyOrdenes = async (req, res) => {
  try {
    const ordenes = await Orden.find({
      user: req.userId,
      isDeleted: false,
    })
      .populate({
        path: "user",
        model: "User",
      })
      .populate({
        path: "items.item",
        model: "Item",
      });

    return res
      .status(200)
      .json(successResponse("Ordenes obtenidas correctamente", ordenes));
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const getMyOrden = async (req, res) => {
  try {
    const orden = await Orden.findOne({
      _id: req.params.ordenId,
      user: req.userId,
      isDeleted: false,
    })
      .populate({
        path: "user",
        model: "User",
      })
      .populate({
        path: "items.item",
        model: "Item",
      });

    if (!orden) {
      return res.status(404).json(errorResponse("Orden no encontrada"));
    }

    return res
      .status(200)
      .json(successResponse("Orden obtenida correctamente", orden));
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const getOrdenesByEstado = async (req, res) => {
  try {
    const ordenes = await Orden.find({
      estado: req.params.estado,
      isDeleted: false,
    })
      .populate({
        path: "user",
        model: "User",
      })
      .populate({
        path: "items.item",
        model: "Item",
      });

    return res
      .status(200)
      .json(successResponse("Ordenes obtenidas correctamente", ordenes));
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const getOrdenesByTipo = async (req, res) => {
  try {
    const ordenes = await Orden.find({
      tipo: req.params.tipo,
      isDeleted: false,
    })
      .populate({
        path: "user",
        model: "User",
      })
      .populate({
        path: "items.item",
        model: "Item",
      });

    return res
      .status(200)
      .json(successResponse("Ordenes obtenidas correctamente", ordenes));
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};
