import { Router } from "express";

import {
  createBloque,
  ver_disponibilidad,
} from "../controllers/bloque.controller.js";
import { reservar } from "../controllers/reserva.controller.js";
import { obtener_servicios } from "../controllers/item.controller.js";
import {
  obtener_usuario,
  actualizar_usuario,
  crear_usuario,
  actualizar_hilo,
} from "../controllers/user.controller.js";

import { isAdmin, verifyToken } from "../middlewares/authJwt.js";

const router = Router();

router.post("/ver_disponibilidad", [verifyToken, isAdmin], ver_disponibilidad);

router.post("/reservar", [verifyToken, isAdmin], reservar);

router.get("/obtener_servicios", [verifyToken, isAdmin], obtener_servicios);

router.post("/obtener_usuario", [verifyToken, isAdmin], obtener_usuario);

router.put("/actualizar_usuario", [verifyToken, isAdmin], actualizar_usuario);

router.post("/crear_usuario", [verifyToken, isAdmin], crear_usuario);

router.put("/actualizar_hilo", [verifyToken, isAdmin], actualizar_hilo);

router.post("/crear_hueco", [verifyToken, isAdmin], createBloque);

export default router;
