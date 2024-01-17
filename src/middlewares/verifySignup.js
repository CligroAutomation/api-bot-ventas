import User from "../models/User.js";
import { ROLES } from "../models/Role.js";
import { errorResponse } from "../utils/response.js";

export const checkExistingUser = async (req, res, next) => {
  try {
    const userFound = await User.findOne({ username: req.body.username });
    if (userFound)
      return res
        .status(400)
        .json(errorResponse("El usuario con este nombre de usuario ya existe"));

    const email = await User.findOne({ email: req.body.email });
    if (email)
      return res
        .status(400)
        .json(errorResponse("El correo está siendo usado por otro usuario"));

    next();
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
};

export const checkExistingRole = (req, res, next) => {
  if (!req.body.roles || req.body.roles.length === 0) {
    return res.status(400).json(errorResponse("No se proporcionaron roles"));
  }

  for (let i = 0; i < req.body.roles.length; i++) {
    if (!ROLES.includes(req.body.roles[i])) {
      return res
        .status(400)
        .json(errorResponse(`El rol ${req.body.roles[i]} no existe`));
    }
  }

  next();
};

export const checkIsActivo = async (req, res, next) => {
  try {
    const userFound = await User.findById(req.userId);

    if (!userFound.isActivo)
      return res.status(400).json(errorResponse("Usuario no activo"));

    next();
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
};
