import { Router } from "express";
import {
  createOrden,
  getOrden,
  getOrdenes,
  updateOrden,
  deleteOrden,
  getOrdenesByEstado,
  getOrdenesByTipo,
  getOrdenesByUser,
  getMyOrdenes,
  getMyOrden,
} from "../controllers/orden.controller.js";

import {
  isAdmin,
  verifyToken,
  isAdminOrAsesor,
} from "../middlewares/authJwt.js";

const router = Router();

router.post("/", [verifyToken], createOrden);

router.get("/", [verifyToken, isAdminOrAsesor], getOrdenes);
router.get("/:ordenId", [verifyToken, isAdminOrAsesor], getOrden);
router.put("/:ordenId", [verifyToken, isAdminOrAsesor], updateOrden);
router.delete("/:ordenId", [verifyToken, isAdminOrAsesor], deleteOrden);
router.get(
  "/estado/:estado",
  [verifyToken, isAdminOrAsesor],
  getOrdenesByEstado
);
router.get("/tipo/:tipo", [verifyToken, isAdminOrAsesor], getOrdenesByTipo);
router.get("/user/:userId", [verifyToken, isAdminOrAsesor], getOrdenesByUser);

router.get("/my", [verifyToken], getMyOrdenes);
router.get("/my/:ordenId", [verifyToken], getMyOrden);

export default router;
