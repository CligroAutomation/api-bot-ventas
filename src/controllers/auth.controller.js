import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Role from "../models/Role.js";
import { SECRET } from "../config.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const signupHandler = async (req, res) => {
  try {
    const { nombre, apellido, telefono, password, roles } = req.body;

    const newUser = new User({
      nombre,
      apellido,
      telefono,
      password,
    });

    if (roles) {
      const foundRoles = await Role.find({ name: { $in: roles } });
      newUser.roles = foundRoles.map((role) => role._id);
    } else {
      const role = await Role.findOne({ name: "user" });
      newUser.roles = [role._id];
    }

    const savedUser = await newUser.save();

    const token = jwt.sign({ id: savedUser._id }, SECRET, {
      expiresIn: "365d", //24 * 3600000, // 24 hours
    });

    return res
      .status(200)
      .json(successResponse("Usuario registrado correctamente", { token }));
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error al registrar el usuario"));
  }
};

export const signinHandler = async (req, res) => {
  try {
    const { telefono, password } = req.body;

    const userFound = await User.findOne({
      telefono,
    }).populate("roles");

    if (!userFound)
      return res
        .status(400)
        .json(errorResponse("Número de teléfono incorrecto"));

    const matchPassword = await User.comparePassword(
      password,
      userFound.password
    );

    if (!matchPassword)
      return res.status(401).json(errorResponse("Contraseña incorrecta"));

    if (!userFound.isActivo)
      return res.status(401).json(errorResponse("Usuario no activo"));

    const token = jwt.sign({ id: userFound._id }, SECRET, {
      expiresIn: "365d", //24 * 3600000, // 24 hours
    });

    const userData = {
      id: userFound._id,
      nombre: userFound.nombre,
      apellido: userFound.apellido,
      telefono: userFound.telefono,
      isThereadId: userFound.isThereadId,
      theread_id: userFound.theread_id,
      isActivo: userFound.isActivo,
      roles: userFound.roles,
      createdAt: userFound.createdAt,
    };

    res
      .cookie("token", token, {
        maxAge: 24 * 3600000,
        httpOnly: false,
        secure: true,
        sameSite: "none",
        proxy: true,
      })
      .json(successResponse("Inicio de sesión exitoso", userData));
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};

export const signoutHandler = async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: false,
      secure: true,
      sameSite: "none",
      proxy: true,
    });

    return res.status(200).json(successResponse("Cierre de sesión exitoso"));
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Error interno en el servidor"));
  }
};
