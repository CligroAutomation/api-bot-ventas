import User from "../models/User.js";
import Role from "../models/Role.js";
import { errorResponse, successResponse } from "../utils/response.js";

export const createUser = async (req, res) => {
  try {
    let { nombre, apellido, telefono, password, roles } = req.body;

    if (!roles || roles.length === 0) {
      roles = ["user"];
    }

    const rolesFound = await Role.find({ name: { $in: roles } });

    const user = new User({
      nombre,
      apellido,
      telefono,
      password,
      roles: rolesFound.map((role) => role._id),
    });

    const savedUser = await user.save();

    const resuser = await User.findById(savedUser._id).populate("roles");

    return res
      .status(200)
      .json(successResponse("Usuario creado correctamente", resuser));
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(500).json(errorResponse("El telefono ya existe"));
    }

    return res.status(500).json(errorResponse("Error al crear el usuario"));
  }
};

export const crear_usuario = async (req, res) => {
  try {
    const { telefono, theread_id } = req.body;
    const password = telefono;
    const roles = ["user"];

    const rolesFound = await Role.find({ name: { $in: roles } });

    const user = new User({
      telefono,
      password,
      theread_id,
      isThereadId: true,
      roles: rolesFound.map((role) => role._id),
    });

    const savedUser = await user.save();

    return res.status(200).json(
      successResponse("Usuario creado correctamente", {
        _id: savedUser._id,
        telefono: savedUser.telefono,
        nombre: savedUser.nombre,
        apellido: savedUser.apellido,
        theread_id: savedUser.theread_id,
      })
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error al crear el usuario"));
  }
};

export const getAuthUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("roles");

    if (!user) {
      return res.status(404).json(errorResponse("Usuario no encontrado"));
    }

    if (user.isDeleted) {
      return res.status(404).json(errorResponse("Usuario no encontrado"));
    }

    return res.json(successResponse("Usuario obtenido correctamente", user));
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error al obtener el usuario"));
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("roles");

    if (!users || users.length === 0) {
      return res.status(404).json(errorResponse("No hay usuarios registrados"));
    }

    const resUsers = users.filter((user) => !user.isDeleted);

    return res.json(
      successResponse("Usuarios obtenidos correctamente", resUsers)
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error al obtener usuarios"));
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json(errorResponse("Usuario no encontrado"));
    }

    if (user.isDeleted) {
      return res.status(404).json(errorResponse("Usuario no encontrado"));
    }

    return res.status(200).json(successResponse("Usuario obtenido", user));
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error al obtener el usuario"));
  }
};

export const getUserTelefono = async (req, res) => {
  try {
    const user = await User.findOne({ telefono: req.params.telefono }).populate(
      "roles"
    );

    if (!user) {
      return res.status(404).json(errorResponse("Usuario no encontrado"));
    }

    if (user.isDeleted) {
      return res.status(404).json(errorResponse("Usuario no encontrado"));
    }

    return res.status(200).json(successResponse("Usuario obtenido", user));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(errorResponse("Error al obtener el usuario por telefono"));
  }
};

export const updateThereadId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { theread_id } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { theread_id, isThereadId: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json(errorResponse("Usuario no encontrado"));
    }

    res.json(successResponse("Theread actualizado", user));
  } catch (error) {
    console.error(error);
    res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const actualizar_hilo = async (req, res) => {
  try {
    const { theread_id, telefono } = req.body;

    const user = await User.findOneAndUpdate(
      { telefono },
      { theread_id, isThereadId: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json(errorResponse("Usuario no encontrado"));
    }

    res.json(
      successResponse("Theread actualizado", {
        _id: user._id,
        telefono: user.telefono,
        nombre: user.nombre,
        apellido: user.apellido,
        theread_id: user.theread_id,
      })
    );
  } catch (error) {
    console.error(error);
    res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { password } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json(errorResponse("Usuario no encontrado"));
    }

    user.password = password;
    await user.save();

    res.json(successResponse("Contraseña actualizada correctamente"));
  } catch (error) {
    console.error(error);
    res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const deletedUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isDeleted: true },
      { new: true }
    ).populate("roles");

    if (!user) {
      return res.status(404).json(errorResponse("Usuario no encontrado"));
    }

    res.json(successResponse("Usuario eliminado correctamente", user));
  } catch (err) {
    res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const deletedUserByTelefono = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { telefono: req.params.telefono },
      { isDeleted: true },
      { new: true }
    ).populate("roles");

    if (!user) {
      return res.status(404).json(errorResponse("Usuario no encontrado"));
    }

    res.json(successResponse("Usuario eliminado correctamente", user));
  } catch (err) {
    res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const updateActivo = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isActivo: req.body.isActivo },
      { new: true }
    ).populate("roles");

    if (!user) {
      return res.status(404).json(errorResponse("Usuario no encontrado"));
    }

    res.json(successResponse("Usuario actualizado correctamente", user));
  } catch (err) {
    res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const updateActivoByTelefono = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { telefono: req.params.telefono },
      { isActivo: req.body.isActivo },
      { new: true }
    ).populate("roles");

    if (!user) {
      return res.status(404).json(errorResponse("Usuario no encontrado"));
    }

    res.json(successResponse("Usuario actualizado correctamente", user));
  } catch (err) {
    res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
      new: true,
    }).populate("roles");

    if (!user) {
      return res.status(404).json(errorResponse("Usuario no encontrado"));
    }

    res.json(successResponse("Usuario actualizado correctamente", user));
  } catch (err) {
    res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const obtener_usuario = async (req, res) => {
  try {
    const { telefono } = req.body;
    const user = await User.findOne({ telefono: telefono })
      .select("telefono nombre apellido isDeleted isThereadId theread_id")
      .exec();

    if (!user || user.isDeleted) {
      return res.status(404).json(errorResponse("Usuario no encontrado"));
    }

    // Verifica si el nombre o el apellido son cadenas vacías
    if (user.nombre === "" || user.apellido === "") {
      return res.status(200).json(
        successResponse("Usuario obtenido, no tiene nombre ni apellido", {
          _id: user._id,
          telefono: user.telefono,
          isThereadId: user.isThereadId,
          theread_id: user.theread_id,
        })
      );
    }

    return res.status(200).json(
      successResponse("Usuario obtenido", {
        _id: user._id,
        telefono: user.telefono,
        nombre: user.nombre,
        apellido: user.apellido,
        isThereadId: user.isThereadId,
        theread_id: user.theread_id,
      })
    );
  } catch (error) {
    console.error(error);
    res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const actualizar_usuario = async (req, res) => {
  try {
    const { idUsuario, nombre, apellido } = req.body;
    const user = await User.findById(idUsuario, { isDeleted: false })
      .select("telefono nombre apellido")
      .exec();

    if (!user) {
      return res.status(404).json(errorResponse("Usuario no encontrado"));
    }

    user.nombre = nombre;
    user.apellido = apellido;
    await user.save();

    return res.status(200).json(successResponse("Usuario actualizado", user));
  } catch (error) {
    console.error(error);
    res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};
