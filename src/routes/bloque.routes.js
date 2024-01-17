import { Router } from "express";

import {
  createBloque,
  getBloque,
  getBloques,
  updateBloque,
  deleteBloque,
  getBloquesByEstado,
  getBloquesLibresByFecha,
} from "../controllers/bloque.controller.js";

import {
  isAdmin,
  verifyToken,
  isAdminOrAsesor,
} from "../middlewares/authJwt.js";

const router = Router();

router.post("/", [verifyToken, isAdmin], createBloque);

router.get("/", [verifyToken, isAdminOrAsesor], getBloques);
router.get("/:bloqueId", [verifyToken, isAdminOrAsesor], getBloque);
router.put("/:bloqueId", [verifyToken, isAdmin], updateBloque);
router.delete("/:bloqueId", [verifyToken, isAdmin], deleteBloque);
router.get(
  "/estado/:estado",
  [verifyToken, isAdminOrAsesor],
  getBloquesByEstado
);
router.get(
  "/libres/:fecha",
  [verifyToken, isAdminOrAsesor],
  getBloquesLibresByFecha
);

export default router;
