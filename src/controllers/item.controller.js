import Item from "../models/Item.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { TIPOS } from "../models/Item.js";
import { uploadImage, deleteImage } from "../utils/cloudinary.js";

export const createItem = async (req, res) => {
  let imagenes = [];
  let imagenLink = [];

  try {
    const { nombre, descripcion, categoria, tipo, precio } = req.body;
    const { userId } = req;
    // Verifica si se proporcionó el campo 'files' en la solicitud
    if (!req.files || Object.keys(req.files).length === 0) {
      return res
        .status(400)
        .json(errorResponse("No se proporcionó ninguna imagen."));
    }

    // Obtén la información de la imagen desde 'req.files.imagen'
    const imagen = req.files.imagen;

    // Si solo hay una imagen, colócala en un array para manejarla de manera uniforme
    if (Array.isArray(imagen)) {
      imagenes = imagen;
    } else {
      imagenes.push(imagen);
    }

    // Sube las imágenes y obtén sus enlaces
    for (let i = 0; i < imagenes.length; i++) {
      const { public_id, url } = await uploadImage(
        "items",
        nombre,
        imagenes[i]
      );
      imagenLink.push({ public_id, url });
    }

    // Crea un array de objetos con las URLs y public_ids de las imágenes
    const imagenesArray = imagenLink.map((img) => ({
      public_id: img.public_id,
      url: img.url,
    }));

    // Crea un nuevo objeto Item con los datos proporcionados
    const newItem = new Item({
      nombre,
      descripcion,
      imagen: imagenesArray,
      categoria,
      tipo,
      precio,
      user: userId,
    });

    // Guarda el nuevo item en la base de datos
    const itemSaved = await newItem.save();

    return res
      .status(200)
      .json(successResponse("Item creado correctamente", itemSaved));
  } catch (error) {
    console.error(error);

    // Si hay algún error, elimina las imágenes que se hayan subido antes de fallar
    for (let i = 0; i < imagenLink.length; i++) {
      await deleteImage(imagenLink[i].public_id);
    }

    return res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const getItems = async (req, res) => {
  try {
    const items = await Item.find({
      isDeleted: false,
      isActivo: true,
    }).populate({
      path: "categoria",
    });
    return res
      .status(200)
      .json(successResponse("Items obtenidos correctamente", items));
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId).populate({
      path: "categoria",
    });

    if (!item || item.isDeleted) {
      return res.status(404).json(errorResponse("Item no encontrado"));
    }

    return res
      .status(200)
      .json(successResponse("Item obtenido correctamente", item));
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const updateItem = async (req, res) => {
  try {
    let itemId = req.params.itemId;

    let item = await Item.findById(itemId);

    if (!item || item.isDeleted) {
      return res.status(404).json(errorResponse("Item no encontrado"));
    }

    let imagenes = [];
    let imagenLink = [];

    if (req.files && req.files.imagen) {
      // Obtén la información de las nuevas imágenes desde 'req.files.imagen'
      const nuevasImagenes = req.files.imagen;

      // Si solo hay una nueva imagen, colócala en un array para manejarla de manera uniforme
      if (Array.isArray(nuevasImagenes)) {
        imagenes = nuevasImagenes;
      } else {
        imagenes.push(nuevasImagenes);
      }

      // Elimina las imágenes anteriores
      for (let i = 0; i < item.imagen.length; i++) {
        await deleteImage(item.imagen[i].public_id);
      }

      // Sube las nuevas imágenes y obtén sus enlaces
      for (let i = 0; i < imagenes.length; i++) {
        const { public_id, url } = await uploadImage(
          "items",
          item.nombre,
          imagenes[i]
        );
        imagenLink.push({ public_id, url });
      }

      req.body.imagen = imagenLink;
    }

    // Actualiza el item con la información proporcionada
    const updateItem = await Item.findByIdAndUpdate(itemId, req.body, {
      new: true,
      runValidators: true,
    });

    return res
      .status(200)
      .json(successResponse("Item actualizado correctamente", updateItem));
  } catch (error) {
    console.error(error);

    return res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const deletedItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.itemId,
      { isDeleted: true },
      { new: true }
    );

    if (!item) {
      return res.status(404).json(errorResponse("Item no encontrado"));
    }

    return res
      .status(200)
      .json(successResponse("Item eliminado correctamente", item));
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const getItemsByCategoria = async (req, res) => {
  try {
    const items = await Item.find({
      categoria: req.params.categoriaId,
      isDeleted: false,
    });

    return res
      .status(200)
      .json(successResponse("Items obtenidos correctamente", items));
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const getItemsByUser = async (req, res) => {
  try {
    const items = await Item.find({
      user: req.params.userId,
      isDeleted: false,
    });

    return res
      .status(200)
      .json(successResponse("Items obtenidos correctamente", items));
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const toggleItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);

    if (!item || item.isDeleted) {
      return res.status(404).json(errorResponse("Item no encontrado"));
    }

    item.isActivo = !item.isActivo;

    await item.save();

    return res
      .status(200)
      .json(
        successResponse(
          `Item ${item.isActivo ? "activado" : "desactivado"}`,
          item
        )
      );
  } catch (error) {
    console.log(error);

    return res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const getItemsByTipo = async (req, res) => {
  try {
    // Verifica que el tipo proporcionado sea válido

    if (!TIPOS.includes(req.params.tipo)) {
      return res.status(400).json(errorResponse("Tipo no válido"));
    }

    const items = await Item.find({
      tipo: req.params.tipo,
      isDeleted: false,
      isActivo: true,
    }).populate({
      path: "categoria",
    });

    return res
      .status(200)
      .json(successResponse("Items obtenidos correctamente", items));
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const obtener_servicios = async (req, res) => {
  try {
    const items = await Item.find({
      tipo: "servicio",
      isDeleted: false,
    })
      .select("nombre descripcion precio categoria")
      .populate({
        path: "categoria",
        select: "nombre",
      })
      .exec();
    return res
      .status(200)
      .json(successResponse("Items obtenidos correctamente", items));
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};
