import jwt from "jsonwebtoken";
import { SECRET } from "../config.js";
import User from "../models/User.js";
import Role from "../models/Role.js";
import { errorResponse } from "../utils/response.js";

export const verifyToken = async (req, res, next) => {
  let token = req.cookies.token;

  if (!token)
    return res.status(403).json(errorResponse("Token no proporcionado"));

  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.id;

    const user = await User.findById(req.userId, { password: 0 });

    if (
      !user === null ||
      !user.isActivo ||
      user.isDeleted === true ||
      user === undefined
    )
      return res.status(403).json(errorResponse("Usuario no encontrado"));

    next();
  } catch (error) {
    return res.status(401).json(errorResponse("No autorizado"));
  }
};

export const isUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const roles = await Role.find({ _id: { $in: user.roles } });

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "user") {
        next();
        return;
      }
    }

    return res.status(403).json(errorResponse("Requiere rol de Usuario"));
  } catch (error) {
    return res.status(500).json(errorResponse("Error interno del servidor"));
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const roles = await Role.find({ _id: { $in: user.roles } });

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
    }

    return res.status(403).json(errorResponse("Requiere rol de Administrador"));
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse("Error interno del servidor"));
  }
};

export const isAsesor = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const roles = await Role.find({ _id: { $in: user.roles } });

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "asesor") {
        next();
        return;
      }
    }

    return res.status(403).json(errorResponse("Requiere rol de Asesor"));
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse("Error interno del servidor"));
  }
};

export const isAdminOrUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const roles = await Role.find({ _id: { $in: user.roles } });

    if (roles.some((role) => ["admin", "user"].includes(role.name))) {
      next();
    } else {
      return res
        .status(403)
        .json(errorResponse("Requiere rol de Administrador o Usuario"));
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse("Error interno del servidor"));
  }
};

export const isAdminOrAsesor = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const roles = await Role.find({ _id: { $in: user.roles } });

    if (roles.some((role) => ["admin", "asesor"].includes(role.name))) {
      next();
    } else {
      return res
        .status(403)
        .json(errorResponse("Requiere rol de Administrador o Asesor"));
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse("Error interno del servidor"));
  }
};

export const isAdminOrUserOrAsesor = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const roles = await Role.find({ _id: { $in: user.roles } });

    if (roles.some((role) => ["admin", "user", "asesor"].includes(role.name))) {
      next();
    } else {
      return res
        .status(403)
        .json(errorResponse("Requiere rol de Administrador, Usuario o Asesor"));
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse("Error interno del servidor"));
  }
};
